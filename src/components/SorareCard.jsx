import React from "react";
import clsx from "clsx";

/**
 * Cromo 3D estilo Sorare:
 * - Grosor mediante "edge" y sombras
 * - Rotación/tilt en hover
 * - Brillo (glint) animado
 * - Variantes de rareza: gold | silver | bronze
 */
export default function SorareCard({
                                     rarity = "gold",
                                     photo = "/apple-icon.png",
                                     topLeftBadge = "Pachangas",
                                     nationality = "🏳️",
                                     position = "-",
                                     age = "-",
                                     name = "PLAYER",
                                     supply = 1,
                                     supplyTotal = 1000,
                                     footerBadge = `${supply}/${supplyTotal}`,
                                     className,
                                   }) {
  return (
    <div className={clsx("group perspective-1200", className)}>
      {/* grosor y rotación */}
      <div className={clsx(
        "relative h-[460px] w-80 transition-transform duration-500",
        "preserve-3d group-hover:rotate-y-6 group-hover:-rotate-x-3"
      )}>
        {/* Capa de borde/filo (dorado/plateado/bronce) */}
        <div
          className={clsx(
            "absolute inset-0 rounded-3xl",
            "ring-1 ring-black/10",
            "bg-[length:200%_200%] animate-shimmer",
            {
              "bg-gold-frame": rarity === "gold",
              "bg-silver-frame": rarity === "silver",
              "bg-bronze-frame": rarity === "bronze",
            }
          )}
        />

        {/* Capa de carta (ligeramente dentro para simular marco) */}
        <div className="absolute inset-[6px] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900">
          {/* Fondo con textura/gradiente por rareza */}
          <div className={clsx(
            "absolute inset-0",
            {
              "bg-gold-fill": rarity === "gold",
              "bg-silver-fill": rarity === "silver",
              "bg-bronze-fill": rarity === "bronze",
            }
          )} />

          {/* Halo decorativo */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_15%,white,transparent_40%),radial-gradient(circle_at_70%_85%,white,transparent_40%)]" />

          {/* Glint animado */}
          <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[300%] transition-transform duration-[1200ms]" />

          {/* Cabecera: badge equipo */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className={clsx(
              "px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase",
              "bg-white/10 border border-white/25 text-white/90"
            )}>
              {topLeftBadge}
            </div>
            <div className={clsx(
              "rounded-md px-2 py-1 text-[10px] font-bold border",
              rarity === "gold"   ? "border-yellow-200/40 text-yellow-200/90 bg-yellow-200/10" :
                rarity === "silver" ? "border-slate-200/40 text-slate-200/90 bg-slate-200/10" :
                  "border-amber-800/40 text-amber-200/90 bg-amber-800/10"
            )}>
              {rarity.toUpperCase()}
            </div>
          </div>

          {/* Foto */}
          <div className="relative z-10 mt-2 flex items-center justify-center">
            <img
              src={photo}
              onError={(e)=>{e.currentTarget.src="/apple-icon.png"}}
              alt={name}
              className="h-56 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
            />
          </div>

          {/* Pie con info compacta */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="rounded-xl bg-black/45 backdrop-blur-md border border-white/10 px-3 py-2 text-white">
              <div className="flex items-center gap-2 text-[11px] opacity-90">
                <span className="font-medium">{nationality}</span>
                <span>·</span>
                <span className="font-medium">{position}</span>
                <span>·</span>
                <span>Edad {age}</span>
              </div>

              <div className="mt-1 text-2xl font-extrabold tracking-wide">{name.toUpperCase()}</div>

              <div className="mt-2 flex items-center justify-between">
                <div className="rounded-full bg-black/40 border border-white/10 text-[11px] px-2 py-1">
                  {footerBadge}
                </div>
                <div className="rounded-full bg-emerald-500/90 text-black text-[11px] font-bold px-2 py-1">
                  {/** Puedes sustituir por el rating o bonus */}
                  {/** Por ejemplo 70 +5% como en Sorare: */}
                  {/* <span>70</span><span className="ml-1 bg-black/15 rounded px-1">+5%</span> */}
                  Valor
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Borde/edge para simular grosor */}
        <div className={clsx(
          "absolute -right-1 top-2 bottom-2 w-2 rounded-r-2xl",
          rarity === "gold"   ? "bg-gradient-to-b from-yellow-500 to-amber-700" :
            rarity === "silver" ? "bg-gradient-to-b from-slate-300 to-slate-500" :
              "bg-gradient-to-b from-amber-700 to-amber-900"
        )} />
      </div>
    </div>
  );
}