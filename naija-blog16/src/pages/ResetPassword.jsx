import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clicking the emailed link redirects here with a recovery token in
    // the URL; supabase-js reads it automatically and fires this event
    // once it's set up a temporary session for the password update.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // In case the event already fired before this component mounted.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit() {
    setError("");
    if (!newPassword) {
      setError("Enter a new password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/"), 1500);
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="f-display text-4xl mb-2" style={{ color: C.ink, fontWeight: 900 }}>Password updated</h1>
        <p className="f-body" style={{ color: C.inkSoft }}>Taking you back to the homepage…</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <p className="f-mono text-sm" style={{ color: C.inkSoft }}>
          Verifying your reset link… if this doesn't update in a moment, the link may have expired — request a new one from the sign-in page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="f-display text-4xl mb-2" style={{ color: C.ink, fontWeight: 900 }}>Choose a new password</h1>
      {error && (
        <p className="f-mono text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: `${C.accent}14`, color: C.accent, border: `1px solid ${C.accent}55` }}>
          {error}
        </p>
      )}
      <div className="space-y-3">
        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" type="password"
          className="f-body w-full px-3.5 py-3 rounded-lg outline-none"
          style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} />
        <button onClick={handleSubmit} disabled={loading}
          className="f-mono w-full text-xs uppercase tracking-widest py-3.5 rounded-lg mt-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
          {loading ? "Updating…" : "Update password"}
        </button>
      </div>
    </div>
  );
}
