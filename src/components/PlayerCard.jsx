import React from "react";
import { Link } from "react-router-dom";
import SorareCard from "./SorareCard";

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="block">
      <SorareCard
        rarity={player.rarity}
        photo={player.photo || "/players/sample.jpg"}
        topLeftBadge="Pachangas"
        nationality={player.nationality || "🏳️"}
        position={player.position}
        age={player.age ?? "-"}
        name={player.name}
        value={player.value}
        totalPoints={player.totalPoints}   // ← badge verde con puntos
        supply={player.supply ?? 1}
        supplyTotal={player.supplyTotal ?? 1000}
        fifa={player.fifa}                 // ← stats FIFA
        className="mx-auto"
      />
    </Link>
  );
}