import { z } from "zod";

// ── Fighter Classes ──────────────────────────────────────────────────
export const FIGHTER_CLASSES = [
  "explorer",
  "builder",
  "commander",
  "architect",
  "debugger",
] as const;
export type FighterClass = (typeof FIGHTER_CLASSES)[number];

// ── Move Types ───────────────────────────────────────────────────────
export const MOVE_TYPES = ["read", "write", "bash", "agent", "debug"] as const;
export type MoveType = (typeof MOVE_TYPES)[number];

// ── Move Effects ─────────────────────────────────────────────────────
export const MoveEffectSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("buff"),
    stat: z.enum(["attack", "defense", "speed"]),
    amount: z.number(),
    turns: z.number(),
  }),
  z.object({
    kind: z.literal("debuff"),
    stat: z.enum(["attack", "defense", "speed"]),
    amount: z.number(),
    turns: z.number(),
  }),
  z.object({ kind: z.literal("heal"), percent: z.number() }),
  z.object({
    kind: z.literal("dot"),
    damagePerTurn: z.number(),
    turns: z.number(),
  }),
  z.object({
    kind: z.literal("shield"),
    percent: z.number(),
    turns: z.number(),
  }),
]);
export type MoveEffect = z.infer<typeof MoveEffectSchema>;

// ── Move ─────────────────────────────────────────────────────────────
export const MoveSchema = z.object({
  name: z.string(),
  type: z.enum(MOVE_TYPES),
  power: z.number().min(0).max(150),
  accuracy: z.number().min(0).max(100),
  effect: MoveEffectSchema.optional(),
  description: z.string(),
});
export type Move = z.infer<typeof MoveSchema>;

// ── Passive ──────────────────────────────────────────────────────────
export const PassiveSchema = z.object({
  name: z.string(),
  description: z.string(),
  trigger: z.enum([
    "on_hit",
    "on_crit",
    "on_low_hp",
    "start_of_turn",
    "on_dodge",
  ]),
  effect: MoveEffectSchema,
});
export type Passive = z.infer<typeof PassiveSchema>;

// ── Fighter Stats ────────────────────────────────────────────────────
export const FighterStatsSchema = z.object({
  hp: z.number().min(80).max(300),
  attack: z.number().min(1).max(100),
  defense: z.number().min(1).max(100),
  speed: z.number().min(1).max(100),
  critChance: z.number().min(5).max(30),
  rageMode: z.boolean(),
});
export type FighterStats = z.infer<typeof FighterStatsSchema>;

// ── Buddy Species (from Claude Code) ─────────────────────────────────
export const BUDDY_SPECIES = [
  "duck", "goose", "blob", "cat", "dragon", "octopus", "owl", "penguin",
  "turtle", "snail", "ghost", "axolotl", "capybara", "cactus", "robot",
  "rabbit", "mushroom", "chonk",
] as const;
export type BuddySpecies = (typeof BUDDY_SPECIES)[number];

// ── Buddy Cosmetics (derived from account ID) ──────────────────────
export const BUDDY_RARITIES = ["common", "uncommon", "rare", "epic", "legendary"] as const;
export type BuddyRarity = (typeof BUDDY_RARITIES)[number];

export const BUDDY_EYES = ["\u00b7", "\u2726", "\u00d7", "\u25c9", "@", "\u00b0"] as const;
// ·  ✦  ×  ◉  @  °
export type BuddyEye = (typeof BUDDY_EYES)[number];

export const BUDDY_HATS = ["none", "crown", "tophat", "propeller", "halo", "wizard", "beanie", "tinyduck"] as const;
export type BuddyHat = (typeof BUDDY_HATS)[number];

export const BODY_TYPES = ["biped", "quadruped"] as const;
export type BodyType = (typeof BODY_TYPES)[number];

