import { useEffect, useState } from "react";
import SorareCard from "./SorareCard";
import { computePlayerValue } from "@/data/dummy"; // reutiliza tu función
import { fetchPlayerByNid, fetchPlayers } from "@/api/pachangas";

type OneProps = { nid: number | string; className?: string };
type ManyProps = { all?: true; className?: string };
type Props = OneProps | ManyProps;

/** Wrapper: trae 1 jugador (nid) o varios (all) y pinta SorareCard con el mismo look */
export default function SorareCardRemote(props: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        if ("nid" in props) {
          const p = await fetchPlayerByNid(props.nid);
          if (alive && p) setItems([p]);
        } else {
          const ps = await fetchPlayers();
          if (alive) setItems(ps);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [("nid" in props) ? props.nid : props.all]);

  if (loading) return <div className="text-xs opacity-70">Cargando…</div>;
  if (err) return <div className="text-red-400 text-sm">Error: {err}</div>;
  if (!items.length) return <div className="text-xs opacity-70">Sin resultados</div>;

  // single
  if (items.length === 1 && "nid" in props) {
    const p = items[0];
    const value = computePlayerValue({ position: p.position, totalPoints: p.totalPoints, stats: p.stats });
    return (
      <SorareCard
        className={props.className}
        id={p.id}
        name={p.name}
        position={p.position}
        photo={p.photo || "/players/sample.png"}
        nationality={p.nationality}
        age={p.age}
        totalPoints={p.totalPoints}
        stats={p.stats}
        fifa={p.fifa}
        rarity={p.rarity}
        value={value}
      />
    );
  }

  // many
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((p) => {
        const value = computePlayerValue({ position: p.position, totalPoints: p.totalPoints, stats: p.stats });
        return (
          <SorareCard
            key={p.id}
            className={props.className}
            id={p.id}
            name={p.name}
            position={p.position}
            photo={p.photo || "/players/sample.png"}
            nationality={p.nationality}
            age={p.age}
            totalPoints={p.totalPoints}
            stats={p.stats}
            fifa={p.fifa}
            rarity={p.rarity}
            value={value}
          />
        );
      })}
    </div>
  );
}