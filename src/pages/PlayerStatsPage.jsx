import React from "react";
import { useParams, Link } from "react-router-dom";
import { players, playerHistories } from "../data/dummy";
import SorareCard from "../components/SorareCard";

function StatBadge({ label, value, hint }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/10 transition">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-white/50">{hint}</div>}
    </div>
  );
}

export default function PlayerStatsPage() {
  const { id } = useParams();
  const player = players.find((p) => String(p.id) === String(id)) || players[0];
  const history = playerHistories[player.id] || [];

  const rarity =
    player.rarity ||
    (player.value >= 800 ? "gold" : player.value >= 400 ? "silver" : "bronze");

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
      PAS: player.stats?.passesCompleted ?? player.stats?.pass ?? "-",
      TIR: player.stats?.shots ?? "-",
      REG: player.stats?.dribbles ?? "-",
      FIS: player.stats?.physical ?? "-",
      PAR: player.stats?.saves ?? "-",
    },
    className: "mx-auto",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-wide">
            Pachangas
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/matches"
              className="rounded-lg px-3 py-1 hover:bg-white/5 transition"
            >
              Partidos
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="grid md:grid-cols-[340px_1fr] gap-8 items-start">
          {/* Cromo */}
          <div className="flex justify-center">
            <SorareCard {...cardProps} />
          </div>

          {/* Estadísticas y datos */}
          <div className="space-y-6">
            {/* Stats rápidas */}
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

            {/* Forma reciente */}
            <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <h2 className="text-lg font-semibold text-white">Forma reciente</h2>
              <div className="mt-3 flex gap-2">
                {(player.recentForm || []).length > 0 ? (
                  player.recentForm.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 h-10 rounded-lg bg-white/10 ring-1 ring-white/10 grid place-items-center text-sm font-medium text-white"
                    >
                      {v}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-white/60">Sin registros recientes.</div>
                )}
              </div>
            </section>

            {/* Histórico de partidos */}
            <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <h2 className="text-lg font-semibold text-white">Histórico de partidos</h2>
              <div className="mt-3 divide-y divide-white/10">
                {history.length > 0 ? (
                  history.map((h) => (
                    <Link
                      key={h.matchId}
                      to={`/matches/${h.matchId}`}
                      className="flex items-center justify-between py-3 hover:bg-white/5 rounded-lg px-2 -mx-2 transition"
                    >
                      <div>
                        <div className="font-medium text-white">
                          {h.date} · {h.team} vs {h.opponent}
                        </div>
                        <div className="text-sm text-white/60">
                          Rating {h.rating ?? "-"} · {h.result}
                        </div>
                      </div>
                      <div className="text-sm text-white/70">Ver crónica →</div>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-white/60">
                    No hay partidos registrados.
                  </div>
                )}
              </div>
            </section>

            {/* CTA volver */}
            <div>
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 transition"
              >
                ← Volver a partidos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}