import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/londrina-shadow/400.css";
import { computePlayerValue, players as DUMMY_PLAYERS } from "../data/dummy";

/**
 * Cromo v4.5 — stats 3×2 sin solapes, foto más alta, badge abajo-dcha, bandera micro
 */
export default function SorareCard({
                                     rarity = "gold",
                                     photo = "/players/sample.png",
                                     id,
                                     name = "PLAYER",
                                     nationality = "🇪🇸",
                                     position = "CAMPO", // "CAMPO" | "PORTERO"
                                     age = "-",
                                     totalPoints = 100,
                                     value,
                                     stats,
                                     goals, assists, saves, cleanSheets,
                                     fifa = { PAS: 80, TIR: 80, REG: 80, FIS: 80, PAR: 80, ATA: undefined, DEF: undefined },
                                     className,
                                   }) {
  const isGK = position === "PORTERO";
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lx: 50, ly: 50 });

  // ---------- Resolver valor UNIFICADO ----------
  function resolveValue() {
    if (Number.isFinite(value)) return Number(value);
    let base = null;
    if (id != null) base = DUMMY_PLAYERS.find((p) => String(p.id) === String(id));
    if (!base && name) {
      base = DUMMY_PLAYERS.find((p) => String(p.name).toLowerCase() === String(name).toLowerCase());
    }
    if (base) return computePlayerValue(base);
    const mergedStats = {
      goals: Number(goals ?? stats?.goals ?? 0),
      assists: Number(assists ?? stats?.assists ?? 0),
      saves: Number(saves ?? stats?.saves ?? 0),
      cleanSheets: Number(cleanSheets ?? stats?.cleanSheets ?? 0),
    };
    return computePlayerValue({ position, totalPoints: Number(totalPoints ?? 0), stats: mergedStats });
  }
  const unifiedValue = resolveValue();

  const accent = rarity === "gold" ? "#f5c84c" : rarity === "silver" ? "#d8d8d8" : "#b87333";
  const accentSoft =
    rarity === "gold" ? "rgba(245,200,76,0.18)" :
      rarity === "silver" ? "rgba(216,216,216,0.18)" : "rgba(184,115,51,0.18)";

  const cs = Number(cleanSheets ?? stats?.cleanSheets ?? 0);

  // ATA/DEF (si no llegan, estimación suave)
  const ATA_val = Number.isFinite(fifa.ATA)
    ? fifa.ATA
    : Math.round(((fifa.TIR ?? 0) * 0.5 + (fifa.REG ?? 0) * 0.3 + (fifa.PAS ?? 0) * 0.2));
  const DEF_val = Number.isFinite(fifa.DEF)
    ? fifa.DEF
    : Math.round(((fifa.FIS ?? 0) * 0.7 + Math.min(cs, 10) * 3));

  // UI helpers
  const StatChip = ({ label, value }) => (
    <div
      className="stat-chip"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        padding: "4px 8px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        height: 26, // alto fijo para cálculo de 2 filas
        minWidth: 0,
      }}
    >
      <div
        className="lab"
        style={{
          fontSize: 9,
          letterSpacing: "0.35px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {label}
      </div>
      <div className="val" style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );

  const Placeholder = () => (
    <div style={{ visibility: "hidden", height: 26 }} />
  );

  function onMove(e) {
    const el = cardRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const ry = ((mx - cx) / cx) * 10;
    const rx = -((my - cy) / cy) * 8;
    const lx = (mx / rect.width) * 100;
    const ly = (my / rect.height) * 100;
    setTilt({ rx, ry, lx, ly });
  }
  function onLeave() { setTilt({ rx: 0, ry: 0, lx: 50, ly: 50 }); }

  // Chips por rol (exactamente 6 para campo; para portero: 3 + placeholders)
  const fieldChips = [
    { k: "ATA", v: ATA_val },
    { k: "DEF", v: DEF_val },
    { k: "PAS", v: fifa.PAS ?? "-" },
    { k: "TIR", v: fifa.TIR ?? "-" },
    { k: "REG", v: fifa.REG ?? "-" },
    { k: "FIS", v: fifa.FIS ?? "-" },
  ];
  const gkChipsReal = [
    { k: "PAR", v: fifa.PAR ?? "-" },
    { k: "PAS", v: fifa.PAS ?? "-" },
    { k: "FIS", v: fifa.FIS ?? "-" },
    // Si quieres incluir EDAD para GK, descomenta la siguiente línea y comenta un Placeholder
    // { k: "EDAD", v: age },
  ];

  // Preparar array 6 elementos para el grid 3×2
  const chips = isGK
    ? [
      ...gkChipsReal,
      <Placeholder key="ph1" />,
      <Placeholder key="ph2" />,
      <Placeholder key="ph3" />,
    ].slice(0, 6)
    : fieldChips;

  return (
    <div className={clsx("card3d-wrapper", className)} onMouseMove={onMove} onMouseLeave={onLeave}>
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
        {/* Cara como columna; reservamos espacio claro para stats y pie */}
        <div
          className="card3d-face"
          style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
        >
          <div className="card3d-glint" />

          {/* Cabecera */}
          <div className="face-header" style={{ zIndex: 2 }}>
            <div className="chip">Pachangas</div>
            <div
              className="pts"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 8px", borderRadius: 10,
                border: `1px solid ${accent}`, background: accentSoft,
                boxShadow: `0 0 10px ${accent}40, inset 0 0 8px rgba(0,0,0,0.25)`,
              }}
            >
              <div
                className="pts-num"
                style={{
                  fontWeight: 700, color: accent,
                  textShadow: `0 0 10px ${accent}66, 0 1px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {totalPoints}
              </div>
              <div className="pts-lab" style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", letterSpacing: "0.5px" }}>
                PTS
              </div>
            </div>
          </div>

          {/* Foto (más alta pero sin invadir stats) */}
          <div
            className="face-photo"
            style={{
              flex: "1 1 auto",
              minHeight: 320,   // ↑
              maxHeight: 460,   // ↑
              marginTop: 4,
              marginBottom: 12, // ↓ deja más aire antes de stats
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={photo}
              onError={(e) => { e.currentTarget.src = "/players/sample.png"; }}
              alt={name}
              style={{
                maxHeight: "100%", width: "auto", objectFit: "contain",
                filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.65))",
              }}
            />
          </div>

          {/* Stats — grid 3×2, separadas de la foto */}
          <div
            className="face-stats"
            style={{
              padding: "0 8px",
              marginTop: 2,             // baja un pelín más
              marginBottom: 8,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gridAutoRows: "26px",
              gap: "8px 8px",
              alignItems: "stretch",
              justifyItems: "stretch",
              minHeight: 26 * 2 + 8,    // 2 filas
              maxHeight: 26 * 2 + 8,    // bloquear a 2 filas exactas
              overflow: "hidden",
            }}
          >
            {chips.map((c, idx) =>
              React.isValidElement(c) ? (
                React.cloneElement(c, { key: `chip-${idx}` })
              ) : (
                <StatChip key={idx} label={c.k} value={c.v} />
              )
            )}
          </div>

          {/* Pie (nombre + valor) */}
          <div className="face-footer" style={{ marginTop: "auto", position: "relative", zIndex: 3, paddingTop: 6 }}>
            <div className="name-box" style={{ position: "relative" }}>
              {/* Faja sutil detrás del nombre */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-6px",
                  right: "8px",
                  top: 2,
                  height: 38,
                  borderRadius: 10,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 100%)",
                  backdropFilter: "blur(0.5px)",
                }}
              />
              <div
                className="player-name-row"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                }}
              >
                <div
                  className="player-name"
                  style={{
                    fontFamily:
                      '"Londrina Shadow", system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
                    fontWeight: 400,
                    letterSpacing: "0.8px",
                    fontSize: 36,
                    lineHeight: 1.05,
                    color: "#ffffff",
                    WebkitTextStroke: `1px ${accent}`,
                    textShadow: `0 0 10px ${accent}70, 0 2px 4px rgba(0,0,0,0.9)`,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                  title={name.toUpperCase()}
                >
                  {name.toUpperCase()}
                </div>

                {/* Bandera micro */}
                <div
                  className="player-flag"
                  style={{
                    fontSize: 10,
                    lineHeight: 1,
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.6))",
                    transform: "translateY(1px)",
                    opacity: 0.95,
                    flex: "0 0 auto",
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
                  marginTop: 2,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <span className="font-mono">{Number.isFinite(unifiedValue) ? unifiedValue : "—"}</span>/1000
              </div>
            </div>
          </div>

          {/* Badge PORTERO/CAMPO abajo-derecha (fijo) */}
          <div
            className="role-pill"
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              zIndex: 4,
            }}
          >
            {isGK ? "PORTERO" : "CAMPO"}
          </div>
        </div>

        {/* Sin profundidad */}
        <div className="card3d-side-right" style={{ display: "none" }} />
        <div className="card3d-side-bottom" style={{ display: "none" }} />
      </div>
    </div>
  );
}