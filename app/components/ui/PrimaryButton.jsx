// import React from "react";

// const base =
//   "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base";

// const variants = {
//   primary:
//     "bg-brand text-white hover:bg-brand-dark focus:ring-brand ring-offset-white px-5 py-3",
//   secondary:
//     "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900 ring-offset-white px-5 py-3",
//   outline:
//     "border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-300 ring-offset-white px-5 py-3",
//   link: "text-brand hover:text-brand-dark px-0 py-0",
// };

// function PrimaryButton({ children, variant = "primary", className = "", ...props }) {
//   const variantClasses = variants[variant] || variants.primary;
//   return (
//     <button className={`${base} ${variantClasses} ${className}`} {...props}>
//       {children}
//     </button>
//   );
// }

// export default PrimaryButton;


import React from "react";

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-dark focus:ring-brand ring-offset-white px-5 py-3",
  secondary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900 ring-offset-white px-5 py-3",
  outline:
    "border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-300 ring-offset-white px-5 py-3",
  link: "text-brand hover:text-brand-dark px-0 py-0",
  custom: "", // Empty variant for full custom styling
};

function PrimaryButton({ children, variant = "primary", className = "", ...props }) {
  const variantClasses = variant === "custom" ? "" : (variants[variant] || variants.primary);
  return (
    <button className={`${base} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default PrimaryButton;

