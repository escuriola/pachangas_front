import React, { useEffect, useMemo, useState } from "react";
import Leaderboard from "../components/Leaderboard";
import dummy from "../data/dummy"; // Se asume export por defecto o named { players }. Ajusta si es distinto.

/**
 * Página de Estadísticas
 * Muestra clasificaciones para Goles, Asistencias, Paradas y Partidos Jugados.
 * - Fuente primaria: dummy.js
 * - Si existe API /api/jugadores (o /api/players), intenta traerla y sobreescribe el dummy.
 */
export default function Estadisticas() {
  const [players, setPlayers] = useState([]);

  // Normaliza la estructura esperada: { id, name, team, goals, assists, saves, matches }
  const normalize = (list) =>
    (list || []).map((p, i) => ({
      id: p.id ?? p.uuid ?? i,
      name: p.name ?? p.player ?? p.nombre ?? "Jugador",
      team: p.team ?? p.equipo ?? "—",
      goals: Number(p.goals ?? p.goles ?? 0),
      assists: Number(p.assists ?? p.asistencias ?? 0),
      saves: Number(p.saves ?? p.paradas ?? 0),
      matches: Number(p.matches ?? p.partidos ?? p.partidos_jugados ?? 0),
      ...p,
    }));

  useEffect(() => {
    // 1) Cargar dummy primero (base estable)
    const base = Array.isArray(dummy?.players) ? dummy.players : Array.isArray(dummy) ? dummy : [];
    setPlayers(normalize(base));

    // 2) Intentar API si existe (no rompe si no está)
    const tryApi = async () => {
      try {
        // Intenta ambas rutas comunes
        const res = await fetch("/api/jugadores", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPlayers(normalize(data));
            return;
          }
          // Si viene en {players: [...]}
          if (Array.isArray(data?.players)) {
            setPlayers(normalize(data.players));
            return;
          }
        } else {
          // fallback a /api/players
          const res2 = await fetch("/api/players", { method: "GET" });
          if (res2.ok) {
            const data2 = await res2.json();
            const arr = Array.isArray(data2?.players) ? data2.players : Array.isArray(data2) ? data2 : [];
            if (Array.isArray(arr)) setPlayers(normalize(arr));
          }
        }
      } catch {
        // Silencioso: nos quedamos con dummy
      }
    };
    tryApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtros simples: por equipo y búsqueda por nombre
  const [teamFilter, setTeamFilter] = useState("all");
  const [search, setSearch] = useState("");

  const teams = useMemo(() => {
    const set = new Set();
    players.forEach((p) => p.team && set.add(p.team));
    return ["all", ...Array.from(set).sort()];
  }, [players]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return players.filter((p) => {
      const teamOk = teamFilter === "all" || p.team === teamFilter;
      const searchOk =
        s.length === 0 ||
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.team && p.team.toLowerCase().includes(s));
      return teamOk && searchOk;
    });
  }, [players, teamFilter, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Estadísticas</h1>
        <p className="text-gray-300 mt-1">
          Clasificaciones generadas a partir de los datos del mercado (dummy.js o API).
        </p>
      </header>

      {/* Controles */}
      <section className="mb-6 md:mb-8 flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-sm text-gray-300 mb-1">Buscar</label>
          <input
            type="text"
            placeholder="Nombre o equipo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
          />
        </div>
        <div className="md:w-64">
          <label className="block text-sm text-gray-300 mb-1">Equipo</label>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
          >
            {teams.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "Todos" : t}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Grid de tablas */}
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
    </div>
  );
}