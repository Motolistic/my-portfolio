import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getActivity, fmt } from "../api.js";

export default function Activity() {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getActivity().then(setActivity);
  }, []);

  const iconFor = (kind) =>
    kind === "in" || kind === "gain" ? (
      <ArrowUpRight size={16} color="#2B5D4C" />
    ) : (
      <ArrowDownRight size={16} color="#B5583A" />
    );

  if (!activity) {
    return <div className="font-body text-sm text-inkSoft">Loading your ledger…</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="font-display text-2xl text-ink">Your ledger</div>
        <div className="font-body text-sm text-inkSoft mt-1">Every deposit, sale and gain, in order</div>
      </div>
      <div className="max-w-2xl flex flex-col gap-2">
        {activity.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-2xl p-4 bg-card border border-line">
            <div className="flex items-center justify-center rounded-full shrink-0 w-9 h-9 bg-paperDeep border border-line">
              {iconFor(a.kind)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body font-semibold text-sm text-ink">{a.label}</div>
              <div className="font-body text-xs text-inkSoft">{a.note} · {a.date}</div>
            </div>
            <div className={`font-mono text-sm ${a.amount < 0 ? "text-ink" : "text-forest"}`}>
              {a.amount < 0 ? "-" : "+"}₦{fmt(Math.abs(a.amount))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
