import React from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { matches } from "../data/dummy";

function parseScore(score) {
  const parts = String(score || "").split("-");
  const h = Number(parts[0]);
  const a = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(a)) return { h: null, a: null };
  return { h, a };
}

function EventRow({ e }) {
  const icon =
    e.type === "goal" ? "⚽️" : e.type === "save" ? "🧤" : e.type === "yellow" ? "🟨" : "•";
  return (
    <li className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-white/5">
      <div className="w-12 shrink-0 text-right text-xs font-medium text-white/60">{e.minute}'</div>
      <div className="mt-[2px] text-lg">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium">
          {e.type === "goal" ? "Gol" : e.type === "save" ? "Parada" : e.type}
        </div>
        <div className="text-sm text-white/70">
          {e.team} — {e.player}
          {e.assist ? ` (asist. ${e.assist})` : ""}
          {e.detail ? ` — ${e.detail}` : ""}
        </div>
      </div>
    </li>
  );
}

export default function MatchDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const match = matches.find((m) => String(m.id) === String(id)) || matches[0];
  const { h, a } = parseScore(match.score);

  let headerTint = "from-slate-800/60 to-slate-900/60 ring-white/10";
  if (h != null && a != null) {
    if (h > a) headerTint = "from-emerald-600/25 to-emerald-700/20 ring-emerald-400/30";
    else if (h < a) headerTint = "from-rose-600/25 to-rose-700/20 ring-rose-400/30";
    else headerTint = "from-amber-600/25 to-amber-700/20 ring-amber-400/30";
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback: vuelve a donde te dijeron en state.from, o a /matches si entraste directo
      const fallback = (location.state && location.state.from) || "/matches";
      navigate(fallback, { replace: true });
    }
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
            <Link to="/matches" state={{ from: location.pathname }} className="rounded-lg px-3 py-1 hover:bg-white/5">
              Todos los partidos
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Encabezado del partido */}
        <section
          className={[
            "relative overflow-hidden rounded-2xl ring-1 p-5",
            "bg-gradient-to-br", headerTint,
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_10%_0%,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="relative z-10">
            <div className="text-xs text-white/75">
              <span className="rounded-md bg-white/10 px-2 py-0.5 ring-1 ring-white/15">{match.date}</span>
            </div>

            <div className="mt-3 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
              {/* Home */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <span className="text-sm">🏟️</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">{match.teams.home}</div>
                  <div className="truncate text-xs text-white/70">Local</div>
                </div>
              </div>

              {/* Score */}
              <div className="select-none rounded-xl bg-white/5 px-4 py-2 text-center text-2xl font-extrabold ring-1 ring-white/10">
                {match.score || "—"}
              </div>

              {/* Away */}
              <div className="flex min-w-0 items-center justify-end gap-3">
                <div className="min-w-0 text-right">
                  <div className="truncate text-base font-semibold">{match.teams.away}</div>
                  <div className="truncate text-xs text-white/70">Visitante</div>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <span className="text-sm">🧳</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eventos y alineaciones */}
        <section className="grid gap-4 md:grid-cols-2">
          {/* Timeline de eventos */}
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Eventos</h2>
            <ul className="mt-3 space-y-1">
              {match.events?.length ? (
                match.events.map((e, i) => <EventRow key={i} e={e} />)
              ) : (
                <li className="rounded-xl bg-white/5 p-3 text-sm text-white/70">
                  No hay eventos registrados.
                </li>
              )}
            </ul>
          </div>

          {/* Alineaciones */}
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold">Alineaciones</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.entries(match.lineups || {}).map(([team, players]) => (
                <div key={team} className="rounded-xl bg-slate-900/40 p-3 ring-1 ring-white/10">
                  <div className="text-sm font-medium text-white/90">{team}</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                    {(players || []).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Crónica */}
        <section className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold">Crónica</h2>
          <p className="mt-2 whitespace-pre-line text-white/85">{match.report}</p>
        </section>

        {/* CTA volver: regresa al origen real */}
        <div className="pt-2">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
          >
            ← Volver
          </button>
        </div>
      </main>
    </div>
  );
}