// ── Buddy Base Stats (from Claude Code's /buddy) ────────────────────
export const BuddyBaseStatsSchema = z.object({
  debugging: z.number().min(0).max(100),
  patience: z.number().min(0).max(100),
  chaos: z.number().min(0).max(100),
  wisdom: z.number().min(0).max(100),
  snark: z.number().min(0).max(100),
});
export type BuddyBaseStats = z.infer<typeof BuddyBaseStatsSchema>;

// ── Companion Info (from ~/.claude.json) ─────────────────────────────
export const CompanionSchema = z.object({
  name: z.string(),
  personality: z.string().optional(),
  species: z.enum(BUDDY_SPECIES).optional(),
  hatchedAt: z.number().optional(),
  baseStats: BuddyBaseStatsSchema.optional(),
  rarity: z.enum(BUDDY_RARITIES).optional(),
  eye: z.string().optional(),
  hat: z.enum(BUDDY_HATS).optional(),
  shiny: z.boolean().optional(),
});
export type Companion = z.infer<typeof CompanionSchema>;

// ── Progression State (XP feeding system) ───────────────────────────
export interface ProgressionState {
  ownerHash: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPEarned: number;
  totalTokensFed: number;
  lastFedAt: string | null;
  claimedSessionIds: string[];
}

// ── Growth Rates per class per level ────────────────────────────────
export interface GrowthRates {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  crit: number;
}

// ── Fighter Card (the portable JSON) ─────────────────────────────────
export const FighterCardSchema = z.object({
  version: z.literal(1),
  buddyName: z.string(),
  terminalTamer: z.string(),
  species: z.enum(BUDDY_SPECIES),
  personality: z.string().optional(),
  baseStats: BuddyBaseStatsSchema.optional(),
  ownerHash: z.string(),
  class: z.enum(FIGHTER_CLASSES),
  level: z.number().min(1).max(100),
  title: z.string(),
  stats: FighterStatsSchema,
  moves: z.array(MoveSchema).min(4).max(5),
  passive: PassiveSchema,
  spriteKey: z.string(),
  rarity: z.enum(BUDDY_RARITIES),
  eye: z.string(),
  hat: z.enum(BUDDY_HATS),
  shiny: z.boolean(),
  bodyType: z.enum(BODY_TYPES).optional(),
  customSprite: z.array(z.string()).max(9).optional(),
  dominantLanguage: z.string(),
  favoriteHour: z.number().min(0).max(23),
  totalSessions: z.number(),
  xp: z.number().optional(),
  totalXPEarned: z.number().optional(),
  generatedAt: z.string(),
  signature: z.string(),
});
export type FighterCard = z.infer<typeof FighterCardSchema>;

// ── Raw Aggregate (parsed from ~/.claude/) ───────────────────────────
export interface RawAggregate {
  totalSessions: number;
  totalMessages: number;
  hourCounts: Record<string, number>;
  dailyActivity: { date: string; messageCount: number; sessionCount: number; toolCallCount: number }[];
  toolTotals: Record<string, number>;
  languageTotals: Record<string, number>;
  totalToolCalls: number;
  totalToolErrors: number;
  avgSessionDuration: number;
  lateNightSessions: number;
  totalSessionsFromMeta: number;
  outcomeScores: number[];
  helpfulnessScores: number[];
  linesAdded: number;
  linesRemoved: number;
}

// ── Battle Types ─────────────────────────────────────────────────────
export type Effectiveness = "super" | "normal" | "weak";

export interface BattleAction {
  type: "attack" | "miss" | "effect" | "passive" | "ko" | "damage_tick";
  actorIdx: 0 | 1;
  targetIdx: 0 | 1;
  moveName?: string;
  moveType?: MoveType;
  damage?: number;
  isCrit?: boolean;
  effectiveness?: Effectiveness;
  hpAfter: [number, number];
  narration: string;
}

export interface BattleTurnLog {
  turnNumber: number;
  actions: BattleAction[];
}

export interface BattleResult {
  winner: 0 | 1;
  turns: number;
  log: BattleTurnLog[];
  fighters: [FighterCard, FighterCard];
}
