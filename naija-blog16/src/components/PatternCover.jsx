import React from "react";
import { CATS } from "../theme";

// Shows the real uploaded cover image when `src` is provided; falls
// back to a bold solid category-color block with a subtle diagonal
// accent otherwise (replaces the old adire-pattern art now that the
// theme has moved to a bolder, more minimal look).
export default function PatternCover({ cat, className = "", src }) {
  const color = (CATS[cat] || CATS.Culture).c;

  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: color }}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.16) 55%, transparent 70%)`,
        }}
      />
    </div>
  );
}
