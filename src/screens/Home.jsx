import React, { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { ArrowUpRight } from "lucide-react";
import Stamp from "../components/Stamp.jsx";
import Sparkline from "../components/Sparkline.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { getPortfolio, getHoldings, fmt } from "../api.js";

export default function Home({ onSelectAsset }) {
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState(null);

  useEffect(() => {
    getPortfolio().then(setPortfolio);
    getHoldings().then(setHoldings);
  }, []);

  if (!portfolio || !holdings) {
    return <div className="font-body text-sm text-inkSoft">Loading your portfolio…</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl p-6 bg-card border border-line">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="font-body text-[13px] text-inkSoft">Good evening, Peter</div>
              <div className="font-display text-[40px] font-semibold text-ink leading-none mt-1">
                ₦{fmt(portfolio.total)}
              </div>
              <div className="flex items-center gap-1 mt-2 text-forest font-mono text-[13px]">
                <ArrowUpRight size={14} />
                +4.9% this month
              </div>
            </div>
            <div className="flex gap-3">
              <PrimaryButton className="w-auto px-5">Add money</PrimaryButton>
              <button className="rounded-2xl px-5 py-3 font-body font-medium text-[15px] bg-transparent text-forestDeep border-[1.5px] border-forest">
                Withdraw
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200} className="mt-4">
            <AreaChart data={portfolio.growthSeries} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2B5D4C" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2B5D4C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin - 40", "dataMax + 40"]} />
              <Tooltip
                contentStyle={{ background: "#2B2620", border: "none", borderRadius: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}
                labelStyle={{ display: "none" }}
                formatter={(v) => [`₦${fmt(v)}`, ""]}
              />
              <Area type="monotone" dataKey="v" stroke="#2B5D4C" strokeWidth={2.5} fill="url(#growthFill)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-1 font-body text-xs text-inkSoft">
            <span>3 months ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-forestTint border border-line flex flex-col justify-between">
          <div>
            <div className="font-display text-lg text-forestDeep">This month</div>
            <div className="font-body text-sm text-forestDeep/70 mt-1">
              Deposits, growth and what's left to reach your goal.
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6 font-mono text-sm text-forestDeep">
            <div className="flex justify-between"><span>Deposited</span><span>₦200.00</span></div>
            <div className="flex justify-between"><span>Growth credited</span><span>+₦6.40</span></div>
            <div className="flex justify-between"><span>Withdrawn</span><span>-₦80.00</span></div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-xl text-ink">Your baskets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {holdings.map((h) => (
            <button
              key={h.id}
              onClick={() => onSelectAsset(h)}
              className="flex items-center gap-3 rounded-2xl p-4 text-left bg-card border border-line hover:border-forest transition-colors"
            >
              <Stamp letter={h.name[0]} tone={h.up ? "forest" : "gold"} />
              <div className="flex-1 min-w-0">
                <div className="font-body font-semibold text-sm text-ink">{h.name}</div>
                <div className="font-body text-xs text-inkSoft">{h.tag}</div>
              </div>
              <Sparkline data={h.spark} up={h.up} />
              <div className="text-right min-w-[74px]">
                <div className="font-mono text-sm text-ink">₦{fmt(h.value)}</div>
                <div className={`font-mono text-xs ${h.up ? "text-forest" : "text-rust"}`}>
                  {h.up ? "+" : ""}{h.change}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
