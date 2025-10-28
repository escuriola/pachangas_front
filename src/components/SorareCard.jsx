import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/londrina-shadow/400.css"; // <-- Fuente SOLO para el nombre

/**
 * Cromo v4 — tilt + luz, notch esquina, borde por rareza
 * Ajustes:
 * - Aumenta el espacio de la foto (imagen más grande)
 * - Sección de estadísticas desciende más
 * - Nombre más grande y con mejor legibilidad sobre fondo oscuro
 * - Se desactiva la “profundidad” lateral
 */
export default function SorareCard({
                                     rarity = "gold",                  // gold | silver | bronze
                                     photo = "/players/sample.png",
                                     name = "PLAYER",
                                     nationality = "🇪🇸",
                                     position = "CAMPO",               // "CAMPO" | "PORTERO"
                                     age = "-",
                                     totalPoints = 100,                // PTS (arriba-dcha)
                                     supply = 609,
                                     supplyTotal = 1000,
                                     fifa = { PAS: 80, TIR: 80, REG: 80, FIS: 80, PAR: 80 },
                                     className,
                                   }) {
  const isGK = position === "PORTERO";
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lx: 50, ly: 50 });

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

  function onMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ry = ((mx - cx) / cx) * 10; // rot Y
    const rx = -((my - cy) / cy) * 8; // rot X
    const lx = (mx / rect.width) * 100;  // luz %
    const ly = (my / rect.height) * 100; // luz %
    setTilt({ rx, ry, lx, ly });
  }
  function onLeave() { setTilt({ rx: 0, ry: 0, lx: 50, ly: 50 }); }

  return (
    <div
      className={clsx("card3d-wrapper", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Contenedor con perspectiva y rotación */}
      <div
        ref={cardRef}
        className={clsx("card3d-root", {
          "rarity-gold": rarity === "gold",
          "rarity-silver": rarity === "silver",
          "rarity-bronze": rarity === "bronze",
        })}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          // posición de la “luz” (spot) que barre la cara frontal:
          '--lx': `${tilt.lx}%`,
          '--ly': `${tilt.ly}%`,
        }}
      >
        {/* Cara frontal con notch y borde perimetral */}
        <div className="card3d-face">
          {/* Glint/luz que sigue al cursor */}
          <div className="card3d-glint" />

          {/* Cabecera */}
          <div className="face-header">
            <div className="chip">Pachangas</div>
            <div className="pts">
              <div className="pts-num">{totalPoints}</div>
              <div className="pts-lab">PTS</div>
            </div>
          </div>

          {/* Foto centrada: más grande y con más aire inferior para empujar stats */}
          <div
            className="face-photo"
            style={{
              marginTop: "4px",
              marginBottom: "18px",    // ↑ empuja las estadísticas hacia abajo
              minHeight: "220px",      // ↑ reserva vertical para foto
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={photo}
              onError={(e) => { e.currentTarget.src = "/players/sample.png"; }}
              alt={name}
              style={{
                display: "block",
                maxHeight: "300px",    // ↑ foto más grande
                width: "auto",
                filter: "drop-shadow(0 18px 36px rgba(0,0,0,.45))",
              }}
            />
          </div>

          {/* Stats: bajadas un poco más y alineadas a la izquierda */}
          <div
            className="face-stats"
            style={{ marginTop: "22px" }} // ↑ más separación respecto al nombre/foto
          >
            <div className="stat nationality">
              <div className="lab">NAC</div>
              <div className="val">{nationality}</div>
            </div>

            {statCols.map((s) => (
              <div className="stat" key={s.key}>
                <div className="lab">{s.key}</div>
                <div className="val">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Pie: nombre + valor + posición */}
          <div className="face-footer">
            <div className="name-box" style={{ position: "relative" }}>
              {/* sutil banda translúcida para mejorar contraste del nombre */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-6px",
                  right: "8px",
                  top: "0px",
                  height: "36px",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 100%)",
                }}
              />
              <div
                className="player-name"
                style={{
                  position: "relative",
                  fontFamily: '"Londrina Shadow", system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.6px",
                  fontSize: "32px",       // ↑ un poco más grande
                  lineHeight: 1.05,
                  color: "#f5f5f5",
                  WebkitTextStroke: "0.35px rgba(0,0,0,0.45)", // borde suave para legibilidad
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.5), 0 0 8px rgba(255,255,255,0.12)",
                }}
              >
                {name.toUpperCase()}
              </div>
              <div className="supply">{supply}/{supplyTotal}</div>
            </div>
            <div className="role-pill">{isGK ? "PORTERO" : "CAMPO"}</div>
          </div>
        </div>

        {/* Desactiva la “profundidad” visual de los laterales */}
        <div className="card3d-side-right" style={{ display: "none" }} />
        <div className="card3d-side-bottom" style={{ display: "none" }} />
      </div>
    </div>
  );
}