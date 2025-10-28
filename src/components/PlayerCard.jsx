import React from "react";
import { Link } from "react-router-dom";
import SorareCard from "./SorareCard";

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="block">
      <SorareCard
        rarity={player.rarity}
        photo={player.photo}
        topLeftBadge="Pachangas"
        nationality={player.nationality || "🏳️"}
        position={player.position}
        age={player.age ?? "-"}
        name={player.name}
        supply={player.supply ?? 1}
        supplyTotal={player.supplyTotal ?? 1000}
        className="mx-auto"
      />
    </Link>
  );
}