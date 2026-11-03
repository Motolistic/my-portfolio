import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, ShieldCheck, LogIn } from "lucide-react";
import { C } from "../theme";

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30" style={{ background: C.surface, borderBottom: `1px solid ${C.line}` }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="f-display text-3xl md:text-4xl tracking-tight" style={{ color: C.ink, fontWeight: 900 }}>NAIJA</span>
          <span className="f-mono hidden sm:inline text-[10px] uppercase tracking-widest" style={{ color: C.inkSoft }}>Multi-author dispatch</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link to="/" className="f-ui text-sm font-semibold hover:opacity-60 transition-opacity" style={{ color: C.ink }}>Home</Link>
          <Link to="/search" className="f-ui text-sm font-semibold hover:opacity-60 transition-opacity" style={{ color: C.ink }}>Search</Link>

          {user.role === "guest" ? (
            <Link to="/auth" className="f-ui text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ background: C.accent, color: "#FFFFFF" }}>
              <span className="flex items-center gap-1.5"><LogIn size={15} /> Sign in</span>
            </Link>
          ) : (
            <div className="flex items-center gap-5">
              {(user.role === "author" || user.role === "admin") && (
                <Link to="/dashboard" className="f-ui text-sm font-semibold flex items-center gap-1.5 hover:opacity-60 transition-opacity" style={{ color: C.ink }}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="f-ui text-sm font-semibold flex items-center gap-1.5 hover:opacity-60 transition-opacity" style={{ color: C.ink }}>
                  <ShieldCheck size={15} /> Admin
                </Link>
              )}
              <Link to="/profile" title="Profile" className="w-8 h-8 rounded-full flex items-center justify-center f-ui text-xs font-semibold hover:opacity-80 transition-opacity" style={{ background: C.ink, color: "#FFFFFF" }}>
                {user.role[0].toUpperCase()}
              </Link>
            </div>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen((m) => !m)} style={{ color: C.ink }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-5 flex flex-col gap-4" style={{ borderTop: `1px solid ${C.line}` }}>
          <Link to="/" onClick={() => setMenuOpen(false)} className="f-ui text-sm font-semibold pt-4" style={{ color: C.ink }}>Home</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)} className="f-ui text-sm font-semibold" style={{ color: C.ink }}>Search</Link>
          {user.role === "guest" ? (
            <Link to="/auth" onClick={() => setMenuOpen(false)} className="f-ui text-sm font-semibold" style={{ color: C.ink }}>Sign in</Link>
          ) : (
            <>
              {(user.role === "author" || user.role === "admin") && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="f-ui text-sm font-semibold" style={{ color: C.ink }}>Dashboard</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="f-ui text-sm font-semibold" style={{ color: C.ink }}>Admin</Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="f-ui text-sm font-semibold" style={{ color: C.ink }}>Profile</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
