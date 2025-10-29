// Dummy de Pachangas (v2) — foto PNG, puntos arriba, stats reducidas con abreviaturas
// rarity: solo estética del marco (oro/plata/bronce)

const R = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const players = [
  // PORTEROS: usar PAR (paradas), PAS, FIS
  {
    id: "1",
    name: "Escuriola",
    position: "PORTERO",
    totalPoints: 128,
    matchesPlayed: 12,
    stats: { goals: 0, assists: 2, saves: 47, cleanSheets: 5 },
    fifa: { PAS: 68, PAR: 88, FIS: 80 },
    recentForm: [9.1, 8.5, 7.8, 8.9, 9.4],
    rarity: "gold",
    photo: "/players/escuriola.png",
    nationality: "🇪🇸",
    age: 34,
    supply: 609,
    supplyTotal: 1000
  },
  // CAMPO: PAS, TIR, REG, FIS
  {
    id: "2",
    name: "Raúl",
    position: "CAMPO",
    totalPoints: 154,
    matchesPlayed: 14,
    stats: { goals: 11, assists: 7, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 84, TIR: 86, REG: 89, FIS: 78 },
    recentForm: [8.2, 7.5, 9.0, 8.8, 9.1],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/raul.png",
    nationality: "🇪🇸",
    age: 30,
    supply: 112,
    supplyTotal: 1000
  },
  {
    id: "3",
    name: "Gabi",
    position: "CAMPO",
    totalPoints: 140,
    matchesPlayed: 13,
    stats: { goals: 10, assists: 6, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 86, TIR: 82, REG: 90, FIS: 76 },
    recentForm: [7.9, 8.0, 8.7, 7.4, 8.9],
    rarity: "gold",
    photo: "/players/gabi.png",
    nationality: "🇪🇸",
    age: 29,
    supply: 77,
    supplyTotal: 1000
  },
  {
    id: "4",
    name: "Kaiser",
    position: "CAMPO",
    totalPoints: 121,
    matchesPlayed: 12,
    stats: { goals: 8, assists: 5, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 78, TIR: 81, REG: 82, FIS: 79 },
    recentForm: [7.1, 8.3, 8.0, 7.6, 8.4],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/kaiser.png",
    nationality: "🇪🇸",
    age: 31,
    supply: 541,
    supplyTotal: 1000
  },
  {
    id: "5",
    name: "Manolo",
    position: "CAMPO",
    totalPoints: 110,
    matchesPlayed: 12,
    stats: { goals: 7, assists: 3, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 79, TIR: 80, REG: 77, FIS: 82 },
    recentForm: [7.0, 7.2, 7.8, 7.5, 8.0],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/manolo.png",
    nationality: "🇪🇸",
    age: 33,
    supply: 320,
    supplyTotal: 1000
  },
  {
    id: "6",
    name: "Gómez",
    position: "PORTERO",
    totalPoints: 119,
    matchesPlayed: 13,
    stats: { goals: 0, assists: 1, saves: 52, cleanSheets: 4 },
    fifa: { PAS: 65, PAR: 86, FIS: 83 },
    recentForm: [8.4, 7.8, 8.1, 8.7, 8.9],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/gomez.png",
    nationality: "🇪🇸",
    age: 32,
    supply: 902,
    supplyTotal: 1000
  },
  {
    id: "7",
    name: "Edu",
    position: "CAMPO",
    totalPoints: 132,
    matchesPlayed: 14,
    stats: { goals: 9, assists: 8, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 88, TIR: 79, REG: 87, FIS: 80 },
    recentForm: [8.6, 8.2, 8.9, 9.1, 8.8],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/edu.png",
    nationality: "🇪🇸",
    age: 28,
    supply: 15,
    supplyTotal: 1000
  },
  {
    id: "8",
    name: "Miguel",
    position: "CAMPO",
    totalPoints: 99,
    matchesPlayed: 11,
    stats: { goals: 6, assists: 2, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 74, TIR: 75, REG: 76, FIS: 77 },
    recentForm: [7.3, 7.8, 7.2, 7.9, 7.6],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/miguel.png",
    nationality: "🇪🇸",
    age: 27,
    supply: 411,
    supplyTotal: 1000
  },
  {
    id: "9",
    name: "Jorge",
    position: "CAMPO",
    totalPoints: 112,
    matchesPlayed: 12,
    stats: { goals: 7, assists: 4, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 80, TIR: 78, REG: 81, FIS: 79 },
    recentForm: [7.7, 8.1, 7.9, 8.0, 8.2],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/jorge.png",
    nationality: "🇪🇸",
    age: 29,
    supply: 705,
    supplyTotal: 1000
  },
  {
    id: "10",
    name: "Johny",
    position: "CAMPO",
    totalPoints: 104,
    matchesPlayed: 12,
    stats: { goals: 6, assists: 5, saves: 0, cleanSheets: 0 },
    fifa: { PAS: 78, TIR: 77, REG: 79, FIS: 78 },
    recentForm: [7.5, 7.6, 7.9, 7.8, 8.0],
    rarity: R(["gold", "silver", "bronze"]),
    photo: "/players/johny.png",
    nationality: "🇪🇸",
    age: 30,
    supply: 990,
    supplyTotal: 1000
  }
];

