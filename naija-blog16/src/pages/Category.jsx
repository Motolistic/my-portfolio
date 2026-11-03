import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { C, CATS } from "../theme";
import { supabase } from "../lib/supabaseClient";
import { toCardShape, POST_CARD_SELECT } from "../lib/postMapping";
import { Kicker } from "../components/Badges";
import PostCard from "../components/PostCard";
import { PostGridSkeleton } from "../components/Skeleton";

const PAGE_SIZE = 9;

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const cat = name || "Culture";

  // Page number lives in the URL as ?page=... same pattern as Home.
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function goToPage(n) {
    if (n === 1) setSearchParams({});
    else setSearchParams({ page: String(n) });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setLoading(true);
      setError("");
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("posts")
        .select(POST_CARD_SELECT, { count: "exact" })
        .eq("status", "published")
        .eq("category", cat)
        .order("published_at", { ascending: false })
        .range(from, to);

      if (cancelled) return;
      if (error) setError(error.message);
      else {
        setPosts(data.map(toCardShape));
        setTotalCount(count || 0);
      }
      setLoading(false);
    }

    loadPosts();
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => { cancelled = true; };
  }, [cat, page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-14">
      <Kicker cat={cat} />
      <h1 className="f-display text-6xl md:text-7xl mt-5" style={{ color: C.ink, fontWeight: 900 }}>{cat}</h1>

      {loading ? (
        <div className="mt-12"><PostGridSkeleton /></div>
      ) : error ? (
        <p className="f-mono text-sm mt-5" style={{ color: C.accent }}>Couldn't load posts: {error}</p>
      ) : (
        <>
          <p className="f-mono text-xs mt-2.5" style={{ color: C.inkSoft }}>
            {totalCount} {totalCount === 1 ? "story" : "stories"}
          </p>
          {posts.length === 0 ? (
            <p className="f-body mt-12" style={{ color: C.inkSoft }}>No published stories in this category yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 mt-12">
                {posts.map((p) => <PostCard key={p.id} post={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-20">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => goToPage(n)}
                      className="f-mono text-xs w-9 h-9 rounded-full transition-opacity hover:opacity-80"
                      style={{
                        background: n === page ? C.ink : "transparent",
                        color: n === page ? "#FFFFFF" : C.ink,
                        border: `1px solid ${n === page ? C.ink : C.line}`,
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      <div className="flex gap-3 flex-wrap mt-16">
        {Object.keys(CATS).map((c) => (
          <button key={c} onClick={() => navigate(`/category/${c}`)}
            className="f-mono text-xs uppercase tracking-widest px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            style={{ border: `1px solid ${C.line}`, color: c === cat ? "#FFFFFF" : C.ink, opacity: c === cat ? 1 : 0.7, background: c === cat ? C.ink : "transparent" }}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
