import * as fs from "node:fs";
import * as path from "node:path";
import type { RawAggregate } from "./types.js";
import { getToolGroup } from "./constants.js";
import type { MoveType } from "./types.js";

const CLAUDE_DIR = path.join(
  process.env.HOME ?? process.env.USERPROFILE ?? "~",
  ".claude",
);

interface StatsCache {
  totalSessions: number;
  totalMessages: number;
  hourCounts: Record<string, number>;
  dailyActivity: {
    date: string;
    messageCount: number;
    sessionCount: number;
    toolCallCount: number;
  }[];
  modelUsage: Record<
    string,
    {
      inputTokens: number;
      outputTokens: number;
      costUSD?: number;
    }
  >;
}

interface SessionMeta {
  session_id?: string;
  duration_minutes?: number;
  user_message_count?: number;
  assistant_message_count?: number;
  tool_counts?: Record<string, number>;
  languages?: Record<string, number>;
  lines_added?: number;
  lines_removed?: number;
  files_modified?: number;
  git_commits?: number;
  tool_errors?: number;
  message_hours?: number[];
}

interface Facet {
  outcome?: string;
  claude_helpfulness?: string;
  goal_categories?: Record<string, number>;
  session_id?: string;
}

function readJsonSafe<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readJsonDir<T>(dirPath: string): T[] {
  if (!fs.existsSync(dirPath)) return [];
  const results: T[] = [];
  for (const file of fs.readdirSync(dirPath)) {
    if (!file.endsWith(".json")) continue;
    const data = readJsonSafe<T>(path.join(dirPath, file));
    if (data) results.push(data);
  }
  return results;
}

const LATE_NIGHT_HOURS = new Set([22, 23, 0, 1, 2, 3, 4]);

function outcomeToScore(outcome?: string): number {
  switch (outcome) {
    case "fully_achieved":
      return 3;
    case "mostly_achieved":
      return 2;
    case "partially_achieved":
      return 1;
    default:
      return 0;
  }
}

function helpfulnessToScore(h?: string): number {
  switch (h) {
    case "essential":
      return 4;
    case "very_helpful":
      return 3;
    case "somewhat_helpful":
    case "moderately_helpful":
      return 2;
    case "slightly_helpful":
      return 1;
    default:
      return 0;
  }
}

export function parseStats(claudeDir?: string): RawAggregate {
  const dir = claudeDir ?? CLAUDE_DIR;

  // 1. Read stats-cache.json
  const cache = readJsonSafe<StatsCache>(path.join(dir, "stats-cache.json"));

  // 2. Read session-meta files
  const sessions = readJsonDir<SessionMeta>(
    path.join(dir, "usage-data", "session-meta"),
  );

  // 3. Read facet files
  const facets = readJsonDir<Facet>(
    path.join(dir, "usage-data", "facets"),
  );

  // Aggregate tool counts across all sessions
  const toolTotals: Record<string, number> = {};
  let totalToolCalls = 0;
  let totalToolErrors = 0;
  let totalDuration = 0;
  let lateNightSessions = 0;
  let linesAdded = 0;
  let linesRemoved = 0;
  const languageTotals: Record<string, number> = {};

  for (const s of sessions) {
    // Tool counts
    if (s.tool_counts) {
      for (const [tool, count] of Object.entries(s.tool_counts)) {
        toolTotals[tool] = (toolTotals[tool] ?? 0) + count;
        totalToolCalls += count;
      }
    }

    totalToolErrors += s.tool_errors ?? 0;
    totalDuration += s.duration_minutes ?? 0;
    linesAdded += s.lines_added ?? 0;
    linesRemoved += s.lines_removed ?? 0;

    // Languages
    if (s.languages) {
      for (const [lang, count] of Object.entries(s.languages)) {
        languageTotals[lang] = (languageTotals[lang] ?? 0) + count;
      }
    }

    // Late-night detection
    if (s.message_hours?.some((h) => LATE_NIGHT_HOURS.has(h))) {
      lateNightSessions++;
    }
  }

  // Outcome & helpfulness from facets
  const outcomeScores = facets.map((f) => outcomeToScore(f.outcome));
  const helpfulnessScores = facets.map((f) =>
    helpfulnessToScore(f.claude_helpfulness),
  );

  const sessionCount = sessions.length || 1;

  return {
    totalSessions: cache?.totalSessions ?? sessions.length,
    totalMessages: cache?.totalMessages ?? 0,
    hourCounts: cache?.hourCounts ?? {},
    dailyActivity: cache?.dailyActivity ?? [],
    toolTotals,
    languageTotals,
    totalToolCalls,
    totalToolErrors,
    avgSessionDuration: totalDuration / sessionCount,
    lateNightSessions,
    totalSessionsFromMeta: sessions.length,
    outcomeScores,
    helpfulnessScores,
    linesAdded,
    linesRemoved,
  };
}
