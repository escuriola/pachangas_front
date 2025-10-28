import React from "react";
import { useParams, Link } from "react-router-dom";
import { matches } from "../data/dummy";

export default function MatchDetailPage() {
  const { id } = useParams();
  const match = matches.find((m) => m.id === id) || matches[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Pachangas</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/matches" className="px-3 py-1 rounded-lg hover:bg-slate-100">Todos los partidos</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
          <div className="text-sm text-slate-500">{match.date}</div>
          <h1 className="mt-1 text-2xl font-semibold">{match.teams.home} <span className="text-slate-500">{match.score}</span> {match.teams.away}</h1>
        </div>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
            <h2 className="text-lg font-semibold">Eventos</h2>
            <ul className="mt-3 space-y-2">
              {match.events.map((e, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-10 text-sm font-medium text-slate-500">{e.minute}'</div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {e.type === "goal" ? "⚽️ Gol" : e.type === "save" ? "🧤 Parada" : e.type}
                    </div>
                    <div className="text-sm text-slate-600">{e.team} — {e.player}{e.assist ? ` (asist. ${e.assist})` : ""}{e.detail ? ` — ${e.detail}` : ""}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
            <h2 className="text-lg font-semibold">Alineaciones</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {Object.entries(match.lineups).map(([team, players]) => (
                <div key={team} className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <div className="text-sm font-medium text-slate-700">{team}</div>
                  <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                    {players.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
          <h2 className="text-lg font-semibold">Crónica</h2>
          <p className="mt-2 text-slate-700">{match.report}</p>
        </section>
      </main>
    </div>
  );
}