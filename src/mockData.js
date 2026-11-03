export const growthSeries = [
  { t: 0, v: 1000 }, { t: 1, v: 1030 }, { t: 2, v: 1012 }, { t: 3, v: 1080 },
  { t: 4, v: 1065 }, { t: 5, v: 1120 }, { t: 6, v: 1098 }, { t: 7, v: 1180 },
  { t: 8, v: 1210 }, { t: 9, v: 1260 }, { t: 10, v: 1240 }, { t: 11, v: 1310 },
  { t: 12, v: 1284.5 },
];

export const holdings = [
  { id: "grw", name: "Grain Fund", tag: "Growth basket", value: 512.4, change: 2.4, up: true, spark: [4, 6, 5, 7, 8, 7, 9, 10, 9, 11] },
  { id: "stl", name: "Steady Fund", tag: "Bonds & cash", value: 340.1, change: 0.6, up: true, spark: [5, 5, 6, 5, 6, 6, 7, 6, 7, 7] },
  { id: "hzn", name: "Horizon 30", tag: "Long-term shares", value: 288.9, change: -1.1, up: false, spark: [9, 8, 9, 7, 8, 6, 7, 6, 5, 6] },
  { id: "nrt", name: "Naira Reserve", tag: "Local money market", value: 143.1, change: 0.2, up: true, spark: [6, 6, 6, 7, 6, 7, 6, 7, 7, 7] },
];

export const products = [
  { id: 1, name: "Starter Basket", blurb: "A gentle mix for your first ₦10,000", rate: "8–11%", term: "No lock-in", tone: "forest" },
  { id: 2, name: "Steady Growth", blurb: "Bonds and blue-chip shares, low swings", rate: "12–15%", term: "90 days", tone: "gold" },
  { id: 3, name: "Reach Fund", blurb: "Higher growth for money you won't touch soon", rate: "18–24%", term: "1 year", tone: "forest" },
];

export const activity = [
  { id: 1, kind: "in", label: "Deposit", note: "Bank transfer", amount: 200, date: "Jul 24" },
  { id: 2, kind: "buy", label: "Bought Grain Fund", note: "Auto-invest", amount: -50, date: "Jul 22" },
  { id: 3, kind: "gain", label: "Growth credited", note: "Grain Fund", amount: 6.4, date: "Jul 20" },
  { id: 4, kind: "out", label: "Withdrawal", note: "To GTBank ••42", amount: -80, date: "Jul 15" },
  { id: 5, kind: "buy", label: "Bought Steady Fund", note: "One-time", amount: -100, date: "Jul 9" },
];

export const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
