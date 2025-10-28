// Dummy de Pachangas con cromos 3D + stats estilo FIFA
// rarity solo afecta al marco visual (no se muestra texto de rareza)

const R = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const players = [
  { id: "1",  name: "Escuriola", position: "PORTERO", value: 96, totalPoints: 128, matchesPlayed: 12,
    stats: { goals: 0,  assists: 2, saves: 47, cleanSheets: 5 },
    fifa:  { RIT: 60, TIR: 20, PAS: 68, REG: 55, DEF: 40, FIS: 80 },
    recentForm: [9.1,8.5,7.8,8.9,9.4],
    rarity: "gold", photo: "/players/escuriola.jpg", nationality: "🇪🇸", age: 34, supply: 609, supplyTotal: 1000
  },
  { id: "2",  name: "Raúl",      position: "CAMPO", value: 90, totalPoints: 154, matchesPlayed: 14,
    stats: { goals: 11, assists: 7, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 88, TIR: 86, PAS: 84, REG: 89, DEF: 62, FIS: 78 },
    recentForm: [8.2,7.5,9.0,8.8,9.1],
    rarity: R(["gold","silver","bronze"]), photo: "/players/raul.jpg", nationality: "🇪🇸", age: 30, supply: 112, supplyTotal: 1000
  },
  { id: "3",  name: "Gabi",      position: "CAMPO", value: 88, totalPoints: 140, matchesPlayed: 13,
    stats: { goals: 10, assists: 6, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 84, TIR: 82, PAS: 86, REG: 90, DEF: 65, FIS: 76 },
    recentForm: [7.9,8.0,8.7,7.4,8.9],
    rarity: "gold", photo: "/players/gabi.jpg", nationality: "🇪🇸", age: 29, supply: 77, supplyTotal: 1000
  },
  { id: "4",  name: "Kaiser",    position: "CAMPO", value: 84, totalPoints: 121, matchesPlayed: 12,
    stats: { goals: 8,  assists: 5, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 80, TIR: 81, PAS: 78, REG: 82, DEF: 61, FIS: 79 },
    recentForm: [7.1,8.3,8.0,7.6,8.4],
    rarity: R(["gold","silver","bronze"]), photo: "/players/kaiser.jpg", nationality: "🇪🇸", age: 31, supply: 541, supplyTotal: 1000
  },
  { id: "5",  name: "Manolo",    position: "CAMPO", value: 82, totalPoints: 110, matchesPlayed: 12,
    stats: { goals: 7,  assists: 3, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 76, TIR: 80, PAS: 79, REG: 77, DEF: 58, FIS: 82 },
    recentForm: [7.0,7.2,7.8,7.5,8.0],
    rarity: R(["gold","silver","bronze"]), photo: "/players/manolo.jpg", nationality: "🇪🇸", age: 33, supply: 320, supplyTotal: 1000
  },
  { id: "6",  name: "Gómez",     position: "PORTERO", value: 89, totalPoints: 119, matchesPlayed: 13,
    stats: { goals: 0,  assists: 1, saves: 52, cleanSheets: 4 },
    fifa:  { RIT: 56, TIR: 18, PAS: 65, REG: 60, DEF: 42, FIS: 83 },
    recentForm: [8.4,7.8,8.1,8.7,8.9],
    rarity: R(["gold","silver","bronze"]), photo: "/players/gomez.jpg", nationality: "🇪🇸", age: 32, supply: 902, supplyTotal: 1000
  },
  { id: "7",  name: "Edu",       position: "CAMPO", value: 86, totalPoints: 132, matchesPlayed: 14,
    stats: { goals: 9,  assists: 8, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 85, TIR: 79, PAS: 88, REG: 87, DEF: 60, FIS: 80 },
    recentForm: [8.6,8.2,8.9,9.1,8.8],
    rarity: R(["gold","silver","bronze"]), photo: "/players/edu.jpg", nationality: "🇪🇸", age: 28, supply: 15, supplyTotal: 1000
  },
  { id: "8",  name: "Miguel",    position: "CAMPO", value: 80, totalPoints: 99,  matchesPlayed: 11,
    stats: { goals: 6,  assists: 2, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 78, TIR: 75, PAS: 74, REG: 76, DEF: 55, FIS: 77 },
    recentForm: [7.3,7.8,7.2,7.9,7.6],
    rarity: R(["gold","silver","bronze"]), photo: "/players/miguel.jpg", nationality: "🇪🇸", age: 27, supply: 411, supplyTotal: 1000
  },
  { id: "9",  name: "Jorge",     position: "CAMPO", value: 83, totalPoints: 112, matchesPlayed: 12,
    stats: { goals: 7,  assists: 4, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 82, TIR: 78, PAS: 80, REG: 81, DEF: 57, FIS: 79 },
    recentForm: [7.7,8.1,7.9,8.0,8.2],
    rarity: R(["gold","silver","bronze"]), photo: "/players/jorge.jpg", nationality: "🇪🇸", age: 29, supply: 705, supplyTotal: 1000
  },
  { id: "10", name: "Johny",     position: "CAMPO", value: 81, totalPoints: 104, matchesPlayed: 12,
    stats: { goals: 6,  assists: 5, saves: 0,  cleanSheets: 0 },
    fifa:  { RIT: 80, TIR: 77, PAS: 78, REG: 79, DEF: 56, FIS: 78 },
    recentForm: [7.5,7.6,7.9,7.8,8.0],
    rarity: R(["gold","silver","bronze"]), photo: "/players/johny.jpg", nationality: "🇪🇸", age: 30, supply: 990, supplyTotal: 1000
  },
];

