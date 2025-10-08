import React from "react";
import type { JSX } from "react";

export interface SectionTitleProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function SectionTitle({ children, as = "h2", className = "" }: SectionTitleProps) {
  const Tag = as as keyof JSX.IntrinsicElements;
  return (
    <Tag className={`font-extrabold tracking-tight text-neutral-900 mb-6 text-3xl sm:text-4xl lg:text-5xl ${className}`}>
      {children}
    </Tag>
  );
}


