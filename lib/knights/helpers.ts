export function isKnightMove(x1: number, y1: number, x2: number, y2: number): boolean {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
}

export function getKnightMoves(x: number, y: number, boardSize: number): number[][] {
  const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  return deltas
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([nx, ny]) => nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize);
}

export function isStuck(x: number, y: number, boardSize: number, visited: Set<string>): boolean {
  return getKnightMoves(x, y, boardSize).every(
    ([nx, ny]) => visited.has(`${nx},${ny}`)
  );
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function colToLetter(col: number): string {
  return String.fromCharCode(97 + col);
}