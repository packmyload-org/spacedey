import React from "react";
import Card from "@/app/components/ui/Card";
import PrimaryButton from "@/app/components/ui/PrimaryButton";

export interface LocationCardProps {
  name?: string;
  address?: string;
  hours?: string;
  onBook?: () => void;
  variant?: "primary" | "secondary" | "outline" | "link" | "custom";
}

export default function LocationCard({
  name = "Stuf Storage - Placeholder",
  address = "123 Main St, City, ST",
  hours = "6am - 10pm",
  onBook,
  variant = "outline",
}: LocationCardProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <div className="text-sm text-neutral-600">
          <p className="font-medium text-neutral-800">Address</p>
          <p className="mt-0.5">{address}</p>
        </div>
        <div className="text-sm text-neutral-600">
          <p className="font-medium text-neutral-800">Hours</p>
          <p className="mt-0.5">{hours}</p>
        </div>
        <div className="pt-2">
          <PrimaryButton variant={variant} className="text-sm px-4 py-2" onClick={onBook}>
            Book Now
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}


