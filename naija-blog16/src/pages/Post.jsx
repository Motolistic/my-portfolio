import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Heart, MessageCircle, Share2, Trash2, CornerDownRight } from "lucide-react";
import { C } from "../theme";
import { supabase } from "../lib/supabaseClient";
import { Kicker } from "../components/Badges";
import PatternCover from "../components/PatternCover";
import { ArticleSkeleton } from "../components/Skeleton";

// Styled overrides so Markdown output matches the site's type system
// instead of react-markdown's unstyled defaults. The first paragraph
// gets a drop-cap treatment via Tailwind's first:first-letter variant.
const mdComponents = {
  h1: (props) => <h2 className="f-display text-3xl mt-10 mb-4" style={{ color: C.ink, fontWeight: 800 }} {...props} />,
  h2: (props) => <h3 className="f-display text-2xl mt-9 mb-3" style={{ color: C.ink, fontWeight: 800 }} {...props} />,
  h3: (props) => <h4 className="f-display text-xl mt-8 mb-2" style={{ color: C.ink, fontWeight: 700 }} {...props} />,
  p: (props) => (
    <p
      className="mb-6 first:first-letter:font-black first:first-letter:float-left first:first-letter:text-[4.2rem] first:first-letter:leading-[0.75] first:first-letter:mr-2 first:first-letter:mt-1 first:first-letter:text-[#FF4B2E] first:first-letter:font-['Big_Shoulders_Display']"
      {...props}
    />
  ),
  strong: (props) => <strong style={{ fontWeight: 700 }} {...props} />,
  ul: (props) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
  li: (props) => <li {...props} />,
  blockquote: (props) => (
    <blockquote className="pl-4 italic mb-6" style={{ borderLeft: `3px solid ${C.accent}`, color: C.inkSoft }} {...props} />
  ),
  a: (props) => <a className="underline hover:opacity-70 transition-opacity" style={{ color: C.accent }} target="_blank" rel="noopener noreferrer" {...props} />,
  code: ({ inline, ...props }) =>
    inline
      ? <code className="f-mono text-sm px-1.5 py-0.5 rounded" style={{ background: C.surfaceAlt }} {...props} />
      : <code className="f-mono text-sm block p-4 rounded-lg overflow-x-auto mb-6" style={{ background: C.surfaceAlt }} {...props} />,
};

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Flat list from the DB; grouped into top-level + replies for display.
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  // Which top-level comment (if any) currently has its reply box open.
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [postingReply, setPostingReply] = useState(false);

  const [reactionCount, setReactionCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // Comments/reactions key off the post's real UUID, not its slug —
  // this is set once the post itself has loaded.
  const postId = post?.id;

  async function loadComments(pid) {
    const { data } = await supabase
      .from("comments")
      .select("id, body, created_at, user_id, parent_comment_id, profiles(display_name)")
      .eq("post_id", pid)
      .order("created_at", { ascending: true });
    setComments(data || []);
  }

  async function loadReactions(pid, uid) {
    const { count } = await supabase
      .from("reactions")
      .select("id", { count: "exact", head: true })
      .eq("post_id", pid);
    setReactionCount(count || 0);

    if (uid) {
      const { data } = await supabase
        .from("reactions")
        .select("id")
        .eq("post_id", pid)
        .eq("user_id", uid)
        .maybeSingle();
      setLiked(!!data);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError("");

      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id || null;
      if (cancelled) return;
      setUserId(uid);

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, excerpt, body, category, cover_image_url, published_at, profiles(display_name)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setPost(data);
      await Promise.all([loadComments(data.id), loadReactions(data.id, uid)]);
      if (!cancelled) setLoading(false);
    }

    loadAll();
    return () => { cancelled = true; };
  }, [slug]);

  async function handleToggleLike() {
    if (!userId) {
      navigate("/auth");
      return;
    }
    if (liked) {
      await supabase.from("reactions").delete().eq("post_id", postId).eq("user_id", userId);
      setLiked(false);
      setReactionCount((n) => Math.max(0, n - 1));
    } else {
      const { error } = await supabase.from("reactions").insert({ post_id: postId, user_id: userId });
      if (!error) {
        setLiked(true);
        setReactionCount((n) => n + 1);
      }
    }
  }

  async function handlePostComment() {
    if (!draft.trim()) return;
    if (!userId) {
      navigate("/auth");
      return;
    }
    setPosting(true);
    const { error } = await supabase.from("comments").insert({ post_id: postId, user_id: userId, body: draft.trim() });
    setPosting(false);
    if (!error) {
      setDraft("");
      loadComments(postId);
    }
  }

  async function handlePostReply(parentId) {
    if (!replyDraft.trim()) return;
    if (!userId) {
      navigate("/auth");
      return;
    }
    setPostingReply(true);
    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: userId, body: replyDraft.trim(), parent_comment_id: parentId });
    setPostingReply(false);
    if (!error) {
      setReplyDraft("");
      setReplyingTo(null);
      loadComments(postId);
    }
  }

  async function handleDeleteComment(commentId) {
    await supabase.from("comments").delete().eq("id", commentId);
    // Deleting a top-level comment cascades to its replies at the DB
    // level (on delete cascade), so drop both locally too.
    setComments((cs) => cs.filter((c) => c.id !== commentId && c.parent_comment_id !== commentId));
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <ArticleSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        <button onClick={() => navigate(-1)} className="f-mono text-xs uppercase tracking-widest opacity-60 flex items-center gap-1 mb-8" style={{ color: C.ink }}>
          <ArrowLeft size={13} /> Back
        </button>
        <p className="f-display text-2xl" style={{ color: C.ink, fontWeight: 700 }}>Couldn't find that story.</p>
        <p className="f-body mt-2" style={{ color: C.inkSoft }}>{error || "It may have been unpublished or removed."}</p>
      </div>
    );
  }

  const author = post.profiles?.display_name || "Unknown author";
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const topLevel = comments.filter((c) => !c.parent_comment_id);
  const repliesFor = (parentId) => comments.filter((c) => c.parent_comment_id === parentId);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <button onClick={() => navigate(-1)} className="f-mono text-xs uppercase tracking-widest opacity-60 flex items-center gap-1 mb-8 hover:opacity-90 transition-opacity" style={{ color: C.ink }}>
        <ArrowLeft size={13} /> Back
      </button>
      <Kicker cat={post.category} />
      <h1 className="f-display text-4xl md:text-7xl mt-5 leading-[0.95] tracking-tight" style={{ color: C.ink, fontWeight: 900 }}>{post.title}</h1>
      <div className="flex items-center gap-3 mt-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center f-mono text-xs" style={{ background: C.ink, color: "#FFFFFF" }}>
          {author.split(" ").map((w) => w[0]).join("")}
        </div>
        <div>
          <Link to={`/author/${encodeURIComponent(author)}`} className="f-mono text-xs underline decoration-1 underline-offset-2 hover:opacity-70" style={{ color: C.ink }}>{author}</Link>
          {date && <p className="f-mono text-[11px] mt-0.5" style={{ color: C.inkSoft }}>{date}</p>}
        </div>
      </div>

      <PatternCover cat={post.category} src={post.cover_image_url} className="h-64 md:h-80 rounded-xl mt-10" />

      <div className="f-body mt-10 text-lg leading-[1.8]" style={{ color: C.ink }}>
        <ReactMarkdown components={mdComponents}>{post.body || post.excerpt}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-7 mt-10 py-5" style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <button onClick={handleToggleLike} className="flex items-center gap-2 f-mono text-sm hover:opacity-70 transition-opacity" style={{ color: liked ? C.accent : C.ink }}>
          <Heart size={17} fill={liked ? C.accent : "none"} /> {reactionCount}
        </button>
        <span className="flex items-center gap-2 f-mono text-sm" style={{ color: C.inkSoft }}>
          <MessageCircle size={17} /> {comments.length}
        </span>
        <span className="flex items-center gap-2 f-mono text-sm hover:opacity-70 transition-opacity cursor-pointer" style={{ color: C.inkSoft }}>
          <Share2 size={17} /> Share
        </span>
      </div>

      <div className="mt-10">
        <h3 className="f-display text-xl uppercase tracking-wide mb-5" style={{ color: C.ink, fontWeight: 700 }}>Comments</h3>
        <div className="space-y-7">
          {topLevel.length === 0 && (
            <p className="f-body text-sm" style={{ color: C.inkSoft }}>Be the first to comment.</p>
          )}
          {topLevel.map((c) => {
            const name = c.profiles?.display_name || "Reader";
            const replies = repliesFor(c.id);
            return (
              <div key={c.id}>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center f-mono text-[11px] shrink-0" style={{ background: C.surfaceAlt, color: C.ink }}>{name[0]}</div>
                  <div className="flex-1">
                    <p className="f-mono text-xs" style={{ color: C.ink }}>
                      {name} <span style={{ color: C.inkSoft }}>· {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </p>
                    <p className="f-body text-sm mt-1.5 leading-relaxed" style={{ color: C.ink }}>{c.body}</p>
                    <button
                      onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyDraft(""); }}
                      className="f-mono text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 flex items-center gap-1 mt-2.5"
                      style={{ color: C.ink }}>
                      <CornerDownRight size={12} /> Reply
                    </button>

                    {replyingTo === c.id && (
                      <div className="mt-3">
                        <textarea value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)}
                          placeholder={userId ? `Reply to ${name}` : "Sign in to reply"} disabled={!userId}
                          className="f-body w-full rounded-lg px-3 py-2.5 text-sm outline-none disabled:opacity-50"
                          style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} rows={2} />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handlePostReply(c.id)} disabled={postingReply || !userId}
                            className="f-mono text-[11px] uppercase tracking-widest px-3 py-1.5 rounded disabled:opacity-50"
                            style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
                            {postingReply ? "Posting…" : "Post reply"}
                          </button>
                          <button onClick={() => setReplyingTo(null)}
                            className="f-mono text-[11px] uppercase tracking-widest px-3 py-1.5 opacity-60" style={{ color: C.ink }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {c.user_id === userId && (
                    <button onClick={() => handleDeleteComment(c.id)} className="opacity-40 hover:opacity-100 shrink-0 transition-opacity" style={{ color: C.accent }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {replies.map((r) => {
                  const rName = r.profiles?.display_name || "Reader";
                  return (
                    <div key={r.id} className="flex gap-3 ml-10 mt-4">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center f-mono text-[10px] shrink-0" style={{ background: C.accent, color: "#FFFFFF" }}>{rName[0]}</div>
                      <div className="flex-1">
                        <p className="f-mono text-xs" style={{ color: C.ink }}>
                          {rName} <span style={{ color: C.inkSoft }}>· {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </p>
                        <p className="f-body text-sm mt-1.5 leading-relaxed" style={{ color: C.ink }}>{r.body}</p>
                      </div>
                      {r.user_id === userId && (
                        <button onClick={() => handleDeleteComment(r.id)} className="opacity-40 hover:opacity-100 shrink-0 transition-opacity" style={{ color: C.accent }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={userId ? "Add to the conversation" : "Sign in to comment"}
            disabled={!userId}
            className="f-body w-full rounded-lg px-3.5 py-3 text-sm outline-none disabled:opacity-50"
            style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} rows={3} />
          <button
            onClick={handlePostComment}
            disabled={posting || !userId}
            className="f-mono text-xs uppercase tracking-widest mt-3 px-5 py-2.5 rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity" style={{ background: C.accent, color: "#FFFFFF", fontWeight: 700 }}>
            {posting ? "Posting…" : userId ? "Post comment" : "Sign in to comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
