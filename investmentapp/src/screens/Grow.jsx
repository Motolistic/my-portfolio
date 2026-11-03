import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getProducts, subscribeToProduct } from "../api.js";

export default function Grow() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  if (!products) {
    return <div className="font-body text-sm text-inkSoft">Loading baskets…</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="font-display text-2xl text-ink">Grow your money</div>
        <div className="font-body text-sm text-inkSoft mt-1">
          Pick a basket that matches how long you can leave it
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => {
          const tagBg = p.tone === "forest" ? "bg-forestTint" : "bg-goldTint";
          const tagFg = p.tone === "forest" ? "text-forestDeep" : "text-gold";
          return (
            <div key={p.id} className="rounded-3xl p-5 bg-card border border-line flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display text-lg text-ink">{p.name}</div>
                  <span className={`rounded-full px-3 py-1 font-mono text-xs whitespace-nowrap ${tagBg} ${tagFg}`}>
                    {p.rate}
                  </span>
                </div>
                <div className="font-body text-sm text-inkSoft mt-2">{p.blurb}</div>
              </div>
              <div className="flex items-center justify-between mt-5">
                <span className="font-body text-xs text-inkSoft">{p.term}</span>
                <button
                  onClick={() => subscribeToProduct(p.id)}
                  className="flex items-center gap-1 rounded-full px-4 py-2 bg-forest text-paper font-body text-sm font-semibold"
                >
                  Start <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
