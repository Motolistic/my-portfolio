import React from "react";

export default function PrimaryButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 font-body font-medium text-[15px] w-full bg-forest text-paper ${className}`}
    >
      {children}
    </button>
  );
}
