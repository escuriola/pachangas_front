import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/londrina-shadow/400.css"; // Fuente para el nombre
import { computePlayerValue, players as DUMMY_PLAYERS } from "../data/dummy";

/**
 * Cromo v4.1 — bandera junto al nombre + grupos Ataque/Defensa
 * Unificación del valor:
 *  1) Si llega prop `value` => usarlo tal cual (MISMA cifra que TeamGenerator si viene de ahí).
 *  2) Si NO llega `value`, se busca el jugador en dummy por `id` (o `name`) y se calcula con computePlayerValue
 *     usando el registro ORIGINAL del dummy (misma fuente -> mismo resultado).
 *  3) Como último fallback, intenta computar con las props recibidas (totalPoints + stats sueltas).
 */
export default function SorareCard({
                                     rarity = "gold", // gold | silver | bronze
                                     photo = "/players/sample.png",
                                     id,                      // <- id del jugador para lookup exacto en dummy
                                     name = "PLAYER",
                                     nationality = "🇪🇸",
                                     position = "CAMPO",      // "CAMPO" | "PORTERO"
                                     age = "-",
                                     totalPoints = 100,       // PTS (arriba-dcha)

                                     // Valor: si no llega, se resuelve con dummy y computePlayerValue
                                     value,

                                     // Stats opcionales (por si el caller ya las trae)
                                     stats,
                                     goals, assists, saves, cleanSheets,

                                     fifa = { PAS: 80, TIR: 80, REG: 80, FIS: 80, PAR: 80 },
                                     className,
                                   }) {
  const isGK = position === "PORTERO";
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lx: 50, ly: 50 });

  // ---------- Resolver valor UNIFICADO ----------
  function resolveValue() {
    // 1) Si viene value explícito => usarlo
    if (Number.isFinite(value)) return Number(value);

    // 2) Intentar lookup en dummy por id -> name
    let base = null;
    if (id != null) {
      base = DUMMY_PLAYERS.find((p) => String(p.id) === String(id));
    }
    if (!base && name) {
      base = DUMMY_PLAYERS.find(
        (p) => String(p.name).toLowerCase() === String(name).toLowerCase()
      );
    }
    if (base) {
      // Mismo registro que usa TeamGenerator -> mismo compute
      return computePlayerValue(base);
    }

    // 3) Fallback: computar con lo que tengamos en props (por si se usa el cromo suelto)
    const mergedStats = {
      goals: Number(goals ?? stats?.goals ?? 0),
      assists: Number(assists ?? stats?.assists ?? 0),
      saves: Number(saves ?? stats?.saves ?? 0),
      cleanSheets: Number(cleanSheets ?? stats?.cleanSheets ?? 0),
    };
    return computePlayerValue({
      position,
      totalPoints: Number(totalPoints ?? 0),
      stats: mergedStats,
    });
  }

  const unifiedValue = resolveValue();

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

  // Helpers UI
  const StatChip = ({ label, value, minWidth = 72 }) => (
    <div
      className="stat-chip"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 6px",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        minWidth,
      }}
    >
      <div
        className="lab"
        style={{
          fontSize: "9px",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          minWidth: "30px",
        }}
      >
        {label}
      </div>
      <div
        className="val"
        style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}
      >
        {value}
      </div>
    </div>
  );

  const StatGroup = ({ title, children }) => (
    <div
      className="stat-group"
      style={{
        flex: "1 1 100%",
        padding: "8px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        boxShadow: "inset 0 0 12px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="group-title"
        style={{
          fontSize: "10px",
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "6px",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 6px",
          borderRadius: "6px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        {title}
      </div>
      <div
        className="group-grid"
        style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px" }}
      >
        {children}
      </div>
    </div>
  );

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

  // Datos numéricos que usaremos
  const g = Number(goals ?? stats?.goals ?? 0);
  const a = Number(assists ?? stats?.assists ?? 0);
  const sv = Number(saves ?? stats?.saves ?? 0);
  const cs = Number(cleanSheets ?? stats?.cleanSheets ?? 0);

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
              height: "348px",
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

          {/* Stats */}
          <div
            className="face-stats"
            style={{
              marginTop: "40px",
              marginBottom: "6px",
              padding: "0 6px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 10px",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {/* Info suelta */}
            <StatChip label="EDAD" value={age} />

            {/* Grupo ATAQUE */}
            <StatGroup title="ATAQUE">
              {isGK ? (
                <>
                  <StatChip label="PAS" value={fifa.PAS ?? "-"} />
                </>
              ) : (
                <>
                  <StatChip label="GOL" value={g} />
                  <StatChip label="ASI" value={a} />
                  <StatChip label="TIR" value={fifa.TIR ?? "-"} />
                  <StatChip label="REG" value={fifa.REG ?? "-"} />
                  <StatChip label="PAS" value={fifa.PAS ?? "-"} />
                </>
              )}
            </StatGroup>

            {/* Grupo DEFENSA */}
            <StatGroup title="DEFENSA">
              {isGK ? (
                <>
                  <StatChip label="PAR" value={fifa.PAR ?? "-"} />
                  <StatChip label="FIS" value={fifa.FIS ?? "-"} />
                  <StatChip label="CS" value={cs} />
                </>
              ) : (
                <>
                  <StatChip label="FIS" value={fifa.FIS ?? "-"} />
                  <StatChip label="CS" value={cs} />
                </>
              )}
            </StatGroup>
          </div>

          {/* Pie: nombre + bandera + VAL + posición */}
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
                className="player-name-row"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                }}
              >
                <div
                  className="player-name"
                  style={{
                    fontFamily:
                      '"Londrina Shadow", system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
                    fontWeight: 400,
                    letterSpacing: "0.8px",
                    fontSize: "40px",
                    lineHeight: 1.1,
                    color: "#ffffff",
                    WebkitTextStroke: `1.1px ${accent}`,
                    textShadow: `0 0 12px ${accent}80, 0 0 22px ${accent}60, 0 2px 4px rgba(0,0,0,0.9)`,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                  title={name.toUpperCase()}
                >
                  {name.toUpperCase()}
                </div>

                {/* Bandera junto al nombre (sin etiqueta) */}
                <div
                  className="player-flag"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.6))",
                    transform: "translateY(2px)",
                  }}
                  aria-label="Nacionalidad"
                  title="Nacionalidad"
                >
                  {nationality}
                </div>
              </div>

              {/* VALOR (0–1000) */}
              <div
                className="value"
                style={{
                  position: "relative",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.85)",
                  marginTop: "2px",
                }}
              >
                <span className="font-mono">
                  {Number.isFinite(unifiedValue) ? unifiedValue : "—"}
                </span>
                /1000
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