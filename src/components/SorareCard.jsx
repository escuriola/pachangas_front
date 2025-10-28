import React, { useRef, useState } from "react";
import clsx from "clsx";
import "@fontsource/league-spartan/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

/**
 * Cromo v4 — tilt + luz, notch esquina, grosor 3D ~5cm, borde fino por rareza
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

          {/* Foto centrada */}
          <div className="face-photo">
            <img
              src={photo}
              onError={(e) => { e.currentTarget.src = "/players/sample.png"; }}
              alt={name}
            />
          </div>

          {/* Stats: bajadas, alineadas a la izquierda */}
          <div className="face-stats">
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
            <div className="name-box">
              <div className="player-name">{name.toUpperCase()}</div>
              <div className="supply">{supply}/{supplyTotal}</div>
            </div>
            <div className="role-pill">{isGK ? "PORTERO" : "CAMPO"}</div>
          </div>
        </div>

        {/* Grosor: cara derecha e inferior (profundidad ~5cm visual) */}
        <div className="card3d-side-right" />
        <div className="card3d-side-bottom" />
      </div>
    </div>
  );
}