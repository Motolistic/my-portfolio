import React from "react";
import { C, CATS } from "../theme";

export function Kicker({ cat }) {
  const color = (CATS[cat] || CATS.Culture).c;
  return (
    <span
      className="f-display inline-block text-xs tracking-widest uppercase px-2.5 py-1"
      style={{ background: color, color: "#FFFFFF", fontWeight: 700 }}
    >
      {cat}
    </span>
  );
}

export function StatusPill({ status }) {
  const map = {
    published: { bg: "#1F6F50", label: "Published" },
    draft: { bg: C.accent, label: "Draft" },
    archived: { bg: C.inkSoft, label: "Archived" },
  };
  const s = map[status] || map.draft;
  return (
    <span
      className="f-mono text-[11px] uppercase tracking-wide px-2 py-0.5 rounded"
      style={{ background: `${s.bg}1A`, color: s.bg, border: `1px solid ${s.bg}55` }}
    >
      {s.label}
    </span>
  );
}
