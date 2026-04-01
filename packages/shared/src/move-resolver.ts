import type { Move, MoveType } from "./types.js";
import { MOVE_CATALOG } from "./constants.js";
import { computeToolGroupDistribution } from "./class-resolver.js";

export function resolveMoves(
  toolTotals: Record<string, number>,
): [Move, Move, Move, Move] {
  const dist = computeToolGroupDistribution(toolTotals);

  // Rank groups by count descending (exclude debug — it's a derived type)
  const groups: [MoveType, number][] = [
    ["read", dist.read],
    ["write", dist.write],
    ["bash", dist.bash],
    ["agent", dist.agent],
    ["debug", dist.debug],
  ];
  groups.sort((a, b) => b[1] - a[1]);

  // Get top 3 groups (with fallback to ensure we always have 3)
  const topGroups = groups.slice(0, 3).map((g) => g[0]);

  // If a group has 0 usage, replace with a default
  while (topGroups.length < 3) {
    const missing = (["read", "write", "bash", "agent", "debug"] as MoveType[]).find(
      (t) => !topGroups.includes(t),
    );
    if (missing) topGroups.push(missing);
    else break;
  }

  const moves: Move[] = [];
  const catalog = MOVE_CATALOG;

  // From top group: pick highest-power move + one utility move (has effect)
  const topMoves = catalog[topGroups[0]];
  const highPower = [...topMoves].sort((a, b) => b.power - a.power)[0];
  const utility = topMoves.find((m) => m.effect != null && m !== highPower);
  moves.push(highPower);
  if (utility) moves.push(utility);

  // From 2nd group: pick medium-power move
  const secondMoves = catalog[topGroups[1]];
  const sorted2 = [...secondMoves].sort((a, b) => b.power - a.power);
  const medium = sorted2[Math.floor(sorted2.length / 2)];
  moves.push(medium);

  // From 3rd group: pick highest-accuracy move
  const thirdMoves = catalog[topGroups[2]];
  const highAcc = [...thirdMoves].sort((a, b) => b.accuracy - a.accuracy)[0];
  moves.push(highAcc);

  // Ensure exactly 4 moves (fill with top group if needed)
  while (moves.length < 4) {
    const remaining = topMoves.find((m) => !moves.includes(m));
    if (remaining) moves.push(remaining);
    else moves.push(topMoves[0]);
  }

  return [moves[0], moves[1], moves[2], moves[3]];
}
