
import React from "react";
import { useParams, Link } from "react-router-dom";
import { players } from "../data/dummy";

function StatBadge({ label, value, hint }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export default function PlayerStatsPage() {
  const { id } = useParams();
  const player = players.find((p) => p.id === id) || players[0];

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
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          {/* Left: cromo */}
          <div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 ring-1 ring-black/10">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]" />
              <div className="absolute inset-3 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/30" />
              <div className="relative z-10 p-4 text-white">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="px-2 py-0.5 rounded-full bg-white/15 ring-1 ring-white/30">{player.position}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-white/20">{player.team}</span>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <img src={player.image} alt={player.name} className="w-40 h-40 object-contain drop-shadow-md" />
                </div>
                <h1 className="mt-6 text-3xl font-bold">{player.name}</h1>
                <p className="text-white/85">{player.nationality} · {player.age} años · {player.height}cm · {player.weight}kg · {player.foot}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/20">
                    <div className="text-xl font-bold">{player.totalPoints}</div>
                    <div className="text-xs opacity-80">Puntos</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/20">
                    <div className="text-xl font-bold">{player.value.toLocaleString()}</div>
                    <div className="text-xs opacity-80">Valor</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/20">
                    <div className="text-xl font-bold">{player.matches}</div>
                    <div className="text-xs opacity-80">Partidos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: stats & history */}
          <div className="space-y-6">
            <section className="grid sm:grid-cols-3 gap-3">
              <StatBadge label="Goles" value={player.goals} />
              <StatBadge label="Asistencias" value={player.assists} />
              <StatBadge label="Paradas" value={player.saves} hint={player.position === "POR" ? "Incluye penaltis" : undefined} />
              <StatBadge label="Porterías a cero" value={player.cleanSheets} />
              <StatBadge label="Valor" value={`${player.value.toLocaleString()} €`} />
              <StatBadge label="Puntos totales" value={player.totalPoints} />
            </section>

            <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <h2 className="text-lg font-semibold">Forma reciente</h2>
              <div className="mt-3 flex gap-2">
                {player.recentForm.map((v, i) => (
                  <div key={i} className="flex-1 h-10 rounded-lg bg-slate-100 ring-1 ring-slate-200 grid place-items-center text-sm font-medium">{v}</div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <h2 className="text-lg font-semibold">Histórico de partidos</h2>
              <div className="mt-3 divide-y">
                {player.history.map((h) => (
                  <Link key={h.id} to={`/matches/${h.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50 rounded-lg px-2 -mx-2">
                    <div>
                      <div className="font-medium">{h.date} · vs {h.opponent}</div>
                      <div className="text-sm text-slate-500">Rating {h.rating ?? "-"} · {h.result}</div>
                    </div>
                    <div className="text-sm text-slate-500">Ver crónica →</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
