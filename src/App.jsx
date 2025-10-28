
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PlayerStatsPage from "./pages/PlayerStatsPage";
import MatchesListPage from "./pages/MatchesListPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import PlayerCard from "./components/PlayerCard";
import { players } from "./data/dummy";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Pachangas</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/matches" className="px-3 py-1 rounded-lg hover:bg-slate-100">Partidos</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">Plantilla</h1>
        <p className="text-slate-600">Haz clic en un cromo para ver las estadísticas al estilo Sorare.</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p) => <PlayerCard key={p.id} player={p} />)}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players/:id" element={<PlayerStatsPage />} />
        <Route path="/matches" element={<MatchesListPage />} />
        <Route path="/matches/:id" element={<MatchDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
