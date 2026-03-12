import axios from 'axios';

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_PLAN_PREFIX = 'Spacedey Monthly NGN';

interface InitializePaymentOptions {
    paymentPlanId?: number | string;
    paymentOptions?: string;
    meta?: Record<string, unknown>;
}

interface FlutterwavePaymentPlanResponse {
    id: number | string;
    name?: string;
    amount?: number | string;
    interval?: string;
    duration?: number | string;
    status?: string;
}

export const flutterwave = {
    isConfigured() {
        return Boolean(FLUTTERWAVE_SECRET_KEY);
    },

    async initializePayment(
        email: string,
        amount: number,
        txRef: string,
        redirectUrl: string,
        options: InitializePaymentOptions = {}
    ) {
        try {
            const response = await axios.post(
                'https://api.flutterwave.com/v3/payments',
                {
                    tx_ref: txRef,
                    amount,
                    currency: 'NGN',
                    redirect_url: redirectUrl,
                    payment_options: options.paymentOptions,
                    payment_plan: options.paymentPlanId,
                    customer: {
                        email,
                    },
                    meta: options.meta,
                    customizations: {
                        title: 'Spacedey Storage Booking',
                        description: 'Payment for storage unit reservation',
                        logo: 'https://spacedey.com/logo.png',
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to initialize Flutterwave payment';

            console.error('Flutterwave initialize error:', message);
            throw new Error(message);
        }
    },

    async ensureMonthlyPlan(amount: number, durationMonths: number) {
        const expectedName = `${FLUTTERWAVE_PLAN_PREFIX} ${amount.toFixed(2)} x ${durationMonths}`;

        try {
            const listResponse = await axios.get(
                'https://api.flutterwave.com/v3/payment-plans',
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                    },
                }
            );

            const existingPlan = Array.isArray(listResponse.data?.data)
                ? listResponse.data.data.find((plan: FlutterwavePaymentPlanResponse) => (
                    Number(plan.amount) === amount &&
                    plan.interval === 'monthly' &&
                    Number(plan.duration) === durationMonths &&
                    (plan.status === 'active' || typeof plan.status === 'undefined') &&
                    typeof plan.id !== 'undefined' &&
                    typeof plan.name === 'string' &&
                    plan.name.startsWith(FLUTTERWAVE_PLAN_PREFIX)
                ))
                : null;

            if (existingPlan) {
                return {
                    paymentPlanId: existingPlan.id,
                    paymentPlanName: existingPlan.name ?? expectedName,
                };
            }

            const createResponse = await axios.post(
                'https://api.flutterwave.com/v3/payment-plans',
                {
                    name: expectedName,
                    amount,
                    currency: 'NGN',
                    interval: 'monthly',
                    duration: durationMonths,
                },
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return {
                paymentPlanId: createResponse.data.data.id as number | string,
                paymentPlanName: (createResponse.data.data.name as string | undefined) ?? expectedName,
            };
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to create or fetch Flutterwave payment plan';

            console.error('Flutterwave payment plan error:', message);
            throw new Error(message);
        }
    },

    async verifyPayment(transactionId: string) {
        try {
            const response = await axios.get(
                `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to verify Flutterwave payment';

            console.error('Flutterwave verify error:', message);
            throw new Error(message);
        }
    },
};
