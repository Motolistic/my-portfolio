import React, { useEffect, useState } from "react";
import { FileText, Users, ShieldCheck, Trash2 } from "lucide-react";
import { C, CATS } from "../theme";
import { supabase } from "../lib/supabaseClient";

const ROLES = ["reader", "author", "admin"];

function AuthorsTab() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, role")
      .order("display_name");
    if (error) setError(error.message);
    else setProfiles(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function changeRole(id, role) {
    setSavingId(id);
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    setSavingId(null);
    if (error) {
      setError(error.message);
      return;
    }
    setProfiles((ps) => ps.map((p) => (p.id === id ? { ...p, role } : p)));
  }

  if (loading) return <p className="f-mono text-sm mt-6" style={{ color: C.inkSoft }}>Loading users…</p>;

  return (
    <div className="mt-6">
      {error && (
        <p className="f-mono text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: `${C.accent}14`, color: C.accent, border: `1px solid ${C.accent}55` }}>
          {error}
        </p>
      )}
      <div className="divide-y" style={{ borderColor: C.line }}>
        {profiles.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-3 gap-4">
            <p className="f-body" style={{ color: C.ink }}>{p.display_name || "(no name)"}</p>
            <select
              value={p.role}
              disabled={savingId === p.id}
              onChange={(e) => changeRole(p.id, e.target.value)}
              className="f-mono text-[11px] uppercase px-2 py-1 rounded outline-none"
              style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModerationTab() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("id, body, created_at, profiles(display_name), posts(title)")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) setError(error.message);
    else setComments(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setComments((cs) => cs.filter((c) => c.id !== id));
  }

  if (loading) return <p className="f-mono text-sm mt-6" style={{ color: C.inkSoft }}>Loading comments…</p>;

  return (
    <div className="mt-6 space-y-4">
      {error && (
        <p className="f-mono text-xs px-3 py-2 rounded-lg" style={{ background: `${C.accent}14`, color: C.accent, border: `1px solid ${C.accent}55` }}>
          {error}
        </p>
      )}
      {comments.length === 0 && <p className="f-body" style={{ color: C.inkSoft }}>No comments yet.</p>}
      {comments.map((c) => (
        <div key={c.id} className="p-4 rounded-lg" style={{ background: C.surfaceAlt, border: `1px solid ${C.line}` }}>
          <p className="f-mono text-[11px]" style={{ color: C.inkSoft }}>
            {c.profiles?.display_name || "Reader"} on "{c.posts?.title || "a post"}"
          </p>
          <p className="f-body mt-1" style={{ color: C.ink }}>{c.body}</p>
          <button onClick={() => remove(c.id)} className="f-mono text-[11px] uppercase flex items-center gap-1 mt-3" style={{ color: C.accent }}>
            <Trash2 size={13} /> Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState("authors");

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-14">
      <h1 className="f-display text-4xl md:text-5xl" style={{ color: C.ink, fontWeight: 900 }}>Admin</h1>
      <div className="flex gap-7 mt-10" style={{ borderBottom: `1px solid ${C.line}` }}>
        {[["authors", "Users & roles", Users], ["moderation", "Moderation", ShieldCheck], ["categories", "Categories", FileText]].map(([t, label, Icon]) => (
          <button key={t} onClick={() => setTab(t)} className="f-mono text-xs uppercase tracking-widest pb-3.5 flex items-center gap-1.5"
            style={{ color: C.ink, opacity: tab === t ? 1 : 0.4, borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent" }}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === "authors" && <AuthorsTab />}
      {tab === "moderation" && <ModerationTab />}

      {tab === "categories" && (
        <div className="mt-6 max-w-md">
          <p className="f-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: C.inkSoft }}>
            Fixed categories — not yet backed by a database table, so these can't be added/removed here.
          </p>
          <div className="space-y-2">
            {Object.keys(CATS).map((c) => (
              <div key={c} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.line}` }}>
                <span className="f-body" style={{ color: C.ink }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
