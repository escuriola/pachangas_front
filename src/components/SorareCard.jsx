import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/londrina-shadow/400.css"; // Fuente SOLO para el nombre

/**
 * Cromo v4 — tilt + luz, notch esquina, grosor 3D ~5cm, borde fino por rareza
 * Ajustes:
 * - Nombre con faja translúcida + outline suave para legibilidad sobre fondo negro
 * - Stats bajadas (más aire a la foto)
 * - Aumentada la profundidad visual (laterales)
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
    const ry = ((mx - cx) / cx) * 10; // rot Y
    const rx = -((my - cy) / cy) * 8; // rot X
    const lx = (mx / rect.width) * 100; // luz %
    const ly = (my / rect.height) * 100; // luz %
    setTilt({ rx, ry, lx, ly });
  }
  function onLeave() {
    setTilt({ rx: 0, ry: 0, lx: 50, ly: 50 });
  }

  // Gradientes por rareza para laterales (profundidad)
  const rightSideGradient =
    rarity === "gold"
      ? "linear-gradient(180deg,#7f6110,#f0d375)"
      : rarity === "silver"
        ? "linear-gradient(180deg,#6c7681,#eef2f6)"
        : "linear-gradient(180deg,#5a3607,#c6873a)";

  const bottomSideGradient =
    rarity === "gold"
      ? "linear-gradient(90deg,#f2d169,#9a6f12)"
      : rarity === "silver"
        ? "linear-gradient(90deg,#eef2f6,#7b8794)"
        : "linear-gradient(90deg,#c6873a,#5a3607)";

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
          "--lx": `${tilt.lx}%`,
          "--ly": `${tilt.ly}%`,
          // Aseguramos 3D correcto
          transformStyle: "preserve-3d",
        }}
      >
        {/* Cara frontal con notch y borde perimetral */}
        <div className="card3d-face" style={{ transform: "translateZ(0.01px)" }}>
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

          {/* Foto centrada */}
          <div
            className="face-photo"
            style={{
              marginTop: "4px",
              marginBottom: "10px", // más aire bajo la foto para empujar stats hacia abajo
            }}
          >
            <img
              src={photo}
              onError={(e) => {
                e.currentTarget.src = "/players/sample.png";
              }}
              alt={name}
              style={{
                display: "block",
                maxHeight: "268px", // un pelín más alta si el contenedor lo permite
                width: "auto",
                marginInline: "auto",
                filter: "drop-shadow(0 18px 36px rgba(0,0,0,.45))",
                transform: "translateZ(2px)",
              }}
            />
          </div>

          {/* Stats: bajadas un poco más y alineadas a la izquierda */}
          <div
            className="face-stats"
            style={{
              marginTop: "22px", // <-- desplazamos más hacia abajo
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
          <div className="face-footer" style={{ marginTop: "10px" }}>
            <div className="name-box" style={{ position: "relative" }}>
              {/* Faja translúcida detrás del nombre para legibilidad */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-6px",
                  right: "8px",
                  top: "2px",
                  height: "32px",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 100%)",
                  filter: "blur(0.2px)",
                }}
              />
              <div
                className="player-name"
                style={{
                  position: "relative",
                  fontFamily:
                    '"Londrina Shadow", system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
                  fontWeight: 400,
                  letterSpacing: "0.5px",
                  color: "#f5f5f5",
                  // Outline + glow suave para contraste en negro
                  WebkitTextStroke: "0.6px rgba(255,255,255,0.28)",
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.35), 0 0 10px rgba(255,255,255,0.15), 0 2px 14px rgba(255,255,255,0.12)",
                }}
              >
                {name.toUpperCase()}
              </div>
              <div className="supply">{supply}/{supplyTotal}</div>
            </div>
            <div className="role-pill">{isGK ? "PORTERO" : "CAMPO"}</div>
          </div>
        </div>

        {/* Grosor: cara derecha e inferior (profundidad ~5cm visual, aumentada) */}
        <div
          className="card3d-side-right"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "14px", // antes más fino -> aumentamos profundidad
            height: "100%",
            background: rightSideGradient,
            transform: "translateZ(-14px) skewY(-1deg)",
            opacity: 0.9,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.25)",
          }}
        />
        <div
          className="card3d-side-bottom"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "12px", // antes más fino -> aumentamos profundidad
            background: bottomSideGradient,
            transform: "translateZ(-10px) skewX(-2deg)",
            opacity: 0.85,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
}