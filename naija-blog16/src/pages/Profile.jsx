import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { C } from "../theme";
import { supabase } from "../lib/supabaseClient";

export default function Profile({ setUser }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      setEmail(userData.user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, bio, role, created_at")
        .eq("id", userData.user.id)
        .single();

      if (cancelled) return;
      if (!error && data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");

        const { count } = await supabase
          .from("followers")
          .select("id", { count: "exact", head: true })
          .eq("author_id", data.id);
        if (!cancelled) setFollowerCount(count || 0);
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError("");
    setSaved(false);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser({ role: "guest" });
    navigate("/");
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
        <p className="f-mono text-sm" style={{ color: C.inkSoft }}>Loading profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
        <p className="f-body" style={{ color: C.ink }}>Sign in to view your profile.</p>
      </div>
    );
  }

  const joined = profile.created_at ? new Date(profile.created_at).getFullYear() : null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center f-display text-2xl shrink-0" style={{ background: C.ink, color: "#FFFFFF", fontWeight: 700 }}>
          {(displayName || email)[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="f-display text-4xl" style={{ color: C.ink, fontWeight: 900 }}>{displayName || "Your profile"}</h1>
          <p className="f-mono text-xs mt-1" style={{ color: C.inkSoft }}>
            {profile.role} · {followerCount} {followerCount === 1 ? "follower" : "followers"} · {email}{joined ? ` · joined ${joined}` : ""}
          </p>
        </div>
      </div>

      {error && (
        <p className="f-mono text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: `${C.accent}14`, color: C.accent, border: `1px solid ${C.accent}55` }}>
          {error}
        </p>
      )}
      {saved && (
        <p className="f-mono text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: "#1F6F5014", color: "#1F6F50", border: "1px solid #1F6F5055" }}>
          Saved.
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.inkSoft }}>Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="f-body w-full mt-1.5 px-3.5 py-3 rounded-lg outline-none"
            style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} />
        </div>
        <div>
          <label className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.inkSoft }}>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="A short bio readers will see on your author page"
            className="f-body w-full mt-1.5 px-3.5 py-3 rounded-lg outline-none"
            style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="f-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="mt-14 pt-8" style={{ borderTop: `1px solid ${C.line}` }}>
        <button onClick={handleSignOut}
          className="f-ui text-sm font-semibold flex items-center gap-2 px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          style={{ border: `1px solid ${C.line}`, color: C.ink }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );
}
