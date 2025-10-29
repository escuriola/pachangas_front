import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AppHeader() {
  const location = useLocation();
  const isActive = (to) =>
    location.pathname === to ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/90";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-wide text-white">
          Pachangas
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          <Link to="/matches" className={`rounded-lg px-3 py-1 ${isActive("/matches")}`}>
            Partidos
          </Link>
          <Link to="/leaderboard" className={`rounded-lg px-3 py-1 ${isActive("/leaderboard")}`}>
            Estadísticas
          </Link>
        </nav>
      </div>
    </header>
  );
}