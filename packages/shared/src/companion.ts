import * as fs from "node:fs";
import * as path from "node:path";
import type { Companion, BuddySpecies, BuddyBaseStats, BuddyRarity, BuddyEye, BuddyHat } from "./types.js";
import { BUDDY_SPECIES, BUDDY_EYES, BUDDY_HATS } from "./types.js";

const CLAUDE_JSON_PATH = path.join(
  process.env.HOME ?? process.env.USERPROFILE ?? "~",
  ".claude.json",
);

const BUDDY_SALT = "friend-2026-401";

// ── Mulberry32 PRNG (same as Claude Code uses) ──────────────────────
function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── FNV-1a hash ─────────────────────────────────────────────────────
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// ── Rarity ──────────────────────────────────────────────────────────
const RARITY_WEIGHTS: Record<BuddyRarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
};

const RARITY_ORDER: BuddyRarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

const RARITY_FLOORS: Record<BuddyRarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 25,
  epic: 35,
  legendary: 50,
};

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function rollRarity(rng: () => number): BuddyRarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (const rarity of RARITY_ORDER) {
    r -= RARITY_WEIGHTS[rarity];
    if (r < 0) return rarity;
  }
  return "common";
}

// ── Roll buddy stats (matching Claude Code algorithm) ────────────────
function rollStats(rng: () => number, rarity: BuddyRarity): BuddyBaseStats {
  const floor = RARITY_FLOORS[rarity];
  const statNames = ["debugging", "patience", "chaos", "wisdom", "snark"] as const;

  const peakIdx = Math.floor(rng() * 5);
  let dumpIdx = Math.floor(rng() * 5);
  while (dumpIdx === peakIdx) {
    dumpIdx = Math.floor(rng() * 5);
  }

  const stats: Record<string, number> = {};
  for (let i = 0; i < statNames.length; i++) {
    if (i === peakIdx) {
      stats[statNames[i]] = Math.min(100, floor + 50 + Math.floor(rng() * 30));
    } else if (i === dumpIdx) {
      stats[statNames[i]] = Math.max(1, floor - 10 + Math.floor(rng() * 15));
    } else {
      stats[statNames[i]] = floor + Math.floor(rng() * 40);
    }
  }

  return stats as unknown as BuddyBaseStats;
}

// ── Full companion roll (exact Claude Code order) ────────────────────
// Roll order: rarity → species → eye → hat → shiny → stats
interface CompanionBones {
  rarity: BuddyRarity;
  species: BuddySpecies;
  eye: BuddyEye;
  hat: BuddyHat;
  shiny: boolean;
  baseStats: BuddyBaseStats;
}

function rollCompanion(accountId: string): CompanionBones {
  const hash = fnv1a(accountId + BUDDY_SALT);
  const rng = mulberry32(hash);

  const rarity = rollRarity(rng);
  const species = pick(rng, BUDDY_SPECIES);
  const eye = pick(rng, BUDDY_EYES);
  const hat: BuddyHat = rarity === "common" ? "none" : pick(rng, BUDDY_HATS);
  const shiny = rng() < 0.01;
  const baseStats = rollStats(rng, rarity);

  return { rarity, species, eye, hat, shiny, baseStats };
}

// ── Species detection (fallback if no species from PRNG) ─────────────
const SPECIES_KEYWORDS: Record<BuddySpecies, string[]> = {
  duck: ["duck"],
  goose: ["goose"],
  cat: ["cat", "feline", "kitten"],
  rabbit: ["rabbit", "bunny"],
  owl: ["owl"],
  penguin: ["penguin"],
  turtle: ["turtle", "tortoise"],
  snail: ["snail"],
  dragon: ["dragon"],
  octopus: ["octopus", "tentacle"],
  axolotl: ["axolotl"],
  ghost: ["ghost", "spectral", "phantom"],
  robot: ["robot", "mechanical", "automaton"],
  blob: ["blob", "amorphous", "slime"],
  cactus: ["cactus", "prickly", "succulent"],
  mushroom: ["mushroom", "fungus", "fungi"],
  chonk: ["chonk", "rotund", "chunky"],
  capybara: ["capybara"],
};

function detectSpecies(personality: string): BuddySpecies {
  const lower = personality.toLowerCase();
  for (const species of BUDDY_SPECIES) {
    const keywords = SPECIES_KEYWORDS[species];
    if (keywords.some((kw) => lower.includes(kw))) {
      return species;
    }
  }
  return "blob";
}

export function readCompanion(): Companion {
  try {
    const raw = fs.readFileSync(CLAUDE_JSON_PATH, "utf-8");
    const data = JSON.parse(raw);
    const comp = data.companion;

    if (!comp || !comp.name) {
      return { name: "Buddy", species: "blob", rarity: "common", eye: "\u00b7", hat: "none", shiny: false };
    }

    const accountId = data.anonymousId ?? data.userId ?? data.accountId ?? comp.name;
    const bones = rollCompanion(accountId);

    // Use species from companion data if set, otherwise from PRNG roll
    const species = comp.species ?? detectSpecies(comp.personality ?? "") ?? bones.species;

    return {
      name: comp.name,
      personality: comp.personality,
      species,
      hatchedAt: comp.hatchedAt,
      baseStats: bones.baseStats,
      rarity: bones.rarity,
      eye: bones.eye,
      hat: bones.hat,
      shiny: bones.shiny,
    };
  } catch {
    return { name: "Buddy", species: "blob", rarity: "common", eye: "\u00b7", hat: "none", shiny: false };
  }
}
