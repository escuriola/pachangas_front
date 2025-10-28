import React from "react";
import clsx from "clsx";

/**
 * Cromo 3D estilo Sorare/FIFA (v2):
 * - Foto PNG transparente para integrarse con el fondo
 * - Canto con bisel + sombra (mejor 3D)
 * - Arriba derecha: PUNTOS (totalPoints) + “PTS”
 * - Banda de stats:
 *   * Campo: ED, PAS, TIR, REG, FIS
 *   * Portero: ED, PAS, PAR, FIS
 * - Sin badge verde ni texto de rareza en la UI (solo marco visual)
 */
export default function SorareCard({
                                     rarity = "gold",                  // gold | silver | bronze (solo afecta al marco)
                                     photo = "/players/sample.png",    // PNG con transparencia
                                     topLeftBadge = "Pachangas",
                                     nationality = "🏳️",
                                     position = "-",                   // "PORTERO" | "CAMPO"
                                     age = "-",
                                     name = "PLAYER",
                                     value = 80,                       // rating general (se mantiene arriba-izq pequeño)
                                     totalPoints = 100,                // ahora va arriba-dcha como “PTS”
                                     supply = 1,
                                     supplyTotal = 1000,
                                     // Para CAMPO: PAS, TIR, REG, FIS | Para PT: PAS, PAR, FIS (REG/TIR se ignoran)
                                     fifa = { PAS: 75, TIR: 70, REG: 72, FIS: 74, PAR: 60 },
                                     className,
                                   }) {
  const isGK = position === "PORTERO";
  const posAbbr = isGK ? "PT" : "CP";

  // Stats mostradas con abreviaturas solicitadas
  const stats = isGK
    ? [
      { k: "ED", v: age },
      { k: "PAS", v: fifa.PAS ?? "-" },
      { k: "PAR", v: fifa.PAR ?? "-" },
      { k: "FIS", v: fifa.FIS ?? "-" },
    ]
    : [
      { k: "ED", v: age },
      { k: "PAS", v: fifa.PAS ?? "-" },
      { k: "TIR", v: fifa.TIR ?? "-" },
      { k: "REG", v: fifa.REG ?? "-" },
      { k: "FIS", v: fifa.FIS ?? "-" },
    ];

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
            "shadow-[0_24px_70px_rgba(0,0,0,.55)] bg-[length:200%_200%] animate-shimmer",
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
            className={clsx("absolute inset-0",
              {
                "bg-gold-fill": rarity === "gold",
                "bg-silver-fill": rarity === "silver",
                "bg-bronze-fill": rarity === "bronze",
              })}
          />

          {/* Glint diagonal */}
          <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/18 to-transparent translate-x-[-150%] group-hover:translate-x-[300%] transition-transform duration-[1200ms]" />

          {/* Cabecera */}
          <div className="relative z-10 px-3 pt-3 pb-1 text-white flex items-start justify-between">
            {/* Escudo/badge de liga */}
            <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-black/25 border border-white/15">
              {topLeftBadge}
            </div>

            {/* Rating y posición (compacto arriba-izq) */}
            <div className="text-right leading-4">
              <div className="text-sm font-extrabold opacity-90">{value}</div>
              <div className="text-[10px] font-bold opacity-85">{posAbbr}</div>
            </div>
          </div>

          {/* Foto PNG integrada (transparente) */}
          <div className="relative z-10 mt-0.5 flex items-center justify-center">
            <img
              src={photo}
              onError={(e) => { e.currentTarget.src = "/players/sample.png"; }}
              alt={name}
              className="h-64 object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.45)] translate-z-8 group-hover:translate-z-10 transition-transform duration-300"
            />
          </div>

          {/* Barra superior derecha con PUNTOS */}
          <div className="absolute right-3 top-3 z-20 text-white text-right">
            <div className="leading-3 rounded-md bg-black/35 border border-white/15 px-2 py-1 backdrop-blur">
              <div className="text-xl font-black tracking-tight">{totalPoints}</div>
              <div className="text-[10px] font-bold opacity-90">PTS</div>
            </div>
          </div>

          {/* Banda de stats reducidas (abreviadas) */}
          <div className="relative z-10 mt-3 mx-3 rounded-xl bg-black/35 backdrop-blur border border-white/10 text-white px-3 py-2">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wide">
              <div className="flex items-center gap-2 opacity-90">
                <span>{nationality}</span>
              </div>
              <div className="flex gap-3">
                {stats.map(({ k, v }) => (
                  <span key={k}>
                    {k} {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pie: nombre + supply (sin badge de puntos) */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-xl bg-black/45 backdrop-blur-md border border-white/10 px-3 py-2 text-white">
              <div className="text-2xl font-extrabold tracking-wide">{name.toUpperCase()}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="rounded-full bg-black/40 border border-white/10 text-[11px] px-2 py-1">
                  {supply}/{supplyTotal}
                </div>
                {/* hueco limpio a la derecha */}
                <div className="w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* CANTO 3D: base + bisel + brillo lateral */}
        <div className="absolute -right-1 top-2 bottom-2 w-2 rounded-r-2xl overflow-hidden">
          {/* capa base */}
          <div className={clsx(
            "absolute inset-0",
            rarity === "gold"   ? "bg-gradient-to-b from-amber-500 to-amber-800" :
              rarity === "silver" ? "bg-gradient-to-b from-slate-300 to-slate-600" :
                "bg-gradient-to-b from-amber-700 to-amber-900"
          )} />
          {/* bisel oscuro interno */}
          <div className="absolute inset-y-0 left-0 w-[3px] bg-black/25" />
          {/* highlight fino en el borde */}
          <div className="absolute inset-y-0 right-0 w-[2px] bg-white/35 mix-blend-screen" />
        </div>

        {/* sombra de apoyo bajo la carta */}
        <div className="absolute -bottom-3 left-6 right-6 h-6 rounded-full bg-black/40 blur-lg opacity-40" />
      </div>
    </div>
  );
}