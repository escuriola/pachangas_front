
// Simple dummy dataset for players and matches

export const players = [
  {
    id: "1",
    name: "Iker Casillas",
    position: "POR",
    team: "Pachangas FC",
    nationality: "🇪🇸",
    age: 34,
    height: 185,
    weight: 79,
    foot: "Right",
    value: 6_500_000,
    totalPoints: 124,
    matches: 18,
    goals: 0,
    assists: 1,
    saves: 72,
    cleanSheets: 9,
    image: "/apple-icon.png",
    recentForm: ["7.5","6.8","8.4","7.1","9.0"],
    history: [
      { id: "m1", date: "2025-09-12", opponent: "Barrio United", result: "2-0", rating: 8.2, saves: 7, cleanSheet: true },
      { id: "m2", date: "2025-09-20", opponent: "Los Galácticos", result: "1-1", rating: 7.0, saves: 3, cleanSheet: false },
      { id: "m3", date: "2025-10-05", opponent: "Atlético Vecinos", result: "0-0", rating: 7.8, saves: 5, cleanSheet: true },
    ],
  },
  {
    id: "9",
    name: "Leo Pachanga",
    position: "DEL",
    team: "Pachangas FC",
    nationality: "🇪🇸",
    age: 28,
    height: 172,
    weight: 70,
    foot: "Left",
    value: 12_300_000,
    totalPoints: 168,
    matches: 18,
    goals: 16,
    assists: 7,
    saves: 0,
    cleanSheets: 0,
    image: "/apple-icon.png",
    recentForm: ["9.4","8.7","6.2","10.0","7.9"],
    history: [
      { id: "m1", date: "2025-09-12", opponent: "Barrio United", result: "2-0", rating: 8.9, goals: 1, assists: 1 },
      { id: "m2", date: "2025-09-20", opponent: "Los Galácticos", result: "1-1", rating: 7.1, goals: 0, assists: 0 },
      { id: "m3", date: "2025-10-05", opponent: "Atlético Vecinos", result: "0-0", rating: 6.8, goals: 0, assists: 0 },
    ],
  },
];

export const matches = [
  {
    id: "m1",
    date: "2025-09-12",
    home: "Pachangas FC",
    away: "Barrio United",
    score: "2-0",
    events: [
      { minute: 17, type: "goal", team: "Pachangas FC", player: "Leo Pachanga", assist: "Miguelito", bodyPart: "Left foot" },
      { minute: 52, type: "goal", team: "Pachangas FC", player: "Miguelito", assist: "Leo Pachanga", bodyPart: "Header" },
      { minute: 65, type: "save", team: "Pachangas FC", player: "Iker Casillas", detail: "One-on-one stop" },
    ],
    lineup: {
      "Pachangas FC": ["Iker Casillas", "Juan", "Paco", "Luigi", "Marco", "Miguelito", "Sergi", "Álex", "Dani", "Leo Pachanga", "Toni"],
      "Barrio United": ["Tomás", "Javi", "Pedro", "Rafa", "Iván", "Óscar", "Luis", "Óliver", "Jorge", "Mario", "Rubén"],
    },
    report: "Partido dominado por Pachangas FC, presión alta y dos golpes certeros. Casillas salvó el 2-1 con una parada clave en el 65'.",
  },
  {
    id: "m2",
    date: "2025-09-20",
    home: "Los Galácticos",
    away: "Pachangas FC",
    score: "1-1",
    events: [
      { minute: 34, type: "goal", team: "Los Galácticos", player: "Cristo", assist: "James" },
      { minute: 71, type: "goal", team: "Pachangas FC", player: "Leo Pachanga", assist: "Miguelito" },
    ],
    lineup: {
      "Los Galácticos": ["Pepe", "Ramos", "Marcelo", "James", "Casemiro", "Isco", "Cristo", "Benz", "Kroos", "Carva", "Keylor"],
      "Pachangas FC": ["Iker Casillas", "Juan", "Paco", "Luigi", "Marco", "Miguelito", "Sergi", "Álex", "Dani", "Leo Pachanga", "Toni"],
    },
    report: "Intercambio de golpes con un reparto justo de puntos. Leo empató tras una gran combinación con Miguelito.",
  },
];
