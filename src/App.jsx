import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PlayerStatsPage from "./pages/PlayerStatsPage";
import MatchesListPage from "./pages/MatchesListPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TeamGenerator from "./pages/TeamGenerator";
import PlayerCard from "./components/PlayerCard";
import { players } from "./data/dummy";
import AppHeader from "./components/AppHeader";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      {/* Hero sutil */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-3 relative z-10">
          <h1 className="text-2xl font-semibold">Jugadores (Hombres blandengues)</h1>
          <p className="mt-1 text-sm text-white/70">
            Haz clic en un cromo para ver estadísticas e histórico. Tambiñen puedes generar equipos aleatorios.k
          </p>
        </div>
      </section>

      {/* Grid de jugadores */}
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-2">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 hover:bg-white/10 transition"
            >
              {/* Contenedor “glass” para el cromo; PlayerCard renderiza el cromo dentro */}
              <PlayerCard player={p} />
            </div>
          ))}
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
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/team-generator" element={<TeamGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}