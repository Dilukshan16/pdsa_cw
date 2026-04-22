const BASE = process.env.NEXT_PUBLIC_SL_API_URL 
  || 'http://localhost:8080/api/snakeladder';

export interface GameDataSL {
  gameId: string;
  playerName: string;
  boardSize: number;
  snakes: Record<string, number>;
  ladders: Record<string, number>;
  choices: number[];
}

export interface GameResultSL {
  minDiceThrows: number;
  userGuess: number;
  correct: boolean;
  algorithmTimes: { BFS: number; Dijkstra: number };
  message: string;
}

export interface ComparisonRecord {
  gameId: number;
  playerName: string | null;
  createdAt: string;
  algorithmTimes: { BFS: number; Dijkstra: number };
}

export interface ComparisonData {
  games: ComparisonRecord[];
  averages: { BFS: number; Dijkstra: number };
  count: number;
}

export async function startGame(
  playerName: string,
  boardSize: number
): Promise<GameDataSL> {
  const res = await fetch(`${BASE}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName, boardSize }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function solveGame(
  gameId: string,
  userGuess: number
): Promise<GameResultSL> {
  const res = await fetch(`${BASE}/solve/${gameId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userGuess }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getComparison(): Promise<ComparisonData> {
  const res = await fetch(`${BASE}/comparison`);
  if (!res.ok) throw new Error('Failed to fetch comparison data');
  return res.json();
}