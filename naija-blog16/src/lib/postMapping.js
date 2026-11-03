// Maps a raw Supabase `posts` row (joined with profiles(display_name))
// into the shape PostCard expects: { id, slug, cat, title, excerpt, author, date, coverImageUrl }
export function toCardShape(row) {
  return {
    id: row.id,
    slug: row.slug,
    cat: row.category,
    title: row.title,
    excerpt: row.excerpt,
    author: row.profiles?.display_name || "Unknown author",
    coverImageUrl: row.cover_image_url,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : null,
  };
}

// Standard select string for the posts-list style query used across
// Home, Category, Author, and Search pages.
export const POST_CARD_SELECT = "id, slug, title, excerpt, category, cover_image_url, published_at, profiles(display_name)";