// === Partidos e histórico (igual que tenías) ===
export const matches = [
  {
    id: "m1",
    date: "2025-10-01",
    teams: { home: "Azules FC", away: "Rosas FC" },
    score: "5-3",
    lineups: {
      "Azules FC": ["Escuriola", "Raúl", "Kaiser", "Edu", "Jorge"],
      "Rosas FC": ["Gómez", "Gabi", "Manolo", "Miguel", "Johny"]
    },
    events: [
      { minute: 3, type: "goal", team: "Azules FC", player: "Raúl", assist: "Edu" },
      { minute: 6, type: "goal", team: "Rosas FC", player: "Gabi" },
      { minute: 11, type: "save", team: "Azules FC", player: "Escuriola", detail: "Penalti parado" },
      { minute: 15, type: "goal", team: "Azules FC", player: "Kaiser", assist: "Jorge" },
      { minute: 21, type: "goal", team: "Rosas FC", player: "Miguel", assist: "Johny" },
      { minute: 28, type: "goal", team: "Azules FC", player: "Edu", assist: "Raúl" },
      { minute: 33, type: "goal", team: "Azules FC", player: "Jorge" }
    ],
    report: "Partido vibrante. Escuriola paro un penalti clave; Raul y Edu lideraron la ofensiva."
  },
  {
    id: "m2",
    date: "2025-10-12",
    teams: { home: "Amarillos FC", away: "Azules FC" },
    score: "2-2",
    lineups: {
      "Amarillos FC": ["Gómez", "Gabi", "Edu", "Jorge", "Johny"],
      "Azules FC": ["Escuriola", "Raúl", "Kaiser", "Manolo", "Miguel"]
    },
    events: [
      { minute: 4, type: "goal", team: "Azules FC", player: "Raúl" },
      { minute: 9, type: "save", team: "Amarillos FC", player: "Gómez", detail: "Mano cambiada espectacular" },
      { minute: 17, type: "goal", team: "Amarillos FC", player: "Edu", assist: "Gabi" },
      { minute: 29, type: "goal", team: "Azules FC", player: "Manolo", assist: "Kaiser" },
      { minute: 36, type: "goal", team: "Amarillos FC", player: "Johny", assist: "Jorge" }
    ],
    report: "Igualadisimo. Apariciones decisivas de Gomez y reparto justo de puntos."
  },
  {
    id: "m3",
    date: "2025-10-22",
    teams: { home: "Rosas FC", away: "Amarillos FC" },
    score: "1-3",
    lineups: {
      "Rosas FC": ["Gómez", "Kaiser", "Edu", "Miguel", "Johny"],
      "Amarillos FC": ["Escuriola", "Raúl", "Gabi", "Manolo", "Jorge"]
    },
    events: [
      { minute: 7, type: "goal", team: "Amarillos FC", player: "Gabi", assist: "Raúl" },
      { minute: 14, type: "save", team: "Rosas FC", player: "Gómez", detail: "1v1 al borde del area" },
      { minute: 18, type: "goal", team: "Amarillos FC", player: "Manolo", assist: "Jorge" },
      { minute: 26, type: "goal", team: "Rosas FC", player: "Edu" },
      { minute: 31, type: "goal", team: "Amarillos FC", player: "Raúl", assist: "Gabi" }
    ],
    report: "Amarillos muy solidos. Combinaciones rapidas entre Raul, Gabi y Jorge marcaron diferencias."
  }
];

