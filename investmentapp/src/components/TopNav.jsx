import React from "react";
import { NavLink } from "react-router-dom";
import { Sprout } from "lucide-react";
import PrimaryButton from "./PrimaryButton.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/grow", label: "Grow" },
  { to: "/activity", label: "Ledger" },
  { to: "/you", label: "You" },
];

function linkClass({ isActive }) {
  return `font-body text-sm px-3 py-2 rounded-full ${
    isActive ? "text-forestDeep font-semibold bg-forestTint" : "text-inkSoft"
  }`;
}

export default function TopNav() {
  return (
    <header className="sticky top-0 z-20 bg-card border-b border-line">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-forestTint text-forestDeep">
            <Sprout size={17} />
          </div>
          <span className="font-display text-lg text-ink">Grain</span>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <PrimaryButton className="w-auto px-5 py-2 text-sm">Add money</PrimaryButton>
      </div>

      <nav className="flex sm:hidden items-center gap-1 px-4 pb-3 overflow-x-auto">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
