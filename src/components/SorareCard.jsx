import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/londrina-shadow/400.css"; // Fuente para el nombre

/**
 * Cromo v4 — tilt + luz, notch esquina, borde por rareza
 * Ajustes:
 * - Foto mucho más alta (ocupa casi todo el cromo)
 * - Stats bajadas (más espacio para la imagen)
 * - Nombre más grande y más visible sobre fondo negro
 * - Sin profundidad lateral
 */
export default function SorareCard({
                                     rarity = "gold", // gold | silver | bronze
                                     photo = "/players/sample.png",
                                     name = "PLAYER",
                                     nationality = "🇪🇸",
                                     position = "CAMPO", // "CAMPO" | "PORTERO"
                                     age = "-",
                                     totalPoints = 100, // PTS (arriba-dcha)
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
      { key: "PAS", val: fifa.PAS ?? "-" },
      { key: "PAR", val: fifa.PAR ?? "-" },
      { key: "FIS", val: fifa.FIS ?? "-" },
    ]
    : [
      { key: "EDAD", val: age },
      { key: "PAS", val: fifa.PAS ?? "-" },
      { key: "TIR", val: fifa.TIR ?? "-" },
      { key: "REG", val: fifa.REG ?? "-" },
      { key: "FIS", val: fifa.FIS ?? "-" },
    ];

  function onMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ry = ((mx - cx) / cx) * 10;
    const rx = -((my - cy) / cy) * 8;
    const lx = (mx / rect.width) * 100;
    const ly = (my / rect.height) * 100;
    setTilt({ rx, ry, lx, ly });
  }
  function onLeave() {
    setTilt({ rx: 0, ry: 0, lx: 50, ly: 50 });
  }

  return (
    <div
      className={clsx("card3d-wrapper", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={cardRef}
        className={clsx("card3d-root", {
          "rarity-gold": rarity === "gold",
          "rarity-silver": rarity === "silver",
          "rarity-bronze": rarity === "bronze",
        })}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          "--lx": `${tilt.lx}%`,
          "--ly": `${tilt.ly}%`,
        }}
      >
        {/* Cara frontal */}
        <div className="card3d-face">
          <div className="card3d-glint" />

          {/* Cabecera */}
          <div className="face-header" style={{ zIndex: 2 }}>
            <div className="chip">Pachangas</div>
            <div className="pts">
              <div className="pts-num">{totalPoints}</div>
              <div className="pts-lab">PTS</div>
            </div>
          </div>

          {/* Imagen del jugador — ocupa casi todo el alto */}
          <div
            className="face-photo"
            style={{
              marginTop: "0",
              marginBottom: "12px",
              height: "330px", // ↑ ocupa casi todo el cromo
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <img
              src={photo}
              onError={(e) => {
                e.currentTarget.src = "/players/sample.png";
              }}
              alt={name}
              style={{
                maxHeight: "100%",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 18px 36px rgba(0,0,0,0.6))",
              }}
            />
          </div>

          {/* Stats: más abajo, centradas */}
          <div
            className="face-stats"
            style={{
              marginTop: "24px", // separa bien de la foto
            }}
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
          <div className="face-footer" style={{ marginTop: "14px" }}>
            <div className="name-box" style={{ position: "relative" }}>
              {/* faja translúcida detrás del nombre */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-6px",
                  right: "8px",
                  top: "2px",
                  height: "44px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.07) 55%, rgba(255,255,255,0) 100%)",
                }}
              />
              <div
                className="player-name"
                style={{
                  position: "relative",
                  fontFamily:
                    '"Londrina Shadow", system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.8px",
                  fontSize: "38px", // ↑ más grande
                  lineHeight: 1.1,
                  color: "#fafafa",
                  WebkitTextStroke: "0.45px rgba(0,0,0,0.65)", // contorno más visible
                  textShadow:
                    "0 1px 2px rgba(0,0,0,0.8), 0 0 14px rgba(255,255,255,0.25)",
                }}
              >
                {name.toUpperCase()}
              </div>
              <div
                className="supply"
                style={{
                  position: "relative",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.8)",
                  marginTop: "2px",
                }}
              >
                {supply}/{supplyTotal}
              </div>
            </div>
            <div className="role-pill">{isGK ? "PORTERO" : "CAMPO"}</div>
          </div>
        </div>

        {/* Sin profundidad */}
        <div className="card3d-side-right" style={{ display: "none" }} />
        <div className="card3d-side-bottom" style={{ display: "none" }} />
      </div>
    </div>
  );
}