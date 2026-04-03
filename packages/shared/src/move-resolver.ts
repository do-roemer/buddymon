import type { Move, MoveType, FighterClass } from "./types.js";
import { MOVE_CATALOG, SIGNATURE_MOVES } from "./constants.js";
import { computeToolGroupDistribution } from "./class-resolver.js";

// Class → primary move type (for guaranteed STAB move)
const CLASS_TYPE: Record<FighterClass, MoveType> = {
  explorer: "read",
  builder: "write",
  commander: "bash",
  architect: "agent",
  debugger: "debug",
};

export function resolveMoves(
  toolTotals: Record<string, number>,
  fighterClass?: FighterClass,
): Move[] {
  const dist = computeToolGroupDistribution(toolTotals);

  // Rank groups by count descending
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

  while (topGroups.length < 3) {
    const missing = (["read", "write", "bash", "agent", "debug"] as MoveType[]).find(
      (t) => !topGroups.includes(t),
    );
    if (missing) topGroups.push(missing);
    else break;
  }

  const moves: Move[] = [];
  const catalog = MOVE_CATALOG;

  // Move 1: always a class-type move (highest power) for guaranteed STAB
  const classType = fighterClass ? CLASS_TYPE[fighterClass] : topGroups[0];
  const classMoves = catalog[classType];
  const classHighPower = [...classMoves].sort((a, b) => b.power - a.power)[0];
  moves.push(classHighPower);

  // Move 2: utility move from class type (has effect), or from top group
  const classUtility = classMoves.find((m) => m.effect != null && m !== classHighPower);
  if (classUtility) {
    moves.push(classUtility);
  } else {
    const topMoves = catalog[topGroups[0]];
    const fallback = topMoves.find((m) => m.effect != null && m !== classHighPower)
      ?? topMoves.find((m) => m !== classHighPower)
      ?? topMoves[0];
    moves.push(fallback);
  }

  // Move 3: from 2nd group — medium-power move
  const secondType = topGroups.find((t) => t !== classType) ?? topGroups[1];
  const secondMoves = catalog[secondType];
  const sorted2 = [...secondMoves].sort((a, b) => b.power - a.power);
  const medium = sorted2[Math.floor(sorted2.length / 2)];
  moves.push(medium);

  // Move 4: from 3rd group — highest-accuracy move
  const thirdType = topGroups.find((t) => t !== classType && t !== secondType) ?? topGroups[2];
  const thirdMoves = catalog[thirdType];
  const highAcc = [...thirdMoves].sort((a, b) => b.accuracy - a.accuracy)[0];
  moves.push(highAcc);

  // Ensure exactly 4 (shouldn't be needed but just in case)
  while (moves.length < 4) {
    const remaining = classMoves.find((m) => !moves.includes(m));
    if (remaining) moves.push(remaining);
    else moves.push(classMoves[0]);
  }

  const result: Move[] = [moves[0], moves[1], moves[2], moves[3]];

  // Signature move (5th slot, unlocked at level 25)
  if (fighterClass && SIGNATURE_MOVES[fighterClass]) {
    result.push(SIGNATURE_MOVES[fighterClass]);
  }

  return result;
}
