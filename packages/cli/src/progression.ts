import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as crypto from "node:crypto";
import type { ProgressionState } from "@buddymon/shared";
import { levelFromXP, currentLevelXP, xpForLevel, tokensToXP } from "@buddymon/shared";

const CONFIG_DIR = path.join(os.homedir(), ".config", "buddymon");
const PROGRESSION_PATH = path.join(CONFIG_DIR, "progression.json");

const CLAUDE_DIR = path.join(
  process.env.HOME ?? process.env.USERPROFILE ?? "~",
  ".claude",
);
const SESSION_META_DIR = path.join(CLAUDE_DIR, "usage-data", "session-meta");

function computeOwnerHash(): string {
  const hostname = os.hostname();
  const username = os.userInfo().username;
  return crypto
    .createHash("sha256")
    .update(`${hostname}:${username}`)
    .digest("hex");
}

export function readProgression(): ProgressionState {
  const ownerHash = computeOwnerHash();
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESSION_PATH, "utf-8")) as ProgressionState;
    if (data.ownerHash === ownerHash) {
      // Always recompute XP/level from totalTokensFed so rate changes apply retroactively
      data.totalXPEarned = tokensToXP(data.totalTokensFed);
      data.level = levelFromXP(data.totalXPEarned);
      data.currentXP = currentLevelXP(data.totalXPEarned);
      data.xpToNextLevel = xpForLevel(data.level);
      return data;
    }
  } catch {
    // No file or parse error — return fresh state
  }
  return {
    ownerHash,
    level: 1,
    currentXP: 0,
    xpToNextLevel: xpForLevel(1),
    totalXPEarned: 0,
    totalTokensFed: 0,
    lastFedAt: null,
    claimedSessionIds: [],
  };
}

export function writeProgression(state: ProgressionState): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(PROGRESSION_PATH, JSON.stringify(state, null, 2));
}

interface SessionMeta {
  session_id?: string;
  input_tokens?: number;
  output_tokens?: number;
  start_time?: string;
}

interface UnclaimedResult {
  totalTokens: number;
  sessionIds: string[];
  sessionCount: number;
}

export function scanUnclaimedTokens(claimedSessionIds: string[]): UnclaimedResult {
  const claimed = new Set(claimedSessionIds);

  if (!fs.existsSync(SESSION_META_DIR)) {
    return { totalTokens: 0, sessionIds: [], sessionCount: 0 };
  }

  let totalTokens = 0;
  const newSessionIds: string[] = [];

  for (const file of fs.readdirSync(SESSION_META_DIR)) {
    if (!file.endsWith(".json")) continue;

    const sessionId = file.replace(".json", "");
    if (claimed.has(sessionId)) continue;

    try {
      const raw = fs.readFileSync(path.join(SESSION_META_DIR, file), "utf-8");
      const meta = JSON.parse(raw) as SessionMeta;
      const tokens = (meta.input_tokens ?? 0) + (meta.output_tokens ?? 0);
      if (tokens > 0) {
        totalTokens += tokens;
        newSessionIds.push(sessionId);
      }
    } catch {
      // Skip corrupt files
    }
  }

  return { totalTokens, sessionIds: newSessionIds, sessionCount: newSessionIds.length };
}

export interface FeedResult {
  tokensConsumed: number;
  xpGained: number;
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  sessionsProcessed: number;
  state: ProgressionState;
}

export function performFeed(): FeedResult {
  const state = readProgression();
  const previousLevel = state.level;

  const unclaimed = scanUnclaimedTokens(state.claimedSessionIds);

  if (unclaimed.totalTokens === 0) {
    return {
      tokensConsumed: 0,
      xpGained: 0,
      previousLevel,
      newLevel: previousLevel,
      levelsGained: 0,
      sessionsProcessed: 0,
      state,
    };
  }

  const xpGained = tokensToXP(unclaimed.totalTokens);

  state.totalXPEarned += xpGained;
  state.totalTokensFed += unclaimed.totalTokens;
  state.claimedSessionIds.push(...unclaimed.sessionIds);
  state.lastFedAt = new Date().toISOString();

  // Recompute level
  state.level = levelFromXP(state.totalXPEarned);
  state.currentXP = currentLevelXP(state.totalXPEarned);
  state.xpToNextLevel = xpForLevel(state.level);

  writeProgression(state);

  return {
    tokensConsumed: unclaimed.totalTokens,
    xpGained,
    previousLevel,
    newLevel: state.level,
    levelsGained: state.level - previousLevel,
    sessionsProcessed: unclaimed.sessionCount,
    state,
  };
}
