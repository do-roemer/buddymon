import type { Move, MoveType, FighterClass, Passive, GrowthRates } from "./types.js";

// ── Tool Group Mappings ──────────────────────────────────────────────
export const TOOL_GROUPS: Record<string, MoveType> = {
  // read group
  Read: "read",
  Grep: "read",
  Glob: "read",
  ToolSearch: "read",
  WebSearch: "read",
  WebFetch: "read",
  ReadMcpResourceTool: "read",
  ListMcpResourcesTool: "read",
  // write group
  Write: "write",
  Edit: "write",
  NotebookEdit: "write",
  // bash group
  Bash: "bash",
  // agent group
  Agent: "agent",
  TaskCreate: "agent",
  TaskUpdate: "agent",
  TaskGet: "agent",
  TaskList: "agent",
  EnterPlanMode: "agent",
  ExitPlanMode: "agent",
  Skill: "agent",
  SendMessage: "agent",
};

// Tools starting with mcp__ are counted as "agent" type
export function getToolGroup(toolName: string): MoveType {
  if (toolName.startsWith("mcp__")) return "agent";
  return TOOL_GROUPS[toolName] ?? "bash"; // unknown tools default to bash
}

// ── Type Effectiveness Chart ─────────────────────────────────────────
// TYPE_CHART[attackMoveType][defenderClass] = multiplier
export const TYPE_CHART: Record<MoveType, Record<FighterClass, number>> = {
  read: {
    explorer: 1.0,
    builder: 1.5,
    commander: 0.75,
    architect: 1.0,
    debugger: 1.0,
  },
  write: {
    explorer: 0.75,
    builder: 1.0,
    commander: 1.5,
    architect: 1.0,
    debugger: 0.75,
  },
  bash: {
    explorer: 1.5,
    builder: 0.75,
    commander: 1.0,
    architect: 1.5,
    debugger: 1.0,
  },
  agent: {
    explorer: 1.0,
    builder: 1.0,
    commander: 0.75,
    architect: 1.0,
    debugger: 1.5,
  },
  debug: {
    explorer: 1.0,
    builder: 1.0,
    commander: 1.0,
    architect: 0.75,
    debugger: 1.0,
  },
};

// ── Move Catalog ─────────────────────────────────────────────────────
export const MOVE_CATALOG: Record<MoveType, Move[]> = {
  read: [
    {
      name: "Deep Scan",
      type: "read",
      power: 60,
      accuracy: 95,
      description: "Recursively greps the opponent's defenses",
    },
    {
      name: "Pattern Match",
      type: "read",
      power: 80,
      accuracy: 85,
      description: "A regex-powered strike that finds weak points",
    },
    {
      name: "Glob Storm",
      type: "read",
      power: 50,
      accuracy: 100,
      effect: { kind: "debuff", stat: "defense", amount: 10, turns: 2 },
      description: "Scatters search patterns everywhere",
    },
    {
      name: "Source Dive",
      type: "read",
      power: 100,
      accuracy: 70,
      description: "Reads the opponent's entire codebase at once",
    },
  ],
  write: [
    {
      name: "Hot Patch",
      type: "write",
      power: 70,
      accuracy: 90,
      description: "Quickly edits the opponent's HP",
    },
    {
      name: "Refactor Storm",
      type: "write",
      power: 90,
      accuracy: 80,
      description: "Massive multi-file rewrite attack",
    },
    {
      name: "Code Wall",
      type: "write",
      power: 40,
      accuracy: 100,
      effect: { kind: "shield", percent: 25, turns: 3 },
      description: "Writes a defensive wall of code",
    },
    {
      name: "Force Push",
      type: "write",
      power: 110,
      accuracy: 65,
      description: "Overwrites everything. No review needed.",
    },
  ],
  bash: [
    {
      name: "Shell Shock",
      type: "bash",
      power: 75,
      accuracy: 90,
      description: "A devastating terminal command",
    },
    {
      name: "Pipe Bomb",
      type: "bash",
      power: 95,
      accuracy: 75,
      description: "Chains commands for explosive damage",
    },
    {
      name: "Kill -9",
      type: "bash",
      power: 120,
      accuracy: 60,
      description: "The nuclear option. Cannot be caught.",
    },
    {
      name: "Cron Job",
      type: "bash",
      power: 40,
      accuracy: 100,
      effect: { kind: "dot", damagePerTurn: 15, turns: 3 },
      description: "Schedules recurring damage",
    },
  ],
  agent: [
    {
      name: "Delegate",
      type: "agent",
      power: 65,
      accuracy: 90,
      description: "Summons a sub-agent to attack",
    },
    {
      name: "Grand Plan",
      type: "agent",
      power: 50,
      accuracy: 100,
      effect: { kind: "buff", stat: "attack", amount: 15, turns: 3 },
      description: "Buffs all stats with a master plan",
    },
    {
      name: "Task Swarm",
      type: "agent",
      power: 85,
      accuracy: 80,
      description: "Creates a flurry of parallel tasks",
    },
    {
      name: "Skill Invoke",
      type: "agent",
      power: 100,
      accuracy: 70,
      description: "Activates a powerful specialized skill",
    },
  ],
  debug: [
    {
      name: "Stack Trace",
      type: "debug",
      power: 70,
      accuracy: 90,
      description: "Traces the error back to its source",
    },
    {
      name: "Breakpoint",
      type: "debug",
      power: 45,
      accuracy: 100,
      effect: { kind: "heal", percent: 20 },
      description: "Stops the opponent and heals self",
    },
    {
      name: "Rubber Duck",
      type: "debug",
      power: 55,
      accuracy: 95,
      effect: { kind: "debuff", stat: "speed", amount: 15, turns: 2 },
      description: "Explains the problem until it goes away",
    },
    {
      name: "Hotfix",
      type: "debug",
      power: 90,
      accuracy: 75,
      description: "A quick and dirty fix that hits hard",
    },
  ],
};

