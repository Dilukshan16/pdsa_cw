const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface StartGameResponse {
  boardSize: number;
  startX: number;
  startY: number;
  gameId: string;
}

export interface ValidateMoveResponse {
  valid: boolean;
  message: string;
}

export interface SolutionResponse {
  id: number;
  playerName: string;
  boardSize: number;
  startX: number;
  startY: number;
  moves: number[][];
  solvedAt: string;
  timeTakenSeconds: number;
}

export interface LeaderboardEntry {
  playerId: number;
  playerName: string;
  boardSize: number;
  timeTakenSeconds: number;
  solvedAt: string;
}

export interface HintResponse {
  suggestedX: number;
  suggestedY: number;
  algorithm: string;
  fullSolution: number[][];
}

export const knightsApi = {

  startGame: async (boardSize: number): Promise<StartGameResponse> => {
    const res = await fetch(`${BASE_URL}/api/knights/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardSize }),
    });
    if (!res.ok) throw new Error('Failed to start game');
    return res.json();
  },

  validateMove: async (
    boardSize: number,
    fromX: number, fromY: number,
    toX: number, toY: number
  ): Promise<ValidateMoveResponse> => {
    const res = await fetch(`${BASE_URL}/api/knights/validate-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardSize, fromX, fromY, toX, toY }),
    });
    if (!res.ok) throw new Error('Failed to validate move');
    return res.json();
  },

  submitSolution: async (
    playerName: string,
    boardSize: number,
    startX: number,
    startY: number,
    moves: number[][],
    timeTakenSeconds: number
  ): Promise<SolutionResponse> => {
    const res = await fetch(`${BASE_URL}/api/knights/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, boardSize, startX, startY, moves, timeTakenSeconds }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit solution');
    }
    return res.json();
  },

  getHint: async (
    boardSize: number,
    currentX: number,
    currentY: number,
    algorithm: string = 'WARNSDORFF'
  ): Promise<HintResponse> => {
    const res = await fetch(`${BASE_URL}/api/knights/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardSize, currentX, currentY, algorithm }),
    });
    if (!res.ok) throw new Error('Failed to get hint');
    return res.json();
  },

  getLeaderboard: async (boardSize: number = 8): Promise<LeaderboardEntry[]> => {
    const res = await fetch(`${BASE_URL}/api/knights/leaderboard?boardSize=${boardSize}`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  },

  solveBoth: async (
    boardSize: number,
    startX: number,
    startY: number
  ): Promise<Record<string, number[][]>> => {
    const res = await fetch(
      `${BASE_URL}/api/knights/solve?boardSize=${boardSize}&startX=${startX}&startY=${startY}`
    );
    if (!res.ok) throw new Error('Failed to solve');
    return res.json();
  },
};