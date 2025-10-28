import React from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";   // nombre (elegante, compacta)
import "@fontsource/inter/400.css";            // texto secundario limpio
import "@fontsource/inter/700.css";

/**
 * Cromo v3.1
 * - Fondo negro para el cuerpo (stats sin sombreado)
 * - Nombre con League Spartan
 * - Valor (supply) debajo del nombre
 * - Nacionalidad + stats en columnas bajo la foto
 * - Puntos (PTS) arriba-derecha
 * - Posición (CAMPO/PORTERO) abajo-dcha con etiqueta mejorada
 */
export default function SorareCard({
                                     rarity = "gold",                  // gold | silver | bronze
                                     photo = "/players/sample.png",    // PNG con transparencia recomendado
                                     name = "PLAYER",
                                     nationality = "🇪🇸",
                                     position = "CAMPO",               // "CAMPO" | "PORTERO"
                                     age = "-",
                                     totalPoints = 100,                // PTS (arriba-dcha)
                                     // Supply/valor mostrado bajo el nombre:
                                     supply = 609,
                                     supplyTotal = 1000,
                                     // Stats (valores 0–100 aprox; edad número natural)
                                     fifa = { PAS: 80, TIR: 80, REG: 80, FIS: 80, PAR: 80 },
                                     className,
                                   }) {
  const isGK = position === "PORTERO";

  const statCols = isGK
    ? [
      { key: "EDAD", val: age },
      { key: "PAS",  val: fifa.PAS ?? "-" },
      { key: "PAR",  val: fifa.PAR ?? "-" },
      { key: "FIS",  val: fifa.FIS ?? "-" },
    ]
    : [
      { key: "EDAD", val: age },
      { key: "PAS",  val: fifa.PAS ?? "-" },
      { key: "TIR",  val: fifa.TIR ?? "-" },
      { key: "REG",  val: fifa.REG ?? "-" },
      { key: "FIS",  val: fifa.FIS ?? "-" },
    ];

  return (
    <div className={clsx("group", className)}>
      <div
        className={clsx(
          "relative h-[520px] w-80 transition-transform duration-500",
          "preserve-3d group-hover:rotate-y-6 group-hover:-rotate-x-3"
        )}
      >
        {/* Marco brillante por rareza */}
        <div
          className={clsx(
            "absolute inset-0 rounded-[28px] ring-1 ring-black/10",
            "shadow-[0_24px_70px_rgba(0,0,0,.55)] bg-[length:200%_200%] animate-shimmer",
            {
              "bg-gold-frame": rarity === "gold",
              "bg-silver-frame": rarity === "silver",
              "bg-bronze-frame": rarity === "bronze",
            }
          )}
        />

        {/* Cuerpo negro del cromo */}
        <div className="absolute inset-[8px] rounded-3xl overflow-hidden shadow-2xl bg-black">
          {/* Cabecera */}
          <div className="relative z-10 px-3 pt-3 pb-1 text-white flex items-start justify-between">
            <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-white/10 border border-white/15">
              Pachangas
            </div>

            {/* Puntos (PTS) */}
            <div className="text-right leading-4">
              <div className="text-2xl font-extrabold">{totalPoints}</div>
              <div className="text-[10px] font-bold opacity-85">PTS</div>
            </div>
          </div>

          {/* Foto PNG centrada */}
          <div className="relative z-10 mt-1 flex items-center justify-center">
            <img
              src={photo}
              onError={(e) => { e.currentTarget.src = "/players/sample.png"; }}
              alt={name}
              className="h-64 object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.45)]"
              style={{ transform: "translateZ(8px)" }}
            />
          </div>

          {/* Estadísticas (sin fondo/sombra, sobre negro) */}
          <div className="relative z-10 mt-3 mx-3 text-white">
            <div className="flex items-stretch justify-center gap-3 text-center font-[Inter]">
              {/* Nacionalidad */}
              <div className="flex flex-col items-center justify-end min-w-[40px] px-1">
                <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">NAC</div>
                <div className="text-base leading-none">{nationality}</div>
              </div>

              {/* Separador */}
              <div className="w-px bg-white/15" />

              {/* Columnas de stats */}
              {statCols.map((s, idx) => (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center justify-end min-w-[48px] px-1">
                    <div className="text-[10px] uppercase tracking-wide opacity-80 mb-1">{s.key}</div>
                    <div className="text-[13px] font-semibold leading-none">{s.val}</div>
                  </div>
                  {idx !== statCols.length - 1 && <div className="w-px bg-white/15" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Pie: nombre + valor (supply) + etiqueta posición */}
          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <div
                  className="leading-7 tracking-wide"
                  style={{
                    fontFamily: '"League Spartan", system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: "28px",
                  }}
                >
                  {name.toUpperCase()}
                </div>
                <div className="text-[11px] opacity-85 mt-0.5">
                  {supply}/{supplyTotal}
                </div>
              </div>

              {/* Posición abajo-dcha */}
              <div className="ml-3">
                <span
                  className={clsx(
                    "inline-flex items-center rounded-md px-2 py-1 text-[11px] font-bold",
                    rarity === "gold"   ? "bg-amber-500/20 border border-amber-400/40" :
                      rarity === "silver" ? "bg-slate-300/15 border border-slate-200/40" :
                        "bg-amber-800/25 border border-amber-700/40"
                  )}
                  style={{ fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}
                >
                  {isGK ? "PORTERO" : "CAMPO"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CANTO 3D mejorado */}
        <div className="absolute -right-1 top-2 bottom-2 w-2 rounded-r-2xl overflow-hidden">
          <div className={clsx(
            "absolute inset-0",
            rarity === "gold"   ? "bg-gradient-to-b from-amber-500 to-amber-800" :
              rarity === "silver" ? "bg-gradient-to-b from-slate-300 to-slate-600" :
                "bg-gradient-to-b from-amber-700 to-amber-900"
          )} />
          <div className="absolute inset-y-0 left-0 w-[3px] bg-black/30" />
          <div className="absolute inset-y-0 right-0 w-[2px] bg-white/35 mix-blend-screen" />
        </div>

        {/* Sombra inferior */}
        <div className="absolute -bottom-3 left-6 right-6 h-6 rounded-full bg-black/40 blur-lg opacity-40" />
      </div>
    </div>
  );
}