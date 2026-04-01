// Types
export type {
  FighterClass,
  MoveType,
  Move,
  MoveEffect,
  Passive,
  FighterStats,
  FighterCard,
  BuddySpecies,
  BuddyBaseStats,
  BuddyRarity,
  BuddyEye,
  BuddyHat,
  Companion,
  RawAggregate,
  Effectiveness,
  BattleAction,
  BattleTurnLog,
  BattleResult,
} from "./types.js";

// Schemas
export {
  FighterCardSchema,
  CompanionSchema,
  BuddyBaseStatsSchema,
  MoveSchema,
  PassiveSchema,
  FighterStatsSchema,
  MoveEffectSchema,
  FIGHTER_CLASSES,
  BUDDY_SPECIES,
  BUDDY_RARITIES,
  BUDDY_EYES,
  BUDDY_HATS,
  MOVE_TYPES,
} from "./types.js";

// Constants
export {
  TYPE_CHART,
  MOVE_CATALOG,
  CLASS_PASSIVES,
  TOOL_GROUPS,
  getToolGroup,
  CLASS_TITLES,
  NAME_PREFIXES,
  NAME_SUFFIXES,
} from "./constants.js";

// Stats parsing
export { parseStats } from "./stats-parser.js";

// Class resolution
export { resolveClass, computeToolGroupDistribution } from "./class-resolver.js";

// Stats computation
export { computeStats, computeLevel } from "./stats-computer.js";

// Move resolution
export { resolveMoves } from "./move-resolver.js";

// Name generation
export { generateBuddyName, generateTitle } from "./name-generator.js";

// Companion
export { readCompanion } from "./companion.js";

// Fighter card
export { buildFighterCard, verifySignature } from "./fighter-card.js";

// Battle engine
export { resolveBattle } from "./battle-engine.js";
