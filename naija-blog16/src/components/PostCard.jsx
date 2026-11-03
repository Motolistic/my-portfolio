import React from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme";
import PatternCover from "./PatternCover";
import { Kicker } from "./Badges";

export default function PostCard({ post, size = "md" }) {
  const navigate = useNavigate();
  const isLg = size === "lg";
  return (
    <button onClick={() => navigate(`/post/${post.slug || post.id}`)} className="text-left group w-full transition-opacity hover:opacity-90">
      <PatternCover cat={post.cat} src={post.coverImageUrl} className={isLg ? "h-72 md:h-[26rem] rounded-xl" : "h-44 rounded-xl"} />
      <div className={isLg ? "pt-6" : "pt-4"}>
        <Kicker cat={post.cat} />
        <h3
          className={`f-display mt-3 leading-[1.05] group-hover:opacity-70 transition-opacity ${isLg ? "text-4xl md:text-6xl" : "text-xl"}`}
          style={{ color: C.ink, fontWeight: 800 }}
        >
          {post.title}
        </h3>
        {isLg && <p className="f-body mt-4 text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: C.inkSoft }}>{post.excerpt}</p>}
        <p className="f-mono text-xs mt-3 tracking-wide" style={{ color: C.inkSoft }}>
          {post.author}{post.date ? ` · ${post.date}` : ""}{post.read ? ` · ${post.read} read` : ""}
        </p>
      </div>
    </button>
  );
}
