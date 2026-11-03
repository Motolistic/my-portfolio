import React from "react";

// The signature element: a circular wax-stamp badge used for every
// asset & activity row, standing in for the coin-logo / avatar
// pattern of typical trading apps.
export default function Stamp({ letter, tone = "forest" }) {
  const bg = tone === "forest" ? "bg-forestTint" : "bg-goldTint";
  const fg = tone === "forest" ? "text-forestDeep" : "text-gold";
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 w-10 h-10 border border-line font-display font-semibold text-base ${bg} ${fg}`}
    >
      {letter}
    </div>
  );
}
