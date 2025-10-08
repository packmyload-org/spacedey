import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return <div className={`bg-white border border-neutral-200 rounded-xl shadow-subtle ${className}`}>{children}</div>;
}


