import React from "react";
import { C } from "../theme";

// A single pulsing placeholder block. Use className to size it.
export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-lg ${className}`} style={{ background: C.surfaceAlt }} />;
}

// Mimics the shape of a PostCard while data loads.
export function PostCardSkeleton({ size = "md" }) {
  const isLg = size === "lg";
  return (
    <div>
      <SkeletonBlock className={isLg ? "h-72 md:h-[26rem] rounded-xl" : "h-44 rounded-xl"} />
      <div className={isLg ? "pt-6 space-y-3" : "pt-4 space-y-2"}>
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className={isLg ? "h-10 w-3/4" : "h-5 w-full"} />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>
    </div>
  );
}

// Mimics a grid of post cards.
export function PostGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
      {Array.from({ length: count }, (_, i) => <PostCardSkeleton key={i} />)}
    </div>
  );
}

// Mimics the shape of a full article while it loads.
export function ArticleSkeleton() {
  return (
    <div>
      <SkeletonBlock className="h-5 w-24" />
      <SkeletonBlock className="h-14 w-full mt-5" />
      <SkeletonBlock className="h-14 w-2/3 mt-3" />
      <div className="flex items-center gap-3 mt-6">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <SkeletonBlock className="h-64 md:h-80 rounded-xl mt-10" />
      <div className="mt-10 space-y-3">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
    </div>
  );
}
