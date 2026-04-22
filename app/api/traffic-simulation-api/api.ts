const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/traffic-simulation";

export interface EdgeDTO {
  from: string;
  to: string;
  capacity: number;
}

export interface GameState {
  roundId: string;
  nodes: string[];
  edges: EdgeDTO[];
  capacities: Record<string, number>;
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: number;
  playerAnswer: number;
  fordFulkersonTimeMs: number;
  edmondsKarpTimeMs: number;
  outcome: "WIN" | "LOSE";
  playerName: string;
}

export interface LeaderboardEntry {
  name: string;
  correctAnswers: number;
  totalRounds: number;
}

export async function fetchNewRound(): Promise<GameState> {
  const res = await fetch(`${BASE}/new-round`);
  if (!res.ok) throw new Error("Failed to start new round");
  return res.json();
}

export async function submitAnswer(
  playerName: string,
  roundId: string,
  playerAnswer: number
): Promise<AnswerResult> {
  
  // Debug log — remove after fixing
  console.log("Submitting:", { playerName, roundId, playerAnswer });

  const res = await fetch(`${BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      playerName,   // must match @JsonProperty exactly
      roundId, 
      playerAnswer  // must match @JsonProperty exactly
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Submission failed");
  }
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${BASE}/leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}