import chalk from "chalk";
import { buildFighterCard, parseStats } from "@buddymon/shared";
import { getTerminalTamer } from "../terminal-tamer.js";
import { ARENA_URL, isLocalArenaUrl } from "../arena.js";

export async function uploadCommand(opts: { tamer?: string }): Promise<void> {
  console.log(chalk.bold("\n  Generating fighter card...\n"));

  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const card = buildFighterCard(agg, tamer);

  let res: Response;
  try {
    res = await fetch(`${ARENA_URL}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
  } catch {
    console.error(chalk.red("\n  Error: Could not connect to the arena.\n"));
    if (isLocalArenaUrl()) {
      console.error(chalk.gray("  Start it with 'npm run arena' from the buddymon project directory.\n"));
    } else {
      console.error(chalk.gray(`  Check BUDDYMON_ARENA_URL: ${ARENA_URL}\n`));
    }
    process.exit(1);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `HTTP ${res.status}`;
    console.error(chalk.red(`\n  Error: Upload failed (${message}).\n`));
    process.exit(1);
  }

  const buddy =
    typeof data === "object" && data !== null && "buddy" in data
      ? data.buddy
      : null;

  console.log(`  ${chalk.green("Uploaded!")} ${chalk.bold(card.buddyName)}`);
  console.log(`  Arena: ${chalk.cyan(ARENA_URL)}`);
  if (
    buddy &&
    typeof buddy === "object" &&
    "id" in buddy &&
    typeof buddy.id === "string"
  ) {
    console.log(`  Profile: ${chalk.cyan(`${ARENA_URL}/buddy/${buddy.id}`)}`);
  }
  console.log("");
}
