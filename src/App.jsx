import React from 'react'

function SorareCard() {
  return (
    <div className="relative w-80 h-[460px] rounded-3xl shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 text-white overflow-hidden ring-1 ring-black/10">
      {/* Halo decorativo */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]" />
      {/* Marco */}
      <div className="absolute inset-3 rounded-2xl bg-white/5 backdrop-blur-[1px] ring-1 ring-white/20" />
      
      {/* Header: rare badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-semibold tracking-wide">
        <span className="px-2 py-0.5 rounded-full bg-white/15 ring-1 ring-white/30">RARE</span>
        <span className="px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-white/20">2025</span>
      </div>

      {/* Avatar circle */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full ring-4 ring-white/20 overflow-hidden shadow-lg">
        <div className="w-full h-full grid place-items-center text-6xl bg-white/10">🧤</div>
      </div>

      {/* Nombre */}
      <div className="absolute top-56 w-full text-center px-4">
        <h2 className="text-2xl font-extrabold leading-tight drop-shadow">Carlos Escuriola</h2>
        <p className="uppercase tracking-[0.2em] text-white/80 text-xs mt-1">Portero • GK</p>
      </div>

      {/* Valor */}
      <div className="absolute bottom-28 w-full flex items-center justify-center gap-2">
        <span className="text-5xl font-black drop-shadow">999</span>
        <span className="text-sm mt-3 opacity-80">valor</span>
      </div>

      {/* Footer strip */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-black/25 backdrop-blur-sm border-t border-white/10">
        <div className="h-full px-5 flex items-center justify-between text-sm">
          <div className="flex flex-col leading-tight">
            <span className="opacity-80">Pachangas</span>
            <span className="font-semibold">Serie Única</span>
          </div>
          <div className="text-right leading-tight">
            <span className="opacity-80">Posición</span>
            <div className="text-lg font-bold tracking-wide">GK</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App () {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="font-extrabold tracking-tight text-slate-800">Pachangas</div>
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li><a className="text-slate-600 hover:text-slate-900" href="#stats">Estadísticas</a></li>
            <li><a className="text-slate-600 hover:text-slate-900" href="#history">Histórico partidos</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Cromo destacado</h1>
        <p className="text-slate-600 mt-1">Estilo Sorare, una sola página mínima.</p>
      </header>

      {/* Card centered */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid place-items-center">
          <SorareCard />
        </div>

        {/* Anchors for menu (placeholders) */}
        <section id="stats" className="mt-16 max-w-2xl mx-auto text-slate-700">
          <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
          <p>Próximamente: resumen de paradas, porterías a cero, rating medio, etc.</p>
        </section>

        <section id="history" className="mt-10 max-w-2xl mx-auto text-slate-700">
          <h2 className="text-xl font-semibold mb-2">Histórico de partidos</h2>
          <p>Próximamente: lista de partidos con fecha, rival y resultado.</p>
        </section>
      </main>
    </div>
  )
}
