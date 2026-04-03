// ── XP Progression System ───────────────────────────────────────────
// XP needed for level N = floor(200 * 1.2^(N-1))
// Tokens convert to XP at XP_PER_TOKEN rate.

const BASE_XP = 200;
const GROWTH_FACTOR = 1.2;
export const MAX_LEVEL = 100;
export const XP_PER_TOKEN = 0.001; // 1 XP per 1000 tokens

/** XP needed to go from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  if (level < 1 || level >= MAX_LEVEL) return Infinity;
  return Math.floor(BASE_XP * Math.pow(GROWTH_FACTOR, level - 1));
}

/** Total XP needed to reach a given level (from level 1). */
export function cumulativeXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/** Derive the current level from total XP earned. */
export function levelFromXP(totalXP: number): number {
  let level = 1;
  let remaining = totalXP;
  while (level < MAX_LEVEL) {
    const needed = xpForLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
  }
  return level;
}

/** XP remaining toward the next level. */
export function currentLevelXP(totalXP: number): number {
  let remaining = totalXP;
  let level = 1;
  while (level < MAX_LEVEL) {
    const needed = xpForLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
  }
  return remaining;
}

/** Convert raw token count to XP. */
export function tokensToXP(tokens: number): number {
  return Math.floor(tokens * XP_PER_TOKEN);
}
