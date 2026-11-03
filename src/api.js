// Thin API layer.
//
// If VITE_API_URL is set (see .env.local.example), these functions hit
// the real backend. If it's not set — e.g. running the frontend on its
// own with no backend yet — each function falls back to the mock data
// in mockData.js, so every screen still works out of the box.

import * as mock from "./mockData.js";

const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function getPortfolio() {
  if (!BASE_URL) return { total: mock.holdings.reduce((s, h) => s + h.value, 0), growthSeries: mock.growthSeries };
  return request("/portfolio");
}

export async function getHoldings() {
  if (!BASE_URL) return mock.holdings;
  return request("/holdings");
}

export async function getProducts() {
  if (!BASE_URL) return mock.products;
  return request("/products");
}

export async function getActivity() {
  if (!BASE_URL) return mock.activity;
  return request("/activity");
}

export async function subscribeToProduct(productId, amount) {
  if (!BASE_URL) {
    console.warn("No VITE_API_URL configured — subscribe is a no-op in mock mode.");
    return { ok: true, mock: true };
  }
  return request("/products/subscribe", {
    method: "POST",
    body: JSON.stringify({ productId, amount }),
  });
}

export { fmt } from "./mockData.js";
