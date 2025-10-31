// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerStatsPage from "./pages/PlayerStatsPage";
import MatchesListPage from "./pages/MatchesListPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TeamGenerator from "./pages/TeamGenerator";
import PlayerCard from "./components/PlayerCard";
import AppHeader from "./components/AppHeader";
import { fetchPlayers } from "@/api/pachangas";       // <- NUEVO: trae de Drupal
import { computePlayerValue } from "@/data/dummy";    // <- Reutilizamos tu cálculo

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const ps = await fetchPlayers(); // [{ id, name, position, totalPoints, stats, fifa, photo, ... }]
        // Calculamos el value con tu algoritmo del front para cada jugador
        const withValue = ps.map((p) => ({
          ...p,
          value: computePlayerValue({ position: p.position, totalPoints: p.totalPoints, stats: p.stats }),
        }));
        if (alive) setItems(withValue);
      } catch (e) {
        if (alive) setErr(e?.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      {/* Hero sutil */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-3 relative z-10">
          <h1 className="text-2xl font-semibold">Jugadores (desde API Drupal)</h1>
          <p className="mt-1 text-sm text-white/70">
            Haz clic en un cromo para ver estadísticas e histórico. También puedes generar equipos aleatorios.
          </p>
        </div>
      </section>

      {/* Grid de jugadores */}
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-2">
        {loading && <div className="text-sm text-white/70">Cargando…</div>}
        {err && <div className="text-sm text-red-400">Error: {err}</div>}
        {!loading && !err && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 hover:bg-white/10 transition"
              >
                {/* PlayerCard debe aceptar un objeto player con campos como los del dummy.
                    Nuestro mapeo ya devuelve el mismo shape esencial (id, name, photo, stats, fifa, totalPoints, value…). */}
                <PlayerCard player={p} />
              </div>
            ))}
          </div>
        )}
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