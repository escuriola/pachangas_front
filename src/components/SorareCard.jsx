import React from "react";
import clsx from "clsx";
import "@fontsource/bebas-neue"; // Tipografía heroica

/**
 * Cromo 3D v3 — realismo, blur, barras de stats, foto integrada
 */
export default function SorareCard({
                                     rarity = "gold",
                                     photo = "/players/sample.png",
                                     name = "PLAYER",
                                     nationality = "🏳️",
                                     position = "CAMPO",
                                     age = "-",
                                     totalPoints = 100,
                                     fifa = { PAS: 80, TIR: 80, REG: 80, FIS: 80, PAR: 80 },
                                     className,
                                   }) {
  const isGK = position === "PORTERO";
  const stats = isGK
    ? [
      { label: "ED", val: age },
      { label: "PAS", val: fifa.PAS },
      { label: "PAR", val: fifa.PAR },
      { label: "FIS", val: fifa.FIS },
    ]
    : [
      { label: "ED", val: age },
      { label: "PAS", val: fifa.PAS },
      { label: "TIR", val: fifa.TIR },
      { label: "REG", val: fifa.REG },
      { label: "FIS", val: fifa.FIS },
    ];

  return (
    <div
      className={clsx(
        "relative w-80 h-[520px] rounded-[26px] overflow-hidden cursor-pointer transform-gpu transition-all duration-700",
        "hover:rotate-y-6 hover:-rotate-x-3",
        "shadow-[0_40px_90px_rgba(0,0,0,.6)]",
        className
      )}
      style={{
        perspective: "1200px",
        background:
          rarity === "gold"
            ? "linear-gradient(145deg, #eab308 0%, #fef08a 60%, #92400e 100%)"
            : rarity === "silver"
              ? "linear-gradient(145deg, #9ca3af 0%, #f3f4f6 60%, #475569 100%)"
              : "linear-gradient(145deg, #92400e 0%, #f59e0b 60%, #431407 100%)",
      }}
    >
      {/* fondo difuminado con blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-30"
        style={{ backgroundImage: `url(${photo})` }}
      />

      {/* reflejo animado diagonal */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-[2000ms]" />

      {/* encabezado */}
      <div className="relative z-10 flex justify-between items-start px-4 pt-3 text-white">
        <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-black/25 border border-white/15">
          Pachangas
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold leading-5 drop-shadow">
            {totalPoints}
          </div>
          <div className="text-[11px] font-bold opacity-90">PTS</div>
        </div>
      </div>

      {/* imagen del jugador */}
      <div className="relative z-10 flex justify-center items-end h-[340px] mt-[-10px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <img
          src={photo}
          onError={(e) => (e.currentTarget.src = "/players/sample.png")}
          alt={name}
          className="relative max-h-[360px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
          style={{
            width: "auto",
            height: "100%",
            objectFit: "contain",
            transform: "translateZ(30px)",
          }}
        />
      </div>

      {/* stats */}
      <div className="relative z-20 px-4 pb-2 mt-1">
        <div className="flex justify-between text-white text-[12px] font-bold mb-1">
          {stats.map((s) => (
            <span key={s.label}>
              {s.label}: {s.val}
            </span>
          ))}
        </div>
        {/* barras */}
        <div className="flex justify-between gap-1">
          {stats.map((s) => (
            <div
              key={s.label}
              className={clsx(
                "h-1.5 rounded-full flex-1 transition-all duration-500",
                rarity === "gold"
                  ? "bg-gradient-to-r from-yellow-300 to-amber-500"
                  : rarity === "silver"
                    ? "bg-gradient-to-r from-gray-200 to-gray-500"
                    : "bg-gradient-to-r from-amber-700 to-amber-900"
              )}
              style={{ width: `${Math.min((s.val / 100) * 100, 100)}%` }}
            />
          ))}
        </div>
      </div>

      {/* pie con nombre y posición */}
      <div className="absolute bottom-0 w-full px-4 py-3 bg-black/50 backdrop-blur text-white">
        <div
          className="text-center text-3xl font-black tracking-wider leading-7"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            letterSpacing: "0.05em",
          }}
        >
          {name.toUpperCase()}
        </div>
        <div className="text-right text-[11px] font-bold opacity-90 mt-1 pr-1">
          {isGK ? "PORTERO" : "CAMPO"}
        </div>
      </div>

      {/* canto 3D mejorado */}
      <div
        className="absolute right-0 top-2 bottom-2 w-[6px] rounded-r-2xl shadow-inner"
        style={{
          background:
            rarity === "gold"
              ? "linear-gradient(to bottom, #fde047, #b45309)"
              : rarity === "silver"
                ? "linear-gradient(to bottom, #e5e7eb, #64748b)"
                : "linear-gradient(to bottom, #b45309, #78350f)",
        }}
      />
    </div>
  );
}