import React from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import Stamp from "../components/Stamp.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { fmt } from "../api.js";

export default function AssetDetail({ asset, onClose }) {
  if (!asset) return null;
  const big = asset.spark.map((v, i) => ({ t: i, v }));
  const color = asset.up ? "#2B5D4C" : "#B5583A";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl p-6 flex flex-col gap-4 bg-paper shadow-[0_30px_60px_rgba(43,38,32,0.25)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stamp letter={asset.name[0]} tone={asset.up ? "forest" : "gold"} />
            <div>
              <div className="font-display text-lg text-ink">{asset.name}</div>
              <div className="font-body text-xs text-inkSoft">{asset.tag}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-inkSoft">
            <X size={20} />
          </button>
        </div>

        <div>
          <div className="font-display text-[28px] text-ink">₦{fmt(asset.value)}</div>
          <div className={`flex items-center gap-1 font-mono text-[13px] ${asset.up ? "text-forest" : "text-rust"}`}>
            {asset.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {asset.up ? "+" : ""}{asset.change}% overall
          </div>
        </div>

        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={big}>
            <defs>
              <linearGradient id="detailFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} fill="url(#detailFill)" />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex gap-3">
          <PrimaryButton>Add to this basket</PrimaryButton>
          <button className="rounded-2xl px-4 py-3 font-body font-medium text-[15px] w-full bg-transparent text-rust border-[1.5px] border-rust">
            Sell some
          </button>
        </div>
      </div>
    </div>
  );
}
