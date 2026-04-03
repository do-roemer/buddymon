import * as crypto from "node:crypto";
import * as os from "node:os";
import type { FighterCard, RawAggregate, BodyType, ProgressionState } from "./types.js";
import { CLASS_PASSIVES } from "./constants.js";
import { resolveClass } from "./class-resolver.js";
import { computeStats, computeLevel, computeStatsFromLevel } from "./stats-computer.js";
import { resolveMoves } from "./move-resolver.js";
import { generateTitle } from "./name-generator.js";
import { readCompanion } from "./companion.js";

const HMAC_KEY = "buddymon-v1";

function computeOwnerHash(): string {
  const hostname = os.hostname();
  const username = os.userInfo().username;
  return crypto
    .createHash("sha256")
    .update(`${hostname}:${username}`)
    .digest("hex");
}

function getFavoriteHour(hourCounts: Record<string, number>): number {
  let maxCount = 0;
  let favoriteHour = 12;
  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteHour = parseInt(hour, 10);
    }
  }
  return favoriteHour;
}

function getDominantLanguage(
  languageTotals: Record<string, number>,
): string {
  let max = 0;
  let dominant = "TypeScript";
  for (const [lang, count] of Object.entries(languageTotals)) {
    if (count > max) {
      max = count;
      dominant = lang;
    }
  }
  return dominant;
}

function signCard(card: Omit<FighterCard, "signature">): string {
  const payload = JSON.stringify(card);
  return crypto
    .createHmac("sha256", HMAC_KEY)
    .update(payload)
    .digest("hex");
}

export function verifySignature(card: FighterCard): boolean {
  const { signature, ...rest } = card;
  return signCard(rest) === signature;
}

export function buildFighterCard(aggregate: RawAggregate, terminalTamer: string, progression?: ProgressionState): FighterCard {
  const ownerHash = computeOwnerHash();
  const companion = readCompanion();
  const fighterClass = resolveClass(aggregate);
  const baseStats = companion.baseStats;

  // Use progression-based stats if available, otherwise fall back to legacy
  const lateNightRatio = aggregate.totalSessionsFromMeta > 0
    ? aggregate.lateNightSessions / aggregate.totalSessionsFromMeta
    : 0;
  const level = progression
    ? progression.level
    : computeLevel(aggregate.totalSessions);
  const stats = progression && baseStats
    ? computeStatsFromLevel(level, fighterClass, baseStats, lateNightRatio)
    : computeStats(aggregate, baseStats);
  const moves = resolveMoves(aggregate.toolTotals);
  const passive = CLASS_PASSIVES[fighterClass];
  const favoriteHour = getFavoriteHour(aggregate.hourCounts);
  const dominantLanguage = getDominantLanguage(aggregate.languageTotals);
  const title = generateTitle(fighterClass, ownerHash, favoriteHour);
  const species = companion.species ?? "blob";

  // Sprite key based on species
  const spriteKey = species;

  // Randomly decide biped or quadruped (seeded from ownerHash for consistency)
  const bodyTypeSeed = parseInt(ownerHash.slice(0, 8), 16);
  const bodyType: BodyType = bodyTypeSeed % 2 === 0 ? "biped" : "quadruped";

  const cardWithoutSig = {
    version: 1 as const,
    buddyName: companion.name,
    terminalTamer,
    species,
    personality: companion.personality,
    baseStats,
    ownerHash,
    class: fighterClass,
    level,
    title,
    stats,
    moves,
    passive,
    spriteKey,
    rarity: companion.rarity ?? "common",
    eye: companion.eye ?? "\u00b7",
    hat: companion.hat ?? "none",
    shiny: companion.shiny ?? false,
    bodyType,
    dominantLanguage,
    favoriteHour,
    totalSessions: aggregate.totalSessions,
    ...(progression ? { xp: progression.currentXP, totalXPEarned: progression.totalXPEarned } : {}),
    generatedAt: new Date().toISOString(),
  };

  const signature = signCard(cardWithoutSig);

  return { ...cardWithoutSig, signature };
}
