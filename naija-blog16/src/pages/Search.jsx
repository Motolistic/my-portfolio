import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { C } from "../theme";
import { supabase } from "../lib/supabaseClient";
import { toCardShape, POST_CARD_SELECT } from "../lib/postMapping";
import { Kicker } from "../components/Badges";
import PatternCover from "../components/PatternCover";

export default function Search() {
  // The search term lives in the URL as ?q=... so a search is
  // shareable/bookmarkable and survives a page refresh.
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(value) {
    if (value) setSearchParams({ q: value }, { replace: true });
    else setSearchParams({}, { replace: true });
  }

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults([]);
      return;
    }

    // Debounce so we're not firing a request on every keystroke.
    const timer = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(POST_CARD_SELECT)
        .eq("status", "published")
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(20);

      if (!error) setResults(data.map(toCardShape));
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-14">
      <div className="relative">
        <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.inkSoft }} />
        <input value={q} onChange={(e) => handleChange(e.target.value)} placeholder="Search stories, categories, writers"
          className="f-body w-full pl-11 pr-4 py-3.5 rounded-lg text-lg outline-none"
          style={{ background: C.surfaceAlt, color: C.ink, border: `1px solid ${C.line}` }} />
      </div>
      <p className="f-mono text-xs mt-4" style={{ color: C.inkSoft }}>
        {loading ? "Searching…" : q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"` : " "}
      </p>

      {!loading && q.trim() && results.length === 0 && (
        <div className="mt-16 text-center">
          <p className="f-display text-2xl" style={{ color: C.ink, fontWeight: 700 }}>Nothing turned up.</p>
          <p className="f-body mt-2" style={{ color: C.inkSoft }}>Try a category name, a writer, or a different word.</p>
        </div>
      )}

      <div className="space-y-8 mt-10">
        {results.map((p) => (
          <Link key={p.id} to={`/post/${p.slug || p.id}`} className="flex gap-5 text-left w-full group">
            <PatternCover cat={p.cat} src={p.coverImageUrl} className="w-32 h-24 rounded-lg shrink-0" />
            <div>
              <Kicker cat={p.cat} />
              <h3 className="f-display text-xl mt-1.5 group-hover:opacity-70 transition-opacity" style={{ color: C.ink, fontWeight: 700 }}>{p.title}</h3>
              <p className="f-mono text-xs mt-1.5" style={{ color: C.inkSoft }}>{p.author}{p.date ? ` · ${p.date}` : ""}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
