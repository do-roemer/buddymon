import type { FighterStats, RawAggregate, BuddyBaseStats, FighterClass } from "./types.js";
import { CLASS_GROWTH_RATES } from "./constants.js";
import { MAX_LEVEL } from "./progression.js";

function clamp(min: number, val: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function sigmoid(x: number, midpoint: number, steepness: number): number {
  return 100 / (1 + Math.exp(-steepness * (x - midpoint)));
}

// ── Base stats → Fighter stats mapping ───────────────────────────────
// Buddy base stats (0-100):  DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK
// Fighter stats:              HP,        DEF,      ATK,   SPD,   CRIT
//
// The base stats set the floor (60% weight), usage data adds on top (40% weight).

function baseToFighter(base: BuddyBaseStats): {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critBase: number;
} {
  return {
    hp: Math.round(80 + (base.patience / 100) * 140),      // PATIENCE → HP (80-220 base)
    defense: Math.round(base.debugging * 0.6),               // DEBUGGING → DEF (0-60 base)
    attack: Math.round(base.chaos * 0.6),                    // CHAOS → ATK (0-60 base)
    speed: Math.round(base.wisdom * 0.6),                    // WISDOM → SPD (0-60 base)
    critBase: Math.round(5 + (base.snark / 100) * 15),      // SNARK → CRIT (5-20 base)
  };
}

export function computeStats(
  aggregate: RawAggregate,
  baseStats?: BuddyBaseStats,
): FighterStats {
  const {
    totalMessages,
    totalSessions,
    totalToolCalls,
    totalSessionsFromMeta,
    avgSessionDuration,
    outcomeScores,
    helpfulnessScores,
    lateNightSessions,
  } = aggregate;

  const sessionCount = totalSessionsFromMeta || 1;

  // If we have base stats, use them as foundation
  if (baseStats) {
    const base = baseToFighter(baseStats);

    // Usage bonuses (40% contribution, scaled 0-40)
    const rawHp = totalMessages + totalSessions * 10;
    const hpBonus = clamp(0, Math.floor(rawHp / 500), 80);

    const toolsPerSession = totalToolCalls / sessionCount;
    const atkBonus = clamp(0, Math.round(sigmoid(toolsPerSession, 15, 0.15) * 0.4), 40);

    const avgOutcome = outcomeScores.length > 0
      ? outcomeScores.reduce((a, b) => a + b, 0) / outcomeScores.length
      : 1.5;
    const defBonus = clamp(0, Math.round((avgOutcome / 3) * 40), 40);

    const spdBonus = clamp(0, Math.round(
      avgSessionDuration > 0
        ? sigmoid(1 / avgSessionDuration, 0.05, 40) * 0.4
        : 20,
    ), 40);

    const streak = computeLongestStreak(aggregate.dailyActivity);
    const critBonus = clamp(0, streak, 10);

    const hp = clamp(80, base.hp + hpBonus, 300);
    const attack = clamp(1, base.attack + atkBonus, 100);
    const defense = clamp(1, base.defense + defBonus, 100);
    const speed = clamp(1, base.speed + spdBonus, 100);
    const critChance = clamp(5, base.critBase + critBonus, 30);

    const rageMode =
      sessionCount > 0 ? lateNightSessions / sessionCount > 0.15 : false;

    return { hp, attack, defense, speed, critChance, rageMode };
  }

  // Fallback: pure usage-based (no base stats available)
  const rawHp = totalMessages + totalSessions * 10;
  const hp = clamp(80, Math.floor(rawHp / 200) + 80, 300);

  const toolsPerSession = totalToolCalls / sessionCount;
  const attack = clamp(1, Math.round(sigmoid(toolsPerSession, 15, 0.15)), 100);

  const avgOutcome = outcomeScores.length > 0
    ? outcomeScores.reduce((a, b) => a + b, 0) / outcomeScores.length
    : 1.5;
  const avgHelpfulness = helpfulnessScores.length > 0
    ? helpfulnessScores.reduce((a, b) => a + b, 0) / helpfulnessScores.length
    : 1.5;
  const defense = clamp(1, Math.round((avgOutcome / 3) * 80 + (avgHelpfulness / 4) * 20), 100);

  const speed = clamp(1, Math.round(
    avgSessionDuration > 0 ? sigmoid(1 / avgSessionDuration, 0.05, 40) : 50,
  ), 100);

  const streak = computeLongestStreak(aggregate.dailyActivity);
  const critChance = clamp(5, 5 + streak * 2, 30);

  const rageMode =
    sessionCount > 0 ? lateNightSessions / sessionCount > 0.15 : false;

  return { hp, attack, defense, speed, critChance, rageMode };
}

export function computeLevel(totalSessions: number): number {
  return clamp(1, Math.floor(totalSessions / 7), 50);
}

// ── Level-based stat computation (XP progression system) ────────────
// Base stats scale with level: Level 1 gets 10% of base, Level 50 gets 100%.
// Growth per level is added on top. This keeps Level 1 weak and rewards leveling.
export function computeStatsFromLevel(
  level: number,
  fighterClass: FighterClass,
  baseStats: BuddyBaseStats,
  lateNightRatio: number,
): FighterStats {
  const base = baseToFighter(baseStats);
  const growth = CLASS_GROWTH_RATES[fighterClass];

  // Level scaling: 10% at L1, 100% at max level
  const s = 0.1 + 0.9 * ((level - 1) / (MAX_LEVEL - 1));

  const hp = clamp(80, Math.round(80 + (base.hp - 80) * s + level * growth.hp), 300);
  const attack = clamp(1, Math.round(base.attack * s + level * growth.attack), 100);
  const defense = clamp(1, Math.round(base.defense * s + level * growth.defense), 100);
  const speed = clamp(1, Math.round(base.speed * s + level * growth.speed), 100);
  const critChance = clamp(5, Math.round(5 + (base.critBase - 5) * s + level * growth.crit), 30);
  const rageMode = lateNightRatio > 0.15;

  return { hp, attack, defense, speed, critChance, rageMode };
}

function computeLongestStreak(
  dailyActivity: { date: string }[],
): number {
  if (dailyActivity.length === 0) return 0;

  const dates = dailyActivity
    .map((d) => new Date(d.date).getTime())
    .sort((a, b) => a - b);

  const uniqueDays = [...new Set(dates)];
  const ONE_DAY = 86400000;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = uniqueDays[i] - uniqueDays[i - 1];
    if (diff <= ONE_DAY) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}
