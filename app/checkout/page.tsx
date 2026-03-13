"use client";

import React, { Suspense, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { useSearchParams, useRouter } from "next/navigation";
import { useSitesData } from "@/contexts/SitesContext";
import { useStorageCart, type CartItem } from "@/contexts/StorageCartContext";
import { ChevronLeft, CheckCircle2, Loader2, PartyPopper, X } from "lucide-react";
import {
  calculateCheckoutPricing,
  DEFAULT_RECURRING_DURATION_MONTHS,
  formatSquareFeet,
  formatStorageUnitLabel,
  MAX_RECURRING_DURATION_MONTHS,
  MIN_RECURRING_DURATION_MONTHS,
} from "@/lib/pricing/storagePricing";
import type { PaymentBookingAllocation } from "@/lib/db/entities/Payment";
import { PaymentProvider } from "@/lib/db/entities/Payment";
import type { ApiSite, ApiStorageUnit, ApiUnitType } from "@/lib/types/local";

type CheckoutSite = ApiSite;
type BillingType = "one_time" | "recurring";

interface CheckoutUnit extends ApiUnitType {
  priceAmount?: number;
}

interface CheckoutEntry {
  key: string;
  siteId: string;
  unitTypeId: string;
  storageUnitId?: string;
  quantity: number;
  site: CheckoutSite;
  unit: CheckoutUnit;
  preferredStorageUnit: ApiStorageUnit | null;
  pricing: ReturnType<typeof calculateCheckoutPricing>;
}

interface CheckoutResolution {
  entries: CheckoutEntry[];
  mode: "cart" | "direct" | null;
  error: string | null;
}

const paymentProviders = [
  {
    value: PaymentProvider.PAYSTACK,
    label: "Paystack",
    description: "Card, bank transfer, USSD, and other local payment methods.",
  },
  {
    value: PaymentProvider.FLUTTERWAVE,
    label: "Flutterwave",
    description: "Card and bank payments with Flutterwave checkout.",
  },
] as const;

const recurringDurationOptions = Array.from(
  { length: MAX_RECURRING_DURATION_MONTHS - MIN_RECURRING_DURATION_MONTHS + 1 },
  (_, index) => MIN_RECURRING_DURATION_MONTHS + index
);

function isAddOn(item: CartItem) {
  return item.itemType === "addon";
}

function resolveCartItemTarget(item: CartItem, sites: CheckoutSite[]) {
  if (item.siteId && item.unitTypeId) {
    return {
      siteId: item.siteId,
      unitTypeId: item.unitTypeId,
      storageUnitId: item.storageUnitId,
    };
  }

  const itemId = item.storageUnitId || item.unitId;
  if (!itemId) {
    return null;
  }

  const normalizedItemId = String(itemId);

  for (const site of sites) {
    for (const unitType of site.unitTypes || []) {
      if (unitType.id === normalizedItemId) {
        return {
          siteId: site.id,
          unitTypeId: unitType.id,
        };
      }

      const storageUnit = unitType.units?.find((unit) => unit.id === normalizedItemId);
      if (storageUnit) {
        return {
          siteId: site.id,
          unitTypeId: unitType.id,
          storageUnitId: storageUnit.id,
        };
      }
    }
  }

  return null;
}

function createCheckoutEntry({
  key,
  quantity,
  site,
  unit,
  storageUnitId,
}: {
  key: string;
  quantity: number;
  site: CheckoutSite;
  unit: CheckoutUnit;
  storageUnitId?: string;
}): CheckoutEntry {
  const preferredStorageUnit = unit.units?.find((entry) => entry.id === storageUnitId)
    ?? unit.units?.find((entry) => entry.status === "available")
    ?? null;

  return {
    key,
    siteId: site.id,
    unitTypeId: unit.id,
    storageUnitId,
    quantity,
    site,
    unit,
    preferredStorageUnit,
    pricing: calculateCheckoutPricing({
      width: Number(unit.dimensions.width || 0),
      depth: Number(unit.dimensions.depth || 0),
      unit: unit.dimensions.unit,
    }),
  };
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function formatRecurringEndDate(startDate: Date, durationMonths: number) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(addMonths(startDate, durationMonths));
}

function buildDirectCheckout({
  sites,
  siteId,
  unitTypeId,
  storageUnitId,
  sitesError,
}: {
  sites: CheckoutSite[];
  siteId: string | null;
  unitTypeId: string | null;
  storageUnitId: string | null;
  sitesError: string | null;
}): CheckoutResolution {
  const site = sites.find((entry) => entry.id === siteId);
  if (!site || !unitTypeId) {
    return {
      entries: [],
      mode: "direct",
      error: sitesError || "Storage location not found.",
    };
  }

  const unit = site.unitTypes?.find((entry) => entry.id === unitTypeId) ?? null;
  if (!unit) {
    return {
      entries: [],
      mode: "direct",
      error: "We couldn't find the selected storage unit. Please choose a unit again.",
    };
  }

  return {
    entries: [
      createCheckoutEntry({
        key: `${site.id}:${unit.id}:${storageUnitId ?? "direct"}`,
        quantity: 1,
        site,
        unit,
        storageUnitId: storageUnitId ?? undefined,
      }),
    ],
    mode: "direct",
    error: null,
  };
}

function buildCartCheckout({
  sites,
  cartItems,
}: {
  sites: CheckoutSite[];
  cartItems: CartItem[];
}): CheckoutResolution {
  if (cartItems.length === 0) {
    return {
      entries: [],
      mode: "cart",
      error: "Your storage cart is empty. Add a storage unit before checkout.",
    };
  }

  const entries: CheckoutEntry[] = [];

  for (const item of cartItems) {
    const target = resolveCartItemTarget(item, sites);
    if (!target) {
      return {
        entries: [],
        mode: "cart",
        error: `We couldn't match "${item.size}" to a storage unit. Remove it from your cart and try again.`,
      };
    }

    const site = sites.find((entry) => entry.id === target.siteId);
    const unit = site?.unitTypes?.find((entry) => entry.id === target.unitTypeId) ?? null;

    if (!site || !unit) {
      return {
        entries: [],
        mode: "cart",
        error: `We couldn't load the latest pricing for "${item.size}". Remove it from your cart and try again.`,
      };
    }

    entries.push(
      createCheckoutEntry({
        key: `${site.id}:${unit.id}:${target.storageUnitId ?? item.unitId ?? item.size}`,
        quantity: Math.max(1, Number(item.quantity) || 1),
        site,
        unit,
        storageUnitId: target.storageUnitId,
      })
    );
  }

  return {
    entries,
    mode: "cart",
    error: null,
  };
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sites, hasLoaded, error: sitesError } = useSitesData();
  const { cartItems } = useStorageCart();

  const siteId = searchParams.get("siteId");
  const unitTypeId = searchParams.get("unitTypeId");
  const storageUnitId = searchParams.get("storageUnitId");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [billingType, setBillingType] = useState<BillingType>("one_time");
  const [recurringDurationMonths, setRecurringDurationMonths] = useState(DEFAULT_RECURRING_DURATION_MONTHS);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);

  const storageCartItems = useMemo(
    () => cartItems.filter((item) => !isAddOn(item)),
    [cartItems]
  );
  const addOnItems = useMemo(
    () => cartItems.filter(isAddOn),
    [cartItems]
  );

  const checkout = useMemo<CheckoutResolution>(() => {
    if (!hasLoaded) {
      return {
        entries: [],
        mode: null,
        error: null,
      };
    }

    if (siteId && unitTypeId) {
      return buildDirectCheckout({
        sites,
        siteId,
        unitTypeId,
        storageUnitId,
        sitesError,
      });
    }

    return buildCartCheckout({
      sites,
      cartItems: storageCartItems,
    });
  }, [hasLoaded, siteId, sites, storageUnitId, sitesError, storageCartItems, unitTypeId]);

  const checkoutEntries = checkout.entries;
  const isCartCheckout = checkout.mode === "cart";
  const primaryEntry = checkoutEntries[0] ?? null;
  const storageSelectionCount = checkoutEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const checkoutLocations = new Set(checkoutEntries.map((entry) => entry.site.id)).size;
  const totalSquareFootage = checkoutEntries.reduce((sum, entry) => sum + (entry.pricing.squareFootage * entry.quantity), 0);
  const totalMonthlyRate = checkoutEntries.reduce((sum, entry) => sum + (entry.pricing.monthlyRate * entry.quantity), 0);
  const firstMonthAmount = checkoutEntries.reduce((sum, entry) => sum + (entry.pricing.dueTodayForFirstMonth * entry.quantity), 0);
  const recurringScheduleValue = totalMonthlyRate * recurringDurationMonths;
  const recurringEndDateLabel = formatRecurringEndDate(new Date(), recurringDurationMonths);
  const finalAmount = firstMonthAmount;
  const cartAddOnMessage = isCartCheckout && addOnItems.length > 0
    ? "Cart add-ons are not included in online checkout yet. Remove add-ons to continue."
    : null;
  const blockingError = checkout.error ?? cartAddOnMessage;
  const visibleError = error ?? blockingError;

  const handleCheckout = async (provider: PaymentProvider) => {
    if (checkoutEntries.length === 0) {
      setError(checkout.error || "Checkout details are incomplete. Please choose a storage unit again.");
      return;
    }

    if (cartAddOnMessage) {
      setError(cartAddOnMessage);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const bookingIds: string[] = [];
      const bookingAllocations: PaymentBookingAllocation[] = [];
      const startDate = new Date().toISOString();

      for (const entry of checkoutEntries) {
        const perBookingAmount = entry.pricing.dueTodayForFirstMonth;

        for (let index = 0; index < entry.quantity; index += 1) {
          const bookingRes = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              siteId: entry.siteId,
              unitTypeId: entry.unitTypeId,
              storageUnitId: index === 0 ? entry.preferredStorageUnit?.id : undefined,
              startDate,
              billingType,
              recurringDurationMonths: billingType === "recurring" ? recurringDurationMonths : undefined,
            }),
          });

          const bookingData = await bookingRes.json();
          if (!bookingData.ok || !bookingData.bookingId) {
            setError(bookingData.message || "Failed to create one of your bookings.");
            setSubmitting(false);
            return;
          }

          bookingIds.push(bookingData.bookingId);
          bookingAllocations.push({
            bookingId: bookingData.bookingId,
            amount: perBookingAmount,
          });
        }
      }

      const payRes = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingIds.length === 1 ? bookingIds[0] : undefined,
          bookingAllocations,
          provider,
          amount: finalAmount,
          checkoutSource: isCartCheckout ? "cart" : "direct",
          billingType,
          recurringDurationMonths: billingType === "recurring" ? recurringDurationMonths : undefined,
        }),
      });

      const payData = await payRes.json();
      if (payData.ok && payData.authorizationUrl) {
        window.location.assign(payData.authorizationUrl);
      } else {
        setError(payData.message || "Failed to initialize payment");
        setSubmitting(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const handleBeginCheckout = () => {
    if (checkoutEntries.length === 0) {
      setError(checkout.error || "Select a storage unit before continuing.");
      return;
    }

    if (cartAddOnMessage) {
      setError(cartAddOnMessage);
      return;
    }
    setError(null);
    setIsProviderModalOpen(true);
  };

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 font-bold mb-8 hover:underline uppercase text-xs tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {checkoutEntries.length === 0 ? (
          <div className="rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-xl shadow-blue-900/5">
            <h1 className="text-3xl font-black text-blue-900">Checkout unavailable</h1>
            <p className="mt-3 text-gray-500">{visibleError || "We couldn't find the selected storage unit. Please go back and choose a unit again."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <div>
                <h1 className="text-4xl font-black text-blue-900 mb-4">Booking Checkout</h1>
                <p className="text-gray-500 max-w-2xl text-lg">
                  {isCartCheckout
                    ? `Secure ${storageSelectionCount} storage unit${storageSelectionCount === 1 ? "" : "s"} across ${checkoutLocations} location${checkoutLocations === 1 ? "" : "s"}. Choose a one-time first month payment or recurring monthly billing for the full cart.`
                    : `Secure your unit at ${primaryEntry?.site.name}. Pay for the first month only, or set up recurring monthly billing with an end duration.`}
                </p>
                {!isCartCheckout && primaryEntry?.preferredStorageUnit?.unitNumber ? (
                  <p className="mt-2 text-sm font-semibold text-blue-600">Preferred unit: {primaryEntry.preferredStorageUnit.unitNumber}</p>
                ) : null}
                {isCartCheckout ? (
                  <p className="mt-2 text-sm font-semibold text-blue-600">Units are assigned from current availability when your bookings are created.</p>
                ) : null}
              </div>

              <section className="bg-white rounded-[2rem] p-10 shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16" />

                <h2 className="text-xl font-black text-blue-900 mb-8 flex items-center gap-2">
                  <div className="w-2 h-8 bg-blue-600 rounded-full" />
                  Cart Breakdown
                </h2>

                <div className="space-y-4">
                  {checkoutEntries.map((entry, index) => {
                    const lineMonthlyRate = entry.pricing.monthlyRate * entry.quantity;
                    const lineTodayAmount = entry.pricing.dueTodayForFirstMonth * entry.quantity;

                    return (
                      <div key={entry.key} className="flex items-center justify-between gap-4 p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                            {(index + 1).toString().padStart(2, "0")}
                          </div>
                          <div>
                            <span className="block font-black text-blue-900">
                              {formatStorageUnitLabel({
                                width: Number(entry.unit.dimensions.width),
                                depth: Number(entry.unit.dimensions.depth),
                                unit: entry.unit.dimensions.unit,
                              })}
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                              {entry.site.name} • {formatSquareFeet(entry.pricing.squareFootage)} each • Qty {entry.quantity}
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              ₦{entry.pricing.monthlyRate.toLocaleString()} monthly per unit
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-black text-blue-900 text-xl">₦{lineTodayAmount.toLocaleString()}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            ₦{lineMonthlyRate.toLocaleString()} monthly
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
                  <div className="w-2 h-8 bg-blue-600 rounded-full" />
                  Select Billing Option
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setBillingType("one_time")}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left ${billingType === "one_time"
                      ? "border-blue-600 bg-blue-50 shadow-lg"
                      : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${billingType === "one_time" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="block font-black text-blue-900 text-lg">One-Time First Month</span>
                    <span className="text-sm text-gray-500">Pay for the first month today. You can decide later whether to renew manually.</span>
                  </button>

                  <button
                    onClick={() => {
                      setBillingType("recurring");
                    }}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left ${billingType === "recurring"
                      ? "border-blue-600 bg-blue-50 shadow-lg"
                      : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${billingType === "recurring" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                      <PartyPopper className="w-6 h-6" />
                    </div>
                    <span className="block font-black text-blue-900 text-lg">Recurring Monthly</span>
                    <span className="text-sm text-gray-500">Pay the first month today, then continue monthly until your selected duration ends.</span>
                  </button>
                </div>

                {billingType === "recurring" ? (
                  <div className="rounded-[2rem] border border-blue-100 bg-white p-8">
                    <label htmlFor="recurringDurationMonths" className="block text-sm font-black uppercase tracking-[0.2em] text-blue-500">
                      Recurring duration
                    </label>
                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-2xl font-black text-blue-900">
                          {recurringDurationMonths} month{recurringDurationMonths === 1 ? "" : "s"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          The first month is charged now. Recurring billing will renew monthly and end around {recurringEndDateLabel}.
                        </p>
                      </div>
                      <select
                        id="recurringDurationMonths"
                        value={recurringDurationMonths}
                        onChange={(event) => setRecurringDurationMonths(Number(event.target.value))}
                        className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-bold text-blue-900 outline-none transition focus:border-blue-500"
                      >
                        {recurringDurationOptions.map((months) => (
                          <option key={months} value={months}>
                            {months} month{months === 1 ? "" : "s"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-4 text-xs font-semibold leading-5 text-amber-700">
                      Recurring monthly billing charges the first month now, then continues monthly until the selected duration ends. Card-based recurring renewals are handled by your chosen provider.
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 p-8 bg-white rounded-[2rem] border-2 border-blue-100 animate-in slide-in-from-top-4 duration-500">
                  <p className="text-sm font-black text-blue-900 uppercase tracking-widest">Selected plan</p>
                  <p className="mt-4 text-2xl font-black text-blue-900">
                    ₦{firstMonthAmount.toLocaleString()} due today
                  </p>
                  <p className="mt-3 text-sm leading-6 text-blue-700/80">
                    {billingType === "one_time"
                      ? `This covers the first month for ${storageSelectionCount} unit${storageSelectionCount === 1 ? "" : "s"} totaling ${formatSquareFeet(totalSquareFootage)} at ₦${totalMonthlyRate.toLocaleString()} per month.`
                      : `This charges the first month now and schedules up to ${recurringDurationMonths} month${recurringDurationMonths === 1 ? "" : "s"} of recurring billing worth ₦${recurringScheduleValue.toLocaleString()} in total if all renewals complete.`}
                  </p>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32 bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-900/10 border border-gray-50 text-center">
                <p className="text-sm font-black text-blue-900/40 uppercase tracking-[0.2em] mb-4">Amount Due Today</p>
                <div className="text-5xl font-black text-blue-900 mb-2 truncate">
                  ₦{finalAmount.toLocaleString()}
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-10">Nigerian Naira (NGN)</p>

                <div className="mb-6 rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 text-left">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">Checkout summary</p>
                  <h2 className="mt-3 text-xl font-black text-blue-900">
                    {storageSelectionCount} unit{storageSelectionCount === 1 ? "" : "s"} selected
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {checkoutEntries.length} cart line{checkoutEntries.length === 1 ? "" : "s"} across {checkoutLocations} location{checkoutLocations === 1 ? "" : "s"}.
                  </p>
                </div>

                <div className="mb-10 rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 text-left">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">Payment service</p>
                  <h2 className="mt-3 text-xl font-black text-blue-900">
                    Choose your payment provider at checkout
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    When you continue, we&apos;ll create your booking{storageSelectionCount === 1 ? "" : "s"} first, then redirect you to Paystack or Flutterwave.
                  </p>
                  {selectedProvider ? (
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                      Last selected: {selectedProvider}
                    </p>
                  ) : null}
                  {billingType === "recurring" ? (
                    <p className="mt-4 text-xs font-semibold leading-5 text-blue-700">
                      Recurring billing charges the first month now, then renews automatically until the selected duration ends.
                    </p>
                  ) : null}
                </div>

                {addOnItems.length > 0 && isCartCheckout ? (
                  <p className="text-amber-700 text-xs font-bold mb-6 bg-amber-50 py-3 px-4 rounded-xl">
                    Remove add-ons from your cart before paying online. Only storage units are supported in checkout right now.
                  </p>
                ) : null}
                {visibleError ? (
                  <p className="text-red-500 text-xs font-bold mb-6 bg-red-50 py-3 px-4 rounded-xl">{visibleError}</p>
                ) : null}

                <button
                  onClick={handleBeginCheckout}
                  disabled={submitting || Boolean(blockingError)}
                  className="w-full bg-[#1642F0] text-white py-6 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "CONTINUE TO CHECKOUT"}
                </button>

              </div>
            </div>
          </div>
        )}
      </main>

      {isProviderModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl shadow-blue-900/20">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">Select payment service</p>
                <h2 className="mt-3 text-3xl font-black text-blue-900">Choose how you want to pay</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                  We&apos;ll create your booking{storageSelectionCount === 1 ? "" : "s"} with the selected plan first, then redirect you to your chosen payment provider.
                </p>
                {billingType === "recurring" ? (
                  <p className="mt-2 max-w-xl text-xs leading-5 text-blue-700">
                    Recurring monthly billing charges the first month now, then renews monthly for up to {recurringDurationMonths} month{recurringDurationMonths === 1 ? "" : "s"} in total.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsProviderModalOpen(false)}
                className="rounded-full border border-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {paymentProviders.map((provider) => {
                const isActive = selectedProvider === provider.value;

                return (
                  <button
                    key={provider.value}
                    type="button"
                    onClick={() => setSelectedProvider(provider.value)}
                    className={`rounded-[2rem] border-2 p-6 text-left transition-all ${isActive
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-black text-blue-900">{provider.label}</p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">{provider.description}</p>
                      </div>
                      <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${isActive ? "border-blue-600" : "border-gray-200"}`}>
                        {isActive ? <div className="h-3 w-3 rounded-full bg-blue-600" /> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsProviderModalOpen(false)}
                className="rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedProvider || submitting}
                onClick={() => {
                  if (!selectedProvider) {
                    return;
                  }
                  setIsProviderModalOpen(false);
                  void handleCheckout(selectedProvider);
                }}
                className="rounded-full bg-[#1642F0] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Starting payment..." : "Continue with selected provider"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