// ── Class Passives ───────────────────────────────────────────────────
export const CLASS_PASSIVES: Record<FighterClass, Passive> = {
  explorer: {
    name: "Reconnaissance",
    description: "On dodge: debuff enemy defense for 2 turns",
    trigger: "on_dodge",
    effect: { kind: "debuff", stat: "defense", amount: 10, turns: 2 },
  },
  builder: {
    name: "Code Armor",
    description: "Start of turn: gain 8% shield for 1 turn",
    trigger: "start_of_turn",
    effect: { kind: "shield", percent: 8, turns: 1 },
  },
  commander: {
    name: "Root Access",
    description: "On crit: inflict DoT for 2 turns",
    trigger: "on_crit",
    effect: { kind: "dot", damagePerTurn: 10, turns: 2 },
  },
  architect: {
    name: "Master Plan",
    description: "Every 3rd turn: +12 attack buff for 2 turns",
    trigger: "start_of_turn",
    effect: { kind: "buff", stat: "attack", amount: 12, turns: 2 },
  },
  debugger: {
    name: "Error Recovery",
    description: "On hit received: heal 8% HP",
    trigger: "on_hit",
    effect: { kind: "heal", percent: 8 },
  },
};

// ── Class Titles ─────────────────────────────────────────────────────
export const CLASS_TITLES: Record<FighterClass, string[]> = {
  explorer: [
    "The Code Archaeologist",
    "The Pattern Seeker",
    "The Deep Reader",
    "The Source Diver",
  ],
  builder: [
    "The Code Smith",
    "The Refactor King",
    "The Patch Master",
    "The Feature Forge",
  ],
  commander: [
    "The Shell Lord",
    "The Terminal Tyrant",
    "The Pipe Master",
    "The Root Commander",
  ],
  architect: [
    "The Grand Planner",
    "The Task Master",
    "The Delegation King",
    "The System Designer",
  ],
  debugger: [
    "The Bug Hunter",
    "The Error Whisperer",
    "The Stack Tracer",
    "The Breakpoint Sage",
  ],
};

// ── Buddy Name Parts ─────────────────────────────────────────────────
export const NAME_PREFIXES: Record<FighterClass, string[]> = {
  explorer: ["Grep", "Scan", "Seek", "Read", "Glob", "Find", "Trace", "Query"],
  builder: ["Patch", "Forge", "Code", "Write", "Craft", "Build", "Edit", "Shape"],
  commander: ["Bash", "Shell", "Pipe", "Root", "Exec", "Kern", "Sys", "Proc"],
  architect: ["Plan", "Task", "Agent", "Arch", "Meta", "Spec", "Schema", "Stack"],
  debugger: ["Debug", "Fix", "Trace", "Catch", "Break", "Lint", "Assert", "Guard"],
};

// ── Class Growth Rates (stat gain per level) ────────────────────────
export const CLASS_GROWTH_RATES: Record<FighterClass, GrowthRates> = {
  explorer:  { hp: 1.0, attack: 0.7, defense: 0.7, speed: 1.2, crit: 0.15 },
  builder:   { hp: 1.5, attack: 0.7, defense: 1.2, speed: 0.5, crit: 0.10 },
  commander: { hp: 1.0, attack: 1.2, defense: 0.5, speed: 0.7, crit: 0.15 },
  architect: { hp: 1.0, attack: 1.0, defense: 0.7, speed: 1.0, crit: 0.10 },
  debugger:  { hp: 1.5, attack: 0.5, defense: 1.0, speed: 0.7, crit: 0.25 },
};

export const NAME_SUFFIXES = [
  "wraith", "fang", "claw", "byte", "flux", "spark", "shade",
  "storm", "pulse", "drift", "blaze", "frost", "vex", "hex",
  "lock", "core", "node", "link", "sync", "dash",
];
