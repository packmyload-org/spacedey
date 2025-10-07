import React from "react";

function InputSearch({ value, onChange, placeholder = "Search locations...", className = "", inputClassName = "", ...props }) {
  return (
    <div className={`relative flex items-center ${className}`} {...props}>
      <span className="pointer-events-none absolute left-3 text-neutral-400">
        {/* Simple magnifier placeholder */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <input
        value={value}
        onChange={onChange}
        type="text"
        className={`w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${inputClassName}`}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputSearch;



