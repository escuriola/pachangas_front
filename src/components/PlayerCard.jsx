import React from "react";
import { Link } from "react-router-dom";
import SorareCard from "./SorareCard";

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="block">
      <SorareCard
        rarity={player.rarity}
        photo={player.photo || "/players/sample.png"}   // PNG transparente
        topLeftBadge="Pachangas"
        nationality={player.nationality || "🏳️"}
        position={player.position}
        age={player.age ?? "-"}
        name={player.name}
        value={player.value}
        totalPoints={player.totalPoints}               // PTS arriba-dcha
        supply={player.supply ?? 1}
        supplyTotal={player.supplyTotal ?? 1000}
        fifa={{
          PAS: player.fifa?.PAS ?? "-",
          TIR: player.fifa?.TIR ?? "-",
          REG: player.fifa?.REG ?? "-",
          FIS: player.fifa?.FIS ?? "-",
          PAR: player.fifa?.PAR ?? "-",               // solo usado si es PORTERO
        }}
        className="mx-auto"
      />
    </Link>
  );
}