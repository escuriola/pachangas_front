import React from "react";
import { useParams, Link } from "react-router-dom";
import { players, playerHistories } from "../data/dummy";
import SorareCard from "../components/SorareCard";

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
  const player = players.find((p) => String(p.id) === String(id)) || players[0];
  const history = playerHistories[player.id] || [];

  // Inferir rareza si no viene en los datos
  const rarity =
    player.rarity ||
    (player.value >= 800 ? "gold" : player.value >= 400 ? "silver" : "bronze");

  // Mapeo de datos para SorareCard
  const cardProps = {
    rarity,
    photo: player.photo || "/players/sample.png",
    name: player.name,
    nationality: player.nationality || "🇪🇸",
    position: player.position === "PORTERO" ? "PORTERO" : "CAMPO",
    age: player.age ?? "-",
    totalPoints: player.totalPoints ?? 0,
    supply: player.supply ?? 1,
    supplyTotal: player.supplyTotal ?? 1000,
    fifa: {
      PAS:
        player.stats?.passesCompleted ??
        player.stats?.pass ?? // por si hay otra clave
        "-",
      TIR: player.stats?.shots ?? "-",
      REG: player.stats?.dribbles ?? "-",
      FIS: player.stats?.physical ?? "-",
      PAR: player.stats?.saves ?? "-", // útil si es portero
    },
    className: "mx-auto", // centrar en la columna izquierda
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            Pachangas
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/matches" className="px-3 py-1 rounded-lg hover:bg-slate-100">
              Partidos
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          {/* Left: cromo unificado */}
          <div className="flex items-start justify-center">
            <SorareCard {...cardProps} />
          </div>

          {/* Right: stats & history */}
          <div className="space-y-6">
            <section className="grid sm:grid-cols-3 gap-3">
              {player.position === "PORTERO" ? (
                <>
                  <StatBadge label="Paradas" value={player.stats?.saves ?? "-"} />
                  <StatBadge
                    label="Porterías a cero"
                    value={player.stats?.cleanSheets ?? "-"}
                  />
                  <StatBadge label="Asistencias" value={player.stats?.assists ?? "-"} />
                </>
              ) : (
                <>
                  <StatBadge label="Goles" value={player.stats?.goals ?? "-"} />
                  <StatBadge label="Asistencias" value={player.stats?.assists ?? "-"} />
                  <StatBadge label="Puntos totales" value={player.totalPoints ?? "-"} />
                </>
              )}
            </section>

            <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <h2 className="text-lg font-semibold">Forma reciente</h2>
              <div className="mt-3 flex gap-2">
                {(player.recentForm || []).map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 h-10 rounded-lg bg-slate-100 ring-1 ring-slate-200 grid place-items-center text-sm font-medium"
                  >
                    {v}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <h2 className="text-lg font-semibold">Histórico de partidos</h2>
              <div className="mt-3 divide-y">
                {history.map((h) => (
                  <Link
                    key={h.matchId}
                    to={`/matches/${h.matchId}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-50 rounded-lg px-2 -mx-2"
                  >
                    <div>
                      <div className="font-medium">
                        {h.date} · {h.team} vs {h.opponent}
                      </div>
                      <div className="text-sm text-slate-500">
                        Rating {h.rating ?? "-"} · {h.result}
                      </div>
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