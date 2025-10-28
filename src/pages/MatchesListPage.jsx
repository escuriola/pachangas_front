
import React from "react";
import { Link } from "react-router-dom";
import { matches } from "../data/dummy";

export default function MatchesListPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Pachangas</Link>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">Partidos</h1>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m) => (
            <Link key={m.id} to={`/matches/${m.id}`} className="rounded-2xl bg-white ring-1 ring-black/5 p-4 hover:shadow-sm">
              <div className="text-sm text-slate-500">{m.date}</div>
              <div className="mt-1 text-lg font-semibold">{m.home} <span className="text-slate-500">{m.score}</span> {m.away}</div>
              <div className="mt-2 text-sm text-slate-500">Ver detalle →</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
