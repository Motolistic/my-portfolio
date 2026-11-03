import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { C } from "../theme";
import { supabase } from "../lib/supabaseClient";
import { toCardShape, POST_CARD_SELECT } from "../lib/postMapping";
import PostCard from "../components/PostCard";
import { SkeletonBlock, PostGridSkeleton } from "../components/Skeleton";

export default function Author() {
  const { name } = useParams();
  const navigate = useNavigate();
  const displayName = decodeURIComponent(name || "");

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [followerCount, setFollowerCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id || null;
      if (cancelled) return;
      setUserId(uid);

      // Note: this looks authors up by display_name, matching how
      // author links are built elsewhere (e.g. from Post.jsx). Two
      // authors sharing an exact display name would collide here —
      // worth switching to an ID-based route if that becomes an issue.
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, display_name, bio, created_at")
        .eq("display_name", displayName)
        .single();

      if (cancelled) return;
      if (profileError || !profileData) {
        setError(profileError?.message || "Author not found.");
        setLoading(false);
        return;
      }
      setProfile(profileData);

      const [{ data: postsData }, { count }] = await Promise.all([
        supabase
          .from("posts")
          .select(POST_CARD_SELECT)
          .eq("status", "published")
          .eq("author_id", profileData.id)
          .order("published_at", { ascending: false }),
        supabase
          .from("followers")
          .select("id", { count: "exact", head: true })
          .eq("author_id", profileData.id),
      ]);

      if (cancelled) return;
      setPosts((postsData || []).map(toCardShape));
      setFollowerCount(count || 0);

      if (uid && uid !== profileData.id) {
        const { data: followRow } = await supabase
          .from("followers")
          .select("id")
          .eq("follower_id", uid)
          .eq("author_id", profileData.id)
          .maybeSingle();
        if (!cancelled) setFollowing(!!followRow);
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [displayName]);

  async function handleToggleFollow() {
    if (!userId) {
      navigate("/auth");
      return;
    }
    setFollowBusy(true);
    if (following) {
      await supabase.from("followers").delete().eq("follower_id", userId).eq("author_id", profile.id);
      setFollowing(false);
      setFollowerCount((n) => Math.max(0, n - 1));
    } else {
      const { error } = await supabase.from("followers").insert({ follower_id: userId, author_id: profile.id });
      if (!error) {
        setFollowing(true);
        setFollowerCount((n) => n + 1);
      }
    }
    setFollowBusy(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
        <div className="flex items-start gap-6">
          <SkeletonBlock className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-10 w-1/2" />
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-3 w-1/3" />
          </div>
        </div>
        <div className="mt-16"><PostGridSkeleton count={4} /></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
        <p className="f-display text-2xl" style={{ color: C.ink, fontWeight: 700 }}>Couldn't find that author.</p>
        <p className="f-body mt-2" style={{ color: C.inkSoft }}>{error}</p>
      </div>
    );
  }

  const joined = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : null;
  const isOwnProfile = userId === profile.id;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center f-display text-2xl shrink-0" style={{ background: C.ink, color: "#FFFFFF", fontWeight: 700 }}>
          {profile.display_name.split(" ").map((w) => w[0]).join("")}
        </div>
        <div className="flex-1">
          <h1 className="f-display text-4xl md:text-5xl" style={{ color: C.ink, fontWeight: 900 }}>{profile.display_name}</h1>
          {profile.bio && <p className="f-body mt-2 leading-relaxed" style={{ color: C.inkSoft }}>{profile.bio}</p>}
          <p className="f-mono text-xs mt-3" style={{ color: C.inkSoft }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"} · {followerCount} {followerCount === 1 ? "follower" : "followers"}{joined ? ` · joined ${joined}` : ""}
          </p>
        </div>
        {!isOwnProfile && (
          <button onClick={handleToggleFollow} disabled={followBusy}
            className="f-mono text-xs uppercase tracking-widest px-4 py-2 rounded-md shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: following ? "transparent" : C.accent, color: following ? C.ink : "#FFFFFF", border: `1px solid ${following ? C.line : "transparent"}`, fontWeight: 700 }}>
            {following ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="f-body mt-16" style={{ color: C.inkSoft }}>No published posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14 mt-16">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}
