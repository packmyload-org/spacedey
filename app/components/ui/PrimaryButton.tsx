"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "link" | "custom";

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base";

const variantToClasses: Record<Exclude<ButtonVariant, "custom">, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark focus:ring-brand ring-offset-white px-5 py-3",
  secondary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900 ring-offset-white px-5 py-3",
  outline:
    "border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-300 ring-offset-white px-5 py-3",
  link: "text-brand hover:text-brand-dark px-0 py-0",
};

export default function PrimaryButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: PrimaryButtonProps) {
  const variantClasses =
    variant === "custom" ? "" : variantToClasses[variant] ?? variantToClasses.primary;

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}


