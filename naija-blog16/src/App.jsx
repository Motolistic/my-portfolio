import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { C } from "./theme";
import { supabase } from "./lib/supabaseClient";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Post from "./pages/Post";
import Category from "./pages/Category";
import Author from "./pages/Author";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

// Looks up a signed-in auth user's role from the profiles table.
// Falls back to "reader" if no profile row is found for some reason.
async function fetchRole(userId) {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return data?.role || "reader";
}

export default function App() {
  const [user, setUser] = useState({ role: "guest" });
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // On first load, check whether a Supabase session already exists
    // (e.g. the user refreshed the page while logged in).
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await fetchRole(session.user.id);
        setUser({ role });
      }
      setCheckingSession(false);
    });

    // Keep `user` in sync with login/logout events that happen anywhere
    // in the app (including other tabs), not just right after this load.
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const role = await fetchRole(session.user.id);
        setUser({ role });
      } else {
        setUser({ role: "guest" });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Avoid flashing the "guest" nav (Sign in button, etc.) for a moment
  // before we've had a chance to check for an existing session.
  if (checkingSession) {
    return <div className="min-h-screen" style={{ background: C.bg }} />;
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<Post />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/author/:name" element={<Author />} />
        <Route path="/search" element={<Search />} />
        <Route path="/auth" element={<Auth setUser={setUser} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile setUser={setUser} />} />
      </Routes>
      <Footer />
    </div>
  );
}
