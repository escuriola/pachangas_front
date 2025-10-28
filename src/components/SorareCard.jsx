import React from "react";
import clsx from "clsx";

/**
 * Cromo 3D estilo Sorare/FIFA:
 * - Marco por rareza (sin texto de rareza en la UI)
 * - Foto grande del jugador
 * - Top-left: rating grande (value) + posición abreviada (PT/CP)
 * - Banda central: stats estilo FIFA (RIT,TIR,PAS,REG,DEF,FIS)
 * - Pie: nombre + supply y badge verde con PUNTOS (totalPoints)
 */
export default function SorareCard({
                                     rarity = "gold",                  // gold | silver | bronze (solo para el marco)
                                     photo = "/players/sample.jpg",    // si falla carga sample.jpg
                                     topLeftBadge = "Pachangas",
                                     nationality = "🏳️",
                                     position = "-",
                                     age = "-",
                                     name = "PLAYER",
                                     value = 80,                       // rating grande arriba
                                     totalPoints = 100,                // badge verde "xxx pts"
                                     supply = 1,
                                     supplyTotal = 1000,
                                     fifa = { RIT: 70, TIR: 70, PAS: 70, REG: 70, DEF: 70, FIS: 70 },
                                     className,
                                   }) {
  const posAbbr = position === "PORTERO" ? "PT" : "CP";

  return (
    <div className={clsx("group perspective-1200", className)}>
      <div
        className={clsx(
          "relative h-[520px] w-80 transition-transform duration-500",
          "preserve-3d group-hover:rotate-y-6 group-hover:-rotate-x-3"
        )}
      >
        {/* Marco con brillo */}
        <div
          className={clsx(
            "absolute inset-0 rounded-[28px] ring-1 ring-black/10",
            "shadow-[0_20px_60px_rgba(0,0,0,.5)] bg-[length:200%_200%] animate-shimmer",
            {
              "bg-gold-frame": rarity === "gold",
              "bg-silver-frame": rarity === "silver",
              "bg-bronze-frame": rarity === "bronze",
            }
          )}
        />

        {/* Cuerpo de la carta */}
        <div className="absolute inset-[8px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900">
          {/* Relleno por rareza */}
          <div
            className={clsx("absolute inset-0", {
              "bg-gold-fill": rarity === "gold",
              "bg-silver-fill": rarity === "silver",
              "bg-bronze-fill": rarity === "bronze",
            })}
          />

          {/* Glint diagonal */}
          <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-150%] group-hover:translate-x-[300%] transition-transform duration-[1200ms]" />

          {/* Cabecera: badge y rating/pos */}
          <div className="relative z-10 p-3 flex items-start justify-between text-white">
            <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-black/25 border border-white/15">
              {topLeftBadge}
            </div>
            <div className="text-right leading-4">
              <div className="text-3xl font-black drop-shadow">{value}</div>
              <div className="text-[10px] font-bold opacity-90">{posAbbr}</div>
            </div>
          </div>

          {/* Foto del jugador */}
          <div className="relative z-10 mt-1 flex items-center justify-center">
            <img
              src={photo}
              onError={(e) => {
                e.currentTarget.src = "/players/sample.jpg";
              }}
              alt={name}
              className="h-60 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] translate-z-8 group-hover:translate-z-10 transition-transform duration-300"
            />
          </div>

          {/* Stats estilo FIFA */}
          <div className="relative z-10 mt-2 mx-3 rounded-xl bg-black/35 backdrop-blur border border-white/10 text-white px-3 py-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 opacity-90">
                <span>{nationality}</span>
                <span>·</span>
                <span>Edad {age}</span>
              </div>
              <div className="flex gap-3 font-bold tracking-wide">
                <span>RIT {fifa.RIT}</span>
                <span>TIR {fifa.TIR}</span>
                <span>PAS {fifa.PAS}</span>
                <span>REG {fifa.REG}</span>
                <span>DEF {fifa.DEF}</span>
                <span>FIS {fifa.FIS}</span>
              </div>
            </div>
          </div>

          {/* Pie: nombre + supply + puntos */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-xl bg-black/45 backdrop-blur-md border border-white/10 px-3 py-2 text-white">
              <div className="text-2xl font-extrabold tracking-wide">{name.toUpperCase()}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="rounded-full bg-black/40 border border-white/10 text-[11px] px-2 py-1">
                  {supply}/{supplyTotal}
                </div>
                <div className="rounded-full bg-emerald-500/90 text-black text-[11px] font-extrabold px-2 py-1">
                  {totalPoints} pts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canto/grosor */}
        <div
          className={clsx(
            "absolute -right-1 top-2 bottom-2 w-2 rounded-r-2xl",
            rarity === "gold"
              ? "bg-gradient-to-b from-yellow-500 to-amber-700"
              : rarity === "silver"
                ? "bg-gradient-to-b from-slate-300 to-slate-500"
                : "bg-gradient-to-b from-amber-700 to-amber-900"
          )}
        />
      </div>
    </div>
  );
}