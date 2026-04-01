import * as crypto from "node:crypto";
import * as os from "node:os";
import type { FighterCard, RawAggregate } from "./types.js";
import { CLASS_PASSIVES } from "./constants.js";
import { resolveClass } from "./class-resolver.js";
import { computeStats, computeLevel } from "./stats-computer.js";
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

export function buildFighterCard(aggregate: RawAggregate, terminalTamer: string): FighterCard {
  const ownerHash = computeOwnerHash();
  const companion = readCompanion();
  const fighterClass = resolveClass(aggregate);
  const baseStats = companion.baseStats;
  const stats = computeStats(aggregate, baseStats);
  const level = computeLevel(aggregate.totalSessions);
  const moves = resolveMoves(aggregate.toolTotals);
  const passive = CLASS_PASSIVES[fighterClass];
  const favoriteHour = getFavoriteHour(aggregate.hourCounts);
  const dominantLanguage = getDominantLanguage(aggregate.languageTotals);
  const title = generateTitle(fighterClass, ownerHash, favoriteHour);
  const species = companion.species ?? "blob";

  // Sprite key based on species
  const spriteKey = species;

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
    dominantLanguage,
    favoriteHour,
    totalSessions: aggregate.totalSessions,
    generatedAt: new Date().toISOString(),
  };

  const signature = signCard(cardWithoutSig);

  return { ...cardWithoutSig, signature };
}
