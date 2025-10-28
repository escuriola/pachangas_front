import React from "react";
import { Link } from "react-router-dom";
import { matches } from "../data/dummy";

function parseScore(score) {
  // score esperado "2-1" o "—"
  const parts = String(score || "").split("-");
  const h = Number(parts[0]);
  const a = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(a)) return { h: null, a: null };
  return { h, a };
}

export default function MatchesListPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-wide">
            Pachangas
          </Link>
          <nav className="hidden items-center gap-3 text-sm md:flex">
            <Link to="/matches" className="rounded-lg px-3 py-1 hover:bg-white/5">
              Partidos
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-2">
          <h1 className="text-2xl font-semibold">Partidos</h1>
          <p className="mt-1 text-sm text-white/70">
            Historial de encuentros y acceso rápido al detalle del partido.
          </p>
        </div>
      </div>

      {/* Grid de partidos */}
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => {
            const { h, a } = parseScore(m.score);
            // color del resultado (si hay marcador)
            let resultTint = "from-slate-700/30 to-slate-800/30 ring-white/10";
            if (h != null && a != null) {
              if (h > a) resultTint = "from-emerald-500/15 to-emerald-400/10 ring-emerald-400/25";
              else if (h < a) resultTint = "from-rose-500/15 to-rose-400/10 ring-rose-400/25";
              else resultTint = "from-amber-500/15 to-amber-400/10 ring-amber-400/25";
            }
            return (
              <Link
                key={m.id}
                to={`/matches/${m.id}`}
                className={[
                  "group relative rounded-2xl ring-1 p-4 transition-all",
                  "bg-gradient-to-br", resultTint,
                  "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                ].join(" ")}
              >
                {/* brillo sutil */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(40%_60%_at_20%_0%,rgba(255,255,255,0.12),transparent_60%)]" />
                <div className="relative z-10">
                  {/* Fecha */}
                  <div className="text-xs text-white/70">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 ring-1 ring-white/10">
                      {m.date}
                    </span>
                  </div>

                  {/* Equipos + Resultado */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Escudo home */}
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                        <span className="text-xs">🏟️</span>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{m.teams.home}</div>
                        <div className="truncate text-xs text-white/60">Local</div>
                      </div>
                    </div>

                    <div className="select-none rounded-lg bg-white/5 px-3 py-1.5 text-center text-base font-bold ring-1 ring-white/10">
                      {m.score || "—"}
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      {/* Escudo away */}
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                        <span className="text-xs">🧳</span>
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="truncate text-sm font-medium">{m.teams.away}</div>
                        <div className="truncate text-xs text-white/60">Visitante</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      {h != null && a != null ? "Finalizado" : "Programado"}
                    </div>
                    <div className="text-sm text-white/80">
                      Ver detalle <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}