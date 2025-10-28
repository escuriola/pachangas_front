import React from "react";
import { Link } from "react-router-dom";
import SorareCard from "./SorareCard";

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="block">
      <SorareCard
        rarity={player.rarity}
        photo={player.photo || "/players/sample.png"}
        nationality={player.nationality || "🇪🇸"}
        position={player.position}
        age={player.age ?? "-"}
        name={player.name}
        totalPoints={player.totalPoints}
        fifa={player.fifa}
        supply={player.supply ?? 1}
        supplyTotal={player.supplyTotal ?? 1000}
      />
    </Link>
  );
}