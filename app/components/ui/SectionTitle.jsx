import React from "react";

function SectionTitle({ children, as = "h2", className = "" }) {
  const Tag = as;
  return (
    <Tag className={`font-extrabold tracking-tight text-neutral-900 mb-6 text-3xl sm:text-4xl lg:text-5xl ${className}`}>
      {children}
    </Tag>
  );
}

export default SectionTitle;



