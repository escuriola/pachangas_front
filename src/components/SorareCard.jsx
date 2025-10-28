import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/londrina-shadow/400.css"; // Fuente para el nombre

/**
 * Cromo v4 — tilt + luz, notch esquina, borde por rareza
 * Ajustes:
 * - Foto alta (hasta casi el nombre)
 * - Stats más abajo, alineadas a la izquierda y minimizadas
 * - Nombre con borde del color del tipo de carta
 * - PTS con color según rareza
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

  // Colores según rareza
  const accent =
    rarity === "gold"
      ? "#f5c84c"
      : rarity === "silver"
        ? "#d8d8d8"
        : "#b87333";

  const accentSoft =
    rarity === "gold"
      ? "rgba(245,200,76,0.18)"
      : rarity === "silver"
        ? "rgba(216,216,216,0.18)"
        : "rgba(184,115,51,0.18)";

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
        <div className="card3d-face">
          <div className="card3d-glint" />

          {/* Cabecera */}
          <div className="face-header" style={{ zIndex: 2 }}>
            <div className="chip">Pachangas</div>
            <div
              className="pts"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 8px",
                borderRadius: "10px",
                border: `1px solid ${accent}`,
                background: accentSoft,
                boxShadow: `0 0 10px ${accent}40, inset 0 0 8px rgba(0,0,0,0.25)`,
              }}
            >
              <div
                className="pts-num"
                style={{
                  fontWeight: 700,
                  color: accent,
                  textShadow: `0 0 10px ${accent}66, 0 1px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {totalPoints}
              </div>
              <div
                className="pts-lab"
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.5px",
                }}
              >
                PTS
              </div>
            </div>
          </div>

          {/* Imagen del jugador */}
          <div
            className="face-photo"
            style={{
              marginTop: "0",
              marginBottom: "10px",
              height: "348px", // alto de la foto
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
                filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.65))",
              }}
            />
          </div>

          {/* Stats — bajadas, alineadas a la izquierda y minimizadas */}
          <div
            className="face-stats"
            style={{
              marginTop: "34px",      // ↓ más separación para evitar solape
              marginBottom: "6px",
              padding: "0 8px",       // leve sangría a la izquierda
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 12px",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {/* Nacionalidad compacta */}
            <div
              className="stat nationality"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="lab"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                NAC
              </div>
              <div
                className="val"
                style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}
              >
                {nationality}
              </div>
            </div>

            {/* Otras stats compactas */}
            {statCols.map((s) => (
              <div
                className="stat"
                key={s.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minWidth: "82px",
                }}
              >
                <div
                  className="lab"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                    minWidth: "34px",
                  }}
                >
                  {s.key}
                </div>
                <div
                  className="val"
                  style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}
                >
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Pie: nombre + valor + posición */}
          <div className="face-footer" style={{ marginTop: "10px" }}>
            <div className="name-box" style={{ position: "relative" }}>
              {/* faja translúcida detrás del nombre */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-6px",
                  right: "8px",
                  top: "2px",
                  height: "48px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 100%)",
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
                  fontSize: "40px",
                  lineHeight: 1.1,
                  color: "#ffffff",
                  WebkitTextStroke: `1.1px ${accent}`, // contorno según rareza
                  textShadow: `
                    0 0 12px ${accent}80,
                    0 0 22px ${accent}60,
                    0 2px 4px rgba(0,0,0,0.9)
                  `,
                }}
              >
                {name.toUpperCase()}
              </div>
              <div
                className="supply"
                style={{
                  position: "relative",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.85)",
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