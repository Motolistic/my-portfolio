import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav.jsx";
import Home from "./screens/Home.jsx";
import AssetDetail from "./screens/AssetDetail.jsx";
import Grow from "./screens/Grow.jsx";
import Activity from "./screens/Activity.jsx";
import You from "./screens/You.jsx";

export default function App() {
  const [asset, setAsset] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <TopNav />

        <main className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home onSelectAsset={setAsset} />} />
            <Route path="/grow" element={<Grow />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/you" element={<You />} />
          </Routes>
        </main>

        <AssetDetail asset={asset} onClose={() => setAsset(null)} />
      </div>
    </BrowserRouter>
  );
}
