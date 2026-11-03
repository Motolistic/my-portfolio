import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { C, CATS } from "../theme";
import { supabase } from "../lib/supabaseClient";
import { toCardShape, POST_CARD_SELECT } from "../lib/postMapping";
import PostCard from "../components/PostCard";
import { PostGridSkeleton } from "../components/Skeleton";

const PAGE_SIZE = 9;

export default function Home() {
  // Page number lives in the URL as ?page=... so pagination is
  // shareable/bookmarkable and survives a refresh.
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
        .order("published_at", { ascending: false })
        .range(from, to);

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setPosts(data.map(toCardShape));
        setTotalCount(count || 0);
      }
      setLoading(false);
    }

    loadPosts();
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => { cancelled = true; };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-14">
      {/* Category filter strip — a simple way to browse without a sidebar */}
      <div className="flex gap-2.5 flex-wrap mb-12">
        {Object.entries(CATS).map(([name, { c }]) => (
          <Link key={name} to={`/category/${name}`}
            className="f-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
            style={{ border: `1px solid ${C.line}`, color: C.ink }}>
            <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ background: c }} />
            {name}
          </Link>
        ))}
      </div>

      {loading ? (
        <PostGridSkeleton />
      ) : error ? (
        <p className="f-mono text-sm" style={{ color: C.accent }}>Couldn't load posts: {error}</p>
      ) : posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="f-display text-3xl" style={{ color: C.ink, fontWeight: 800 }}>No stories published yet.</p>
          <p className="f-body mt-2" style={{ color: C.inkSoft }}>Check back soon, or publish one from your dashboard.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
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
    </div>
  );
}
