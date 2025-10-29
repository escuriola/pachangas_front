import React, { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import * as dummy from "../data/dummy"; // computePlayerValue incluido

function isGK(p) {
  const pos = String(p.position || "").toLowerCase();
  return pos.includes("portero") || pos === "gk" || pos.includes("goalkeeper");
}

function shuffle(arr, seed = Math.random()) {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const j = Math.floor(r * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sumValue(team) {
  return team.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
}

function assignFieldPlayersBalanced(gkA, gkB, fieldPlayers) {
  const tA = [gkA];
  const tB = [gkB];
  let sumA = gkA.value || 0;
  let sumB = gkB.value || 0;

  const sorted = shuffle(fieldPlayers).sort((x, y) => (y.value || 0) - (x.value || 0));
  for (const p of sorted) {
    if (sumA <= sumB) {
      tA.push(p);
      sumA += p.value || 0;
    } else {
      tB.push(p);
      sumB += p.value || 0;
    }
  }
  return { teamA: tA, teamB: tB, diff: Math.abs(sumA - sumB) };
}

function buildBestTeams(activePlayers) {
  const gks = activePlayers.filter(isGK);
  const field = activePlayers.filter((p) => !isGK(p));

  if (gks.length < 2) return { error: "Se necesitan al menos 2 porteros dados de alta para generar equipos." };
  if (activePlayers.length < 2) return { error: "Se necesitan al menos 2 jugadores dados de alta." };

  let best = null;
  for (let i = 0; i < gks.length; i++) {
    for (let j = i + 1; j < gks.length; j++) {
      const { teamA, teamB, diff } = assignFieldPlayersBalanced(gks[i], gks[j], field);
      if (!best || diff < best.diff) best = { teamA, teamB, diff };
    }
  }
  return best || { error: "No fue posible generar equipos." };
}

export default function TeamGenerator() {
  const [players, setPlayers] = useState([]);
  const [active, setActive] = useState(() => new Set());
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Tomamos los players del dummy y les inyectamos el value calculado
    const base = (dummy.players || []).map((p, i) => ({
      id: String(p.id ?? i),
      name: p.name ?? p.nombre ?? "Jugador",
      position: p.position ?? p.posicion ?? "",
      totalPoints: Number(p.totalPoints ?? 0),
      stats: p.stats || {},
      // valor calculado:
      value: dummy.computePlayerValue(p),
      photo: p.photo,
    }));
    setPlayers(base);
    // Si prefieres que empiece con todos activos:
    // setActive(new Set(base.map(p => p.id)));
  }, []);

  const allChecked = useMemo(() => players.length > 0 && players.every((p) => active.has(p.id)), [players, active]);
  const anyChecked = useMemo(() => players.some((p) => active.has(p.id)), [players, active]);

  const toggleOne = (id) => {
    setResult(null);
    setActive((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const setAll = (checked) => {
    setResult(null);
    setActive(checked ? new Set(players.map((p) => p.id)) : new Set());
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const actives = players.filter((p) => active.has(p.id));
    const built = buildBestTeams(actives);
    setResult(built);
  };

  const reroll = () => {
    if (!anyChecked) return;
    const actives = players.filter((p) => active.has(p.id));
    const built = buildBestTeams(shuffle(actives));
    setResult(built);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppHeader />

      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-2">
          <h1 className="text-2xl font-semibold">Generador aleatorío de equipos</h1>
          <p className="mt-1 text-sm text-white/70">Da de alta jugadores y genera 2 equipos equilibrados por valor, con 1 portero en cada equipo.</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleGenerate} className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        {/* Controles de selección */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setAll(true)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Activar todos
          </button>
          <button type="button" onClick={() => setAll(false)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Desactivar todos
          </button>
          <span className="text-white/70 text-sm">
            {Array.from(active).length} / {players.length} activos
          </span>
          <div className="ml-auto flex gap-2">
            <button type="submit" className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm ring-1 ring-emerald-400/30 hover:bg-emerald-500/20" disabled={!anyChecked} title={!anyChecked ? "Activa al menos 2 jugadores" : "Generar equipos"}>
              Generar equipos
            </button>
            <button type="button" onClick={reroll} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" disabled={!result || !!result?.error} title="Volver a generar manteniendo la misma selección">
              Volver a generar
            </button>
          </div>
        </div>

        {/* Listado de jugadores */}
        <div className="grid gap-3 md:grid-cols-2">
          {players.map((p) => {
            const checked = active.has(p.id);
            const tag = isGK(p) ? "Portero" : "Jugador";
            return (
              <label key={p.id} className={["flex items-center justify-between gap-3 rounded-2xl border p-3", checked ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"].join(" ")}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={checked} onChange={() => toggleOne(p.id)} className="size-4 accent-emerald-500" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-white/60">
                      {tag} · Valor: <span className="font-mono">{p.value}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs rounded-md px-2 py-0.5 ring-1 ring-white/10 bg-white/5 text-white/70">{isGK(p) ? "🧤 GK" : "⚽ CAMPO"}</div>
              </label>
            );
          })}
        </div>

        {/* Resultado */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {result?.error && (
            <div className="md:col-span-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
              <div className="text-rose-200">{result.error}</div>
            </div>
          )}

          {result && !result.error && (
            <>
              <TeamCard title="Equipo A" team={result.teamA} />
              <TeamCard title="Equipo B" team={result.teamB} />
              <div className="md:col-span-2 text-sm text-white/70">
                Diferencia de valor: <span className="font-semibold text-white">{result.diff}</span>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

function TeamCard({ title, team }) {
  const total = useMemo(() => sumValue(team || []), [team]);
  const gk = (team || []).find(isGK);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm text-white/80">Total valor: <span className="font-mono font-bold">{total}</span></div>
      </div>
      {gk && (
        <div className="mb-2 text-xs text-white/70">
          Portero: <span className="font-medium text-white">{gk.name}</span>
        </div>
      )}
      <ul className="space-y-2">
        {(team || []).map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <span className="truncate">{p.name} {isGK(p) ? <span className="text-white/60">(GK)</span> : null}</span>
            <span className="font-mono">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}