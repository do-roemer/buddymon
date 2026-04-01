import * as fs from "node:fs";
import chalk from "chalk";
import {
  parseStats,
  buildFighterCard,
  FighterCardSchema,
  resolveBattle,
} from "@buddymon/shared";
import { renderBattleResult } from "../render/battle-log.js";
import { getTerminalTamer } from "../terminal-tamer.js";
import { ARENA_URL, isLocalArenaUrl } from "../arena.js";

function looksLikeFilePath(arg: string): boolean {
  return arg.endsWith(".json") || arg.includes("/") || arg.includes("\\");
}

async function fetchOpponentByName(name: string) {
  const res = await fetch(`${ARENA_URL}/api/buddymons/${encodeURIComponent(name)}`);
  if (!res.ok) {
    if (res.status === 404) {
      console.error(chalk.red(`\n  Error: No buddy named "${name}" found in the arena.\n`));
      console.error(chalk.gray("  Use 'buddymon list' to see available opponents.\n"));
    } else {
      console.error(chalk.red(`\n  Error: Failed to fetch from arena (${res.status}).\n`));
    }
    if (isLocalArenaUrl()) {
      console.error(chalk.gray("  Start it with 'npm run arena' from the buddymon project directory.\n"));
    } else {
      console.error(chalk.gray(`  Check BUDDYMON_ARENA_URL: ${ARENA_URL}\n`));
    }
    process.exit(1);
  }
  const data = await res.json();
  return FighterCardSchema.parse(data.buddy.card);
}

function loadOpponentFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`\n  Error: File not found: ${filePath}\n`));
    process.exit(1);
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return FighterCardSchema.parse(raw);
  } catch (err) {
    console.error(chalk.red(`\n  Error: Invalid fighter card: ${filePath}\n`));
    if (err instanceof Error) console.error(chalk.gray(`  ${err.message}`));
    process.exit(1);
  }
}

export async function battleCommand(opponent: string, opts: { tamer?: string }): Promise<void> {
  // Load opponent card — from file or arena
  const opponentCard = looksLikeFilePath(opponent)
    ? loadOpponentFromFile(opponent)
    : await fetchOpponentByName(opponent);

  // Generate our card
  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const myCard = buildFighterCard(agg, tamer);

  console.log(chalk.bold("\n  Preparing for battle...\n"));
  console.log(
    `  ${chalk.bold(myCard.buddyName)} (Lv.${myCard.level} ${myCard.class}) vs ${chalk.bold(opponentCard.buddyName)} (Lv.${opponentCard.level} ${opponentCard.class})`,
  );

  // Resolve battle
  const result = resolveBattle(myCard, opponentCard);

  // Render
  console.log(renderBattleResult(result));
}
