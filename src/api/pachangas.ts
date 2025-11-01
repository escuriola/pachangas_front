// Cliente mínimo JSON:API + mapeo a tu shape de SorareCard
export type JsonApiDoc = { data: any | any[]; included?: any[] };

const API_BASE = import.meta.env.VITE_API_BASE || ""; // .env: VITE_API_BASE=https://pachangas.escuriola.com:8844

function absUrl(u?: string) {
  if (!u) return undefined;
  return /^https?:\/\//i.test(u) ? u : `${API_BASE}${u}`;
}

function resolvePhotoUrl(node: any, included?: any[]) {
  const rel = node?.relationships?.field_player_photo?.data;
  if (!rel || !included) return undefined;
  const file = included.find((i) => i.type === rel.type && i.id === rel.id);
  return absUrl(file?.attributes?.uri?.url);
}

export function mapNodeToCardProps(node: any, included?: any[]) {
  const a = node.attributes ?? {};
  const photo = resolvePhotoUrl(node, included);

  const posRaw = String(a.field_player_position ?? "field").toLowerCase();
  const position = posRaw === "goalkeeper" ? "PORTERO" : "CAMPO";

  // Tus “fifa-like”
  const fifa = {
    PAS: Number(a.field_player_stats_pass ?? 0),
    TIR: Number(a.field_player_stats_shoot ?? 0),
    REG: Number(a.field_player_stats_dribbling ?? 0),
    FIS: Number(a.field_player_stats_fitness ?? 0),
    PAR: Number(a.field_player_stats_saves ?? 0),
  };

  // Stats operativas para computePlayerValue
  const stats = {
    goals: 0,
    assists: 0,
    saves: Number(a.field_player_stats_saves ?? 0),
    cleanSheets: 0,
  };

  return {
    id: String(a.drupal_internal__nid),
    name: a.title,
    position,
    totalPoints: Number(a.field_player_points ?? 0),
    stats,
    fifa,
    photo,
    nationality: "🇪🇸",
    age: Number(a.field_player_age ?? 0),
    rarity: "gold",
  };
}

export async function fetchPlayers() {
  const fields = [
    "title",
    "field_player_age",
    "field_player_points",
    "field_player_stats_pass",
    "field_player_stats_shoot",
    "field_player_stats_deffense",
    "field_player_stats_dribbling",
    "field_player_stats_fitness",
    "field_player_stats_saves",
    "field_player_value",
    "field_player_photo",
    'field_player_position',
  ].join(",");

  const url =
    `${API_BASE}/jsonapi/node/pachangas_player?filter[status]=1` +
    `&fields[node--pachangas_player]=${fields}` +
    `&include=field_player_photo&page[limit]=1000`;

  const res = await fetch(url, { headers: { Accept: "application/vnd.api+json" } });
  if (!res.ok) throw new Error(`JSON:API ${res.status}`);
  const json = (await res.json()) as JsonApiDoc;

  return (json.data as any[]).map((n) => mapNodeToCardProps(n, json.included));
}

export async function fetchPlayerByNid(nid: string | number) {
  const url =
    `${API_BASE}/jsonapi/node/pachangas_player?filter[status]=1` +
    `&filter[nid][value]=${encodeURIComponent(String(nid))}` +
    `&include=field_player_photo&page[limit]=1`;

  const res = await fetch(url, { headers: { Accept: "application/vnd.api+json" } });
  if (!res.ok) throw new Error(`JSON:API ${res.status}`);
  const json = (await res.json()) as JsonApiDoc;
  const item = Array.isArray(json.data) ? json.data[0] : json.data;
  return item ? mapNodeToCardProps(item, json.included) : null;
}