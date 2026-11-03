import React, { useEffect, useState } from "react";
import { PenSquare, Trash2, Upload } from "lucide-react";
import { C, CATS } from "../theme";
import { supabase } from "../lib/supabaseClient";
import { StatusPill } from "../components/Badges";
import PatternCover from "../components/PatternCover";

// Turns a title into a URL-safe slug, e.g. "My Post!" -> "my-post".
// Appends a short random suffix so two posts with the same title
// don't collide on the table's unique slug constraint.
function slugify(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

function PostEditor({ initial, onSave, onCancel, saving, userId }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [cat, setCat] = useState(initial?.category || "Culture");
  const [body, setBody] = useState(initial?.body || "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setUploadError("");
    const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    setUploading(false);

    if (error) {
      setUploadError(error.message);
      return;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    setCoverUrl(data.publicUrl);
  }

  function buildPayload(status) {
    return {
      title,
      category: cat,
      body,
      excerpt: body.slice(0, 160),
      status,
      cover_image_url: coverUrl || null,
      // Only new posts need a fresh slug — editing keeps the existing one.
      ...(initial ? {} : { slug: slugify(title) }),
      ...(status === "published" && !initial?.published_at ? { published_at: new Date().toISOString() } : {}),
    };
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="md:col-span-2 space-y-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title"
          className="f-display w-full text-2xl px-3.5 py-3 rounded-lg outline-none" style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}`, fontWeight: 700 }} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write in Markdown…" rows={12}
          className="f-body w-full px-3.5 py-3 rounded-lg outline-none text-sm leading-relaxed" style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} />
        <p className="f-mono text-[11px]" style={{ color: C.inkSoft }}>
          Markdown supported: **bold**, *italic*, # heading, - list item, &gt; quote, [link](url)
        </p>
      </div>
      <div className="space-y-5">
        <div>
          <label className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.inkSoft }}>Category</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="f-body w-full mt-1.5 px-3 py-2.5 rounded-lg outline-none" style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }}>
            {Object.keys(CATS).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="f-mono text-[10px] uppercase tracking-widest" style={{ color: C.inkSoft }}>Cover image</label>
          <PatternCover cat={cat} src={coverUrl} className="h-32 rounded-lg mt-1.5" />
          <label className="mt-2 flex items-center justify-center gap-2 f-mono text-[11px] uppercase tracking-widest py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            style={{ border: `1px solid ${C.line}`, color: C.ink }}>
            <Upload size={13} /> {uploading ? "Uploading…" : coverUrl ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
          {uploadError && <p className="f-mono text-[11px] mt-1.5" style={{ color: C.accent }}>{uploadError}</p>}
        </div>
        <div className="flex gap-2 pt-2">
          <button disabled={saving || !title.trim() || uploading} onClick={() => onSave(buildPayload("draft"))}
            className="flex-1 f-mono text-xs uppercase tracking-widest py-2.5 rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity" style={{ border: `1px solid ${C.line}`, color: C.ink }}>
            Save draft
          </button>
          <button disabled={saving || !title.trim() || uploading} onClick={() => onSave(buildPayload("published"))}
            className="flex-1 f-mono text-xs uppercase tracking-widest py-2.5 rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity" style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
        {initial && (
          <button onClick={onCancel} className="w-full f-mono text-xs uppercase tracking-widest py-2 opacity-60 hover:opacity-90 transition-opacity" style={{ color: C.ink }}>
            Cancel edit
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // null = creating new

  // Admins see every post (with the author's name attached); everyone
  // else only sees their own.
  async function loadPosts(uid, admin) {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select("id, title, category, body, status, cover_image_url, published_at, created_at, author_id, profiles(display_name)")
      .order("created_at", { ascending: false });
    if (!admin) query = query.eq("author_id", uid);

    const { data, error } = await query;
    if (error) setError(error.message);
    else setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data?.user?.id;
      if (!uid) {
        setLoading(false);
        return;
      }
      setUserId(uid);
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", uid).single();
      const admin = profile?.role === "admin";
      setIsAdmin(admin);
      loadPosts(uid, admin);
    });
  }, []);

  async function handleSave(payload) {
    if (!userId) return;
    setSaving(true);
    setError("");

    let result;
    if (editingPost) {
      result = await supabase.from("posts").update(payload).eq("id", editingPost.id);
    } else {
      result = await supabase.from("posts").insert({ ...payload, author_id: userId });
    }

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setEditingPost(null);
    setTab("posts");
    loadPosts(userId, isAdmin);
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setPosts(posts.filter((p) => p.id !== id));
  }

  if (!loading && !userId) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <p className="f-body" style={{ color: C.ink }}>Sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-14">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="f-display text-4xl md:text-5xl" style={{ color: C.ink, fontWeight: 900 }}>
          {isAdmin ? "All posts" : "Your dashboard"}
        </h1>
        <button onClick={() => { setEditingPost(null); setTab("editor"); }} className="f-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
          <PenSquare size={14} /> New post
        </button>
      </div>
      {isAdmin && (
        <p className="f-mono text-[11px] uppercase tracking-widest mt-2.5" style={{ color: C.inkSoft }}>
          Showing every author's posts — you're signed in as admin.
        </p>
      )}

      {error && (
        <p className="f-mono text-xs mt-5 px-3.5 py-2.5 rounded-lg" style={{ background: `${C.accent}14`, color: C.accent, border: `1px solid ${C.accent}55` }}>
          {error}
        </p>
      )}

      <div className="flex gap-7 mt-10" style={{ borderBottom: `1px solid ${C.line}` }}>
        {["posts", "editor"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="f-mono text-xs uppercase tracking-widest pb-3.5"
            style={{ color: C.ink, opacity: tab === t ? 1 : 0.4, borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent" }}>
            {t === "posts" ? (isAdmin ? "All posts" : "My posts") : "Editor"}
          </button>
        ))}
      </div>

      {tab === "posts" ? (
        loading ? (
          <p className="f-mono text-sm mt-8" style={{ color: C.inkSoft }}>Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="f-body mt-8" style={{ color: C.inkSoft }}>No posts yet — create your first one.</p>
        ) : (
          <div className="mt-8 divide-y" style={{ borderColor: C.line }}>
            {posts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-5 gap-4" style={{ borderColor: C.line }}>
                <div className="flex items-center gap-4 min-w-0">
                  <PatternCover cat={p.category} src={p.cover_image_url} className="w-16 h-14 rounded-lg shrink-0 hidden sm:block" />
                  <div className="min-w-0">
                    <p className="f-body text-lg truncate" style={{ color: C.ink }}>{p.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <StatusPill status={p.status} />
                      <span className="f-mono text-[11px]" style={{ color: C.inkSoft }}>
                        {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {isAdmin && p.author_id !== userId && (
                        <span className="f-mono text-[11px]" style={{ color: C.inkSoft }}>
                          by {p.profiles?.display_name || "Unknown"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button onClick={() => { setEditingPost(p); setTab("editor"); }} className="f-mono text-xs uppercase opacity-70 hover:opacity-100 transition-opacity" style={{ color: C.ink }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: C.accent }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <PostEditor
          initial={editingPost}
          saving={saving}
          userId={userId}
          onSave={handleSave}
          onCancel={() => { setEditingPost(null); setTab("posts"); }}
        />
      )}
    </div>
  );
}
