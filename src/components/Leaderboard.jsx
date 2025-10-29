import React from "react";

/**
 * Leaderboard
 * Tabla de clasificación genérica.
 *
 * Props:
 * - title: string (título de la tabla)
 * - players: array de jugadores completos
 * - metricKey: string | function(player) -> number (clave o función para obtener el valor de la métrica)
 * - metricLabel: string (etiqueta de cabecera para la métrica)
 * - maxItems: number (opcional, por defecto 20)
 */
export default function Leaderboard({
                                      title,
                                      players,
                                      metricKey,
                                      metricLabel,
                                      maxItems = 20,
                                    }) {
  const getMetric = (p) =>
    typeof metricKey === "function"
      ? Number(metricKey(p) || 0)
      : Number((p?.[metricKey] ?? 0));

  const rows = (players || [])
    .map((p) => ({
      ...p,
      _metric: getMetric(p),
    }))
    .filter((p) => Number.isFinite(p._metric))
    .sort((a, b) => b._metric - a._metric)
    .slice(0, maxItems);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 shadow-md">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base">
          <thead>
          <tr className="text-left text-gray-300 border-b border-white/10">
            <th className="py-2 pr-3 w-12">#</th>
            <th className="py-2 pr-3">Jugador</th>
            <th className="py-2 pr-3">Equipo</th>
            <th className="py-2 pr-0 text-right">{metricLabel}</th>
          </tr>
          </thead>
          <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="py-3" colSpan={4}>
                No hay datos disponibles.
              </td>
            </tr>
          )}
          {rows.map((p, idx) => (
            <tr
              key={p.id ?? `${p.name}-${idx}`}
              className="border-b last:border-b-0 border-white/5"
            >
              <td className="py-2 pr-3 font-mono">{idx + 1}</td>
              <td className="py-2 pr-3 font-medium">{p.name ?? "—"}</td>
              <td className="py-2 pr-3 text-gray-300">{p.team ?? "—"}</td>
              <td className="py-2 pr-0 text-right font-semibold">{p._metric}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}