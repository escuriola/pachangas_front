
import React from "react";
import { Link } from "react-router-dom";

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="block">
      <div className="relative w-72 h-[420px] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 ring-1 ring-black/10 transition-transform hover:-translate-y-1">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]" />
        <div className="absolute inset-3 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/30" />
        <div className="relative z-10 h-full flex flex-col p-4 text-white">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-white/15 ring-1 ring-white/30">{player.position}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-white/20">{player.team}</span>
          </div>
          <div className="mt-6 flex-1 flex items-center justify-center">
            <img src={player.image} alt={player.name} className="w-40 h-40 object-contain drop-shadow-md" />
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-bold leading-6">{player.name}</h3>
            <p className="text-sm/6 text-white/85">{player.nationality} · {player.age} años</p>
          </div>
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
    </Link>
  );
}
