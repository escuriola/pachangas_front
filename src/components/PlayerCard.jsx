import React from "react";
import { Link } from "react-router-dom";
import SorareCard from "./SorareCard";

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player.id}`} className="block hover:scale-[1.03] transition-transform duration-500">
      <SorareCard
        rarity={player.rarity}
        photo={player.photo || "/players/sample.png"}
        nationality={player.nationality || "🏳️"}
        position={player.position}
        age={player.age ?? "-"}
        name={player.name}
        totalPoints={player.totalPoints}
        fifa={player.fifa}
      />
    </Link>
  );
}