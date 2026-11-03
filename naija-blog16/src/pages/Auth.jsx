import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme";
import { supabase } from "../lib/supabaseClient";

function Field(props) {
  return (
    <input {...props}
      className="f-body w-full px-3.5 py-3 rounded-lg outline-none"
      style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} />
  );
}

function ErrorBanner({ children }) {
  if (!children) return null;
  return (
    <p className="f-mono text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: `${C.accent}14`, color: C.accent, border: `1px solid ${C.accent}55` }}>
      {children}
    </p>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button {...props}
      className="f-mono w-full text-xs uppercase tracking-widest py-3.5 rounded-lg mt-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
      style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
      {children}
    </button>
  );
}

function safeMessage(error) {
  const msg = error?.message;
  if (!msg || typeof msg !== "string" || msg.trim() === "{}" || msg.trim() === "") {
    return "Something went wrong. Please try again in a moment.";
  }
  return msg;
}

export default function Auth({ setUser }) {
  // Steps: login, signup, checkEmail (post-signup, link sent),
  // forgot (request reset link)
  const [mode, setMode] = useState("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function afterAuthSuccess(userId) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
    setUser({ role: profile?.role || "reader" });
    navigate(profile?.role === "reader" ? "/" : "/dashboard");
  }

  async function handleLogin() {
    setError("");
    if (!email || !password) {
      setError("Enter an email and password.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(safeMessage(error));
      return;
    }
    await afterAuthSuccess(data.user.id);
  }

  async function handleSignup() {
    setError("");
    if (!email || !password) {
      setError("Enter an email and password.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: fullName || email.split("@")[0] } },
    });
    setLoading(false);
    if (error) {
      setError(safeMessage(error));
      return;
    }
    if (data.session) {
      // Email confirmation is off — signed in immediately.
      await afterAuthSuccess(data.user.id);
    } else {
      // A confirmation link was emailed — tell them to go click it.
      setMode("checkEmail");
    }
  }

  async function handleRequestReset() {
    setError("");
    if (!email) {
      setError("Enter your email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(safeMessage(error));
      return;
    }
    setMode("checkEmailReset");
  }

  function switchMode(m) {
    setMode(m);
    setError("");
  }

  // --- Post-signup: told to check email for a confirmation link ---
  if (mode === "checkEmail") {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="f-display text-4xl mb-2" style={{ color: C.ink, fontWeight: 900 }}>Check your email</h1>
        <p className="f-body mb-6" style={{ color: C.inkSoft }}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and sign in.
        </p>
        <button onClick={() => switchMode("login")} className="f-ui text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity" style={{ color: C.ink }}>
          Back to sign in
        </button>
      </div>
    );
  }

  // --- Post-reset-request: told to check email for a reset link ---
  if (mode === "checkEmailReset") {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="f-display text-4xl mb-2" style={{ color: C.ink, fontWeight: 900 }}>Check your email</h1>
        <p className="f-body mb-6" style={{ color: C.inkSoft }}>
          We sent a password reset link to <strong>{email}</strong>. Click it to choose a new password.
        </p>
        <button onClick={() => switchMode("login")} className="f-ui text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity" style={{ color: C.ink }}>
          Back to sign in
        </button>
      </div>
    );
  }

  // --- Request password reset link ---
  if (mode === "forgot") {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="f-display text-4xl mb-2" style={{ color: C.ink, fontWeight: 900 }}>Reset your password</h1>
        <p className="f-body mb-6" style={{ color: C.inkSoft }}>Enter your email and we'll send you a link to reset your password.</p>
        <ErrorBanner>{error}</ErrorBanner>
        <div className="space-y-3">
          <Field value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
          <PrimaryButton onClick={handleRequestReset} disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </PrimaryButton>
        </div>
        <button onClick={() => switchMode("login")} className="f-ui text-sm font-semibold mt-6 opacity-90 hover:opacity-100 transition-opacity" style={{ color: C.ink }}>
          Back to sign in
        </button>
      </div>
    );
  }

  // --- Login / signup ---
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="flex mb-8 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
        {["login", "signup"].map((m) => (
          <button key={m} onClick={() => switchMode(m)} className="flex-1 f-mono text-xs uppercase tracking-widest py-2.5"
            style={{ background: mode === m ? C.accent : "transparent", color: mode === m ? "#FFFFFF" : C.ink, fontWeight: mode === m ? 700 : 500 }}>
            {m === "login" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <h1 className="f-display text-4xl mb-2" style={{ color: C.ink, fontWeight: 900 }}>
        {mode === "login" ? "Welcome back" : "Join Naija"}
      </h1>
      <p className="f-body mb-6" style={{ color: C.inkSoft }}>
        {mode === "login" ? "Enter your details to continue reading and commenting." : "Create an account to comment, react, and follow writers."}
      </p>

      <ErrorBanner>{error}</ErrorBanner>

      <div className="space-y-3">
        {mode === "signup" && (
          <Field value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
        )}
        <Field value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <Field value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />

        {mode === "login" && (
          <button onClick={() => switchMode("forgot")} className="f-ui text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity" style={{ color: C.ink }}>
            Forgot password?
          </button>
        )}

        <PrimaryButton onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </PrimaryButton>
      </div>
    </div>
  );
}
