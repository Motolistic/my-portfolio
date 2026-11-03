// Placeholder data. Swap these for real Supabase queries later
// (see src/lib/supabaseClient.js) — keep the same shape so pages
// don't need to change much when that happens.

export const POSTS = [
  { id: 1, cat: "Culture", title: "Lagos Traffic Diaries: What Danfo Drivers Taught Me About Patience", excerpt: "Three hours from Ojota to Ikeja, and a lesson in the art of waiting that no seminar could teach.", author: "Amara Chukwu", date: "Jul 14", read: "6 min", likes: 128, comments: 24, status: "published" },
  { id: 2, cat: "Business", title: "Naira Notes: Five Fintech Startups Rewriting Nigerian Banking", excerpt: "From agent networks to cross-border rails, the founders betting that banking still has a long way to go.", author: "Tunde Bakare", date: "Jul 12", read: "8 min", likes: 94, comments: 11, status: "published" },
  { id: 3, cat: "Fashion", title: "Ankara Reimagined: The Designers Blending Heritage With Streetwear", excerpt: "A new generation is cutting wax print into silhouettes their grandmothers would not recognize, and loving it.", author: "Zainab Lawal", date: "Jul 11", read: "5 min", likes: 210, comments: 33, status: "published" },
  { id: 4, cat: "Culture", title: "Jollof Wars: A Taste Test Across Six Lagos Kitchens", excerpt: "We ate too much rice so you don't have to pick wrong at the next owambe.", author: "Amara Chukwu", date: "Jul 9", read: "4 min", likes: 302, comments: 58, status: "published" },
  { id: 5, cat: "Tech", title: "Building for Naira: Why Nigerian Devs Are Going Fintech-First", excerpt: "Inside the bootcamps and Slack channels quietly producing the country's next generation of backend engineers.", author: "Chidi Okoro", date: "Jul 8", read: "7 min", likes: 76, comments: 9, status: "published" },
  { id: 6, cat: "Sports", title: "The Super Eagles' Youth Pipeline Problem", excerpt: "Talent has never been the issue. Getting it noticed before Europe does might be.", author: "Ifeanyi Obi", date: "Jul 6", read: "6 min", likes: 61, comments: 14, status: "published" },
  { id: 7, cat: "Fashion", title: "Abeokuta's Adire Makers Are Going Digital", excerpt: "The dye pits are centuries old. The order books are now on WhatsApp.", author: "Zainab Lawal", date: "Jul 3", read: "5 min", likes: 143, comments: 19, status: "draft" },
  { id: 8, cat: "Business", title: "Inside the Co-working Boom Reshaping Lagos Mainland", excerpt: "Why founders are betting on Yaba and Surulere over the island, one desk at a time.", author: "Tunde Bakare", date: "Jun 30", read: "6 min", likes: 58, comments: 7, status: "archived" },
];

export const AUTHORS = [
  { name: "Amara Chukwu", role: "author", bio: "Culture writer. Chronic overpacker of suitcases and opinions.", posts: 34, joined: "2024" },
  { name: "Tunde Bakare", role: "author", bio: "Covers business and fintech. Ex-analyst, current skeptic.", posts: 21, joined: "2024" },
  { name: "Zainab Lawal", role: "author", bio: "Fashion and textile history. Will talk about adire for hours.", posts: 19, joined: "2025" },
  { name: "Chidi Okoro", role: "author", bio: "Backend engineer turned tech columnist.", posts: 12, joined: "2025" },
];

export const COMMENTS = [
  { id: 1, user: "Kelechi", body: "This is exactly how I felt on the Third Mainland Bridge last week. Painfully accurate.", date: "2h", replies: [
    { id: 11, user: "Amara Chukwu", body: "The bridge deserves its own essay honestly.", date: "1h" },
  ]},
  { id: 2, user: "Bisi A.", body: "The line about the conductor's proverb had me laughing on the bus.", date: "5h", replies: [] },
];
