import React from "react";
import { C } from "../theme";

export default function Footer() {
  return (
    <footer className="mt-24 py-10" style={{ borderTop: `1px solid ${C.line}` }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between gap-4">
        <span className="f-display text-xl" style={{ color: C.ink, fontWeight: 900 }}>NAIJA</span>
        <p className="f-mono text-[11px]" style={{ color: C.inkSoft }}>Published by writers across Lagos, Abuja & Abeokuta.</p>
      </div>
    </footer>
  );
}