export const playerHistories = {
  "1": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC", result: "5-3", rating: 9.0, saves: 1, cleanSheet: false },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 8.2, saves: 0, cleanSheet: false }
  ],
  "2": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC", result: "5-3", rating: 8.9, goals: 1, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.8, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC", result: "3-1", rating: 8.6, goals: 1, assists: 1 }
  ],
  "3": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC", result: "3-5", rating: 7.6, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC", result: "3-1", rating: 8.1, assists: 2 }
  ],
  "4": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC", result: "5-3", rating: 7.9, goals: 1, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.4, assists: 1 }
  ],
  "5": [
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.6, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC", result: "3-1", rating: 7.9, goals: 1 }
  ],
  "6": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC", result: "3-5", rating: 7.8, saves: 3, cleanSheet: false },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 8.5, saves: 1, cleanSheet: false },
    { matchId: "m3", date: "2025-10-22", team: "Rosas FC", opponent: "Amarillos FC", result: "1-3", rating: 8.0, saves: 2, cleanSheet: false }
  ],
  "7": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC", result: "5-3", rating: 8.4, goals: 1, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 8.2, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Rosas FC", opponent: "Amarillos FC", result: "1-3", rating: 7.5, goals: 1 }
  ],
  "8": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC", result: "3-5", rating: 7.4, goals: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.2 },
    { matchId: "m3", date: "2025-10-22", team: "Rosas FC", opponent: "Amarillos FC", result: "1-3", rating: 7.1 }
  ],
  "9": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC", result: "5-3", rating: 8.0, goals: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 7.9, assists: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC", result: "3-1", rating: 8.3, assists: 1 }
  ],
  "10": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC", result: "3-5", rating: 7.5, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 7.8, goals: 1 }
  ]
};

/**
 * Algoritmo de valoración (0–1000):
 * - PORTERO:  value = 2*PTS + 5*SAV + 20*CS + 10*AST
 * - CAMPO:    value = 2*PTS + 30*GOL + 18*AST
 * Luego se redondea y se limita a [0, 1000].
 * Notas:
 *  - Con estos pesos, Escuriola ≈ 611 (128*2 + 47*5 + 5*20 + 2*10), cercano a 609.
 *  - Ajusta pesos si quieres calibrar más fino.
 */
export function computePlayerValue(p) {
  const pts = Number(p.totalPoints ?? 0);
  const g = Number(p.stats?.goals ?? 0);
  const a = Number(p.stats?.assists ?? 0);
  const sav = Number(p.stats?.saves ?? 0);
  const cs = Number(p.stats?.cleanSheets ?? 0);
  const pos = String(p.position || "").toLowerCase();
  const isGK = pos.includes("portero") || pos === "gk" || pos.includes("goalkeeper");

  let raw;
  if (isGK) raw = 2 * pts + 5 * sav + 20 * cs + 10 * a;
  else raw = 2 * pts + 30 * g + 18 * a;

  const clamped = Math.max(0, Math.min(1000, Math.round(raw)));
  return clamped;
}

/** Ayudante: devuelve players con { value } ya calculado */
export function playersWithValue() {
  return players.map((p) => ({ ...p, value: computePlayerValue(p) }));
}