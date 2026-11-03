import React from "react";
import { ChevronRight } from "lucide-react";
import Stamp from "../components/Stamp.jsx";

const rows = ["Bank accounts", "Statements", "Goals", "Referral rewards", "Help & support"];

export default function You() {
  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div className="flex items-center gap-3">
        <Stamp letter="P" tone="gold" />
        <div>
          <div className="font-display text-xl text-ink">Peter</div>
          <div className="font-body text-xs text-inkSoft">Member since 2026</div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-line">
        {rows.map((r, i) => (
          <div
            key={r}
            className={`flex items-center justify-between px-4 py-3 bg-card font-body text-sm text-ink ${i === 0 ? "" : "border-t border-line"}`}
          >
            {r} <ChevronRight size={16} className="text-inkSoft" />
          </div>
        ))}
      </div>
    </div>
  );
}
