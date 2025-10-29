import React, { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import Leaderboard from "../components/Leaderboard";
import * as dummy from "../data/dummy";

/**
 * LeaderboardPage
 * Clasificaciones: Goles, Asistencias, Paradas, Partidos jugados.
 * - Lee primero de dummy.js (players con stats) y opcionalmente intenta API.
 */
export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);

  // Extrae players desde dummy.js con prioridad a export nombrada { players }
  const pickPlayersFromDummy = () => {
    const mod = dummy?.default ?? dummy;
    if (Array.isArray(mod?.players)) return mod.players;
    if (Array.isArray(mod)) return mod; // por si export default []
    for (const k of Object.keys(mod || {})) {
      const v = mod[k];
      if (Array.isArray(v) && v.length && typeof v[0] === "object" && ("name" in v[0] || "nombre" in v[0])) {
        return v;
      }
    }
    return [];
  };

  // Normaliza: usa stats reales del dummy (stats.goals, stats.assists, stats.saves, matchesPlayed)
  const normalize = (list) =>
    (list || []).map((p, i) => {
      const stats = p.stats || {};
      return {
        id: p.id ?? p.uuid ?? String(i),
        name: p.name ?? p.player ?? p.nombre ?? "Jugador",
        goals: Number(p.goals ?? p.goles ?? stats.goals ?? stats.g ?? 0),
        assists: Number(p.assists ?? p.asistencias ?? stats.assists ?? stats.a ?? 0),
        saves: Number(p.saves ?? p.paradas ?? stats.saves ?? stats.paradas ?? 0),
        matches: Number(
          p.matches ?? p.partidos ?? p.partidos_jugados ?? p.matchesPlayed ?? stats.matches ?? 0
        ),
        ...p,
      };
    });

  useEffect(() => {
    // 1) Datos locales reales
    const localPlayers = normalize(pickPlayersFromDummy());
    setPlayers(localPlayers);

    // 2) Opcional: si hay API la usamos
    const tryApi = async () => {
      const useApiData = (data) => {
        const arr = Array.isArray(data?.players) ? data.players : Array.isArray(data) ? data : [];
        if (arr.length) setPlayers(normalize(arr));
      };
      try {
        let res = await fetch("/api/jugadores");
        if (res.ok) return useApiData(await res.json());
        res = await fetch("/api/players");
        if (res.ok) return useApiData(await res.json());
      } catch {
        /* nos quedamos con dummy */
      }
    };
    tryApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sólo búsqueda por nombre (sin filtro por equipo)
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return players.filter((p) => !q || (p.name && p.name.toLowerCase().includes(q)));
  }, [players, search]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-2">
          <h1 className="text-2xl font-semibold">Estadísticas</h1>
          <p className="mt-1 text-sm text-white/70">
            Clasificaciones generadas desde los datos reales (dummy.js o API).
          </p>
        </div>
      </div>

      {/* Controles (sólo búsqueda) */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-4">
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-1">Buscar</label>
          <input
            type="text"
            placeholder="Nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
          />
        </div>
      </section>

      {/* Grid de tablas */}
      <main className="mx-auto max-w-6xl px-4 pb-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Leaderboard
            title="Máximos goleadores"
            players={filtered}
            metricKey="goals"
            metricLabel="Goles"
            maxItems={20}
          />
          <Leaderboard
            title="Máximos asistentes"
            players={filtered}
            metricKey="assists"
            metricLabel="Asistencias"
            maxItems={20}
          />
          <Leaderboard
            title="Porteros con más paradas"
            players={filtered}
            metricKey="saves"
            metricLabel="Paradas"
            maxItems={20}
          />
          <Leaderboard
            title="Más partidos jugados"
            players={filtered}
            metricKey="matches"
            metricLabel="Partidos"
            maxItems={20}
          />
        </section>
      </main>
    </div>
  );
}