// === Partidos e histórico (igual que antes) ===
export const matches = [
  {
    id: "m1",
    date: "2025-10-01",
    teams: { home: "Azules FC", away: "Rosas FC" },
    score: "5-3",
    lineups: {
      "Azules FC": ["Escuriola", "Raúl", "Kaiser", "Edu", "Jorge"],
      "Rosas FC":  ["Gómez", "Gabi", "Manolo", "Miguel", "Johny"],
    },
    events: [
      { minute: 3,  type: "goal", team: "Azules FC",  player: "Raúl",   assist: "Edu" },
      { minute: 6,  type: "goal", team: "Rosas FC",   player: "Gabi" },
      { minute: 11, type: "save", team: "Azules FC",  player: "Escuriola", detail: "Penalti parado" },
      { minute: 15, type: "goal", team: "Azules FC",  player: "Kaiser", assist: "Jorge" },
      { minute: 21, type: "goal", team: "Rosas FC",   player: "Miguel", assist: "Johny" },
      { minute: 28, type: "goal", team: "Azules FC",  player: "Edu",    assist: "Raúl" },
      { minute: 33, type: "goal", team: "Azules FC",  player: "Jorge" },
    ],
    report:
      "Partido vibrante. Escuriola paró un penalti clave; Raúl y Edu lideraron la ofensiva.",
  },
  {
    id: "m2",
    date: "2025-10-12",
    teams: { home: "Amarillos FC", away: "Azules FC" },
    score: "2-2",
    lineups: {
      "Amarillos FC": ["Gómez", "Gabi", "Edu", "Jorge", "Johny"],
      "Azules FC":    ["Escuriola", "Raúl", "Kaiser", "Manolo", "Miguel"],
    },
    events: [
      { minute: 4,  type: "goal", team: "Azules FC",    player: "Raúl" },
      { minute: 9,  type: "save", team: "Amarillos FC", player: "Gómez", detail: "Mano cambiada espectacular" },
      { minute: 17, type: "goal", team: "Amarillos FC", player: "Edu", assist: "Gabi" },
      { minute: 29, type: "goal", team: "Azules FC",    player: "Manolo", assist: "Kaiser" },
      { minute: 36, type: "goal", team: "Amarillos FC", player: "Johny", assist: "Jorge" },
    ],
    report:
      "Igualadísimo. Apariciones decisivas de Gómez y reparto justo de puntos.",
  },
  {
    id: "m3",
    date: "2025-10-22",
    teams: { home: "Rosas FC", away: "Amarillos FC" },
    score: "1-3",
    lineups: {
      "Rosas FC":     ["Gómez", "Kaiser", "Edu", "Miguel", "Johny"],
      "Amarillos FC": ["Escuriola", "Raúl", "Gabi", "Manolo", "Jorge"],
    },
    events: [
      { minute: 7,  type: "goal", team: "Amarillos FC", player: "Gabi", assist: "Raúl" },
      { minute: 14, type: "save", team: "Rosas FC",     player: "Gómez", detail: "1v1 al borde del área" },
      { minute: 18, type: "goal", team: "Amarillos FC", player: "Manolo", assist: "Jorge" },
      { minute: 26, type: "goal", team: "Rosas FC",     player: "Edu" },
      { minute: 31, type: "goal", team: "Amarillos FC", player: "Raúl", assist: "Gabi" },
    ],
    report:
      "Amarillos muy sólidos. Combinaciones rápidas entre Raúl, Gabi y Jorge marcaron diferencias.",
  },
];

export const playerHistories = {
  "1": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC",    opponent: "Rosas FC",    result: "5-3", rating: 9.0, saves: 1, cleanSheet: false },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC",    opponent: "Amarillos FC", result: "2-2", rating: 8.2, saves: 0, cleanSheet: false },
  ],
  "2": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC",    result: "5-3", rating: 8.9, goals: 1, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.8, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC",  result: "3-1", rating: 8.6, goals: 1, assists: 1 },
  ],
  "3": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC",    result: "3-5", rating: 7.6, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC",  result: "3-1", rating: 8.1, assists: 2 },
  ],
  "4": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC",    result: "5-3", rating: 7.9, goals: 1, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.4, assists: 1 },
  ],
  "5": [
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.6, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC",  result: "3-1", rating: 7.9, goals: 1 },
  ],
  "6": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC",    result: "3-5", rating: 7.8, saves: 3, cleanSheet: false },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 8.5, saves: 1, cleanSheet: false },
    { matchId: "m3", date: "2025-10-22", team: "Rosas FC", opponent: "Amarillos FC",  result: "1-3", rating: 8.0, saves: 2, cleanSheet: false },
  ],
  "7": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC",    result: "5-3", rating: 8.4, goals: 1, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 8.2, goals: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Rosas FC", opponent: "Amarillos FC",  result: "1-3", rating: 7.5, goals: 1 },
  ],
  "8": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC",    result: "3-5", rating: 7.4, goals: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Azules FC", opponent: "Amarillos FC", result: "2-2", rating: 7.2 },
    { matchId: "m3", date: "2025-10-22", team: "Rosas FC", opponent: "Amarillos FC",  result: "1-3", rating: 7.1 },
  ],
  "9": [
    { matchId: "m1", date: "2025-10-01", team: "Azules FC", opponent: "Rosas FC",    result: "5-3", rating: 8.0, goals: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 7.9, assists: 1 },
    { matchId: "m3", date: "2025-10-22", team: "Amarillos FC", opponent: "Rosas FC",  result: "3-1", rating: 8.3, assists: 1 },
  ],
  "10": [
    { matchId: "m1", date: "2025-10-01", team: "Rosas FC", opponent: "Azules FC",    result: "3-5", rating: 7.5, assists: 1 },
    { matchId: "m2", date: "2025-10-12", team: "Amarillos FC", opponent: "Azules FC", result: "2-2", rating: 7.8, goals: 1 },
  ],
};