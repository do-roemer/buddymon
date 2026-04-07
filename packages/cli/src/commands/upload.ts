import * as crypto from "node:crypto";
import chalk from "chalk";
import { buildFighterCard, parseStats } from "@buddymon/shared";
import { getTerminalTamer, getCustomSprite, getBodyType } from "../terminal-tamer.js";
import { ARENA_URL } from "../arena.js";
import { readProgression } from "../progression.js";

export async function uploadCommand(opts: { tamer?: string; name?: string; fakeIdentity?: boolean; sprite?: string; bodyType?: string }): Promise<void> {
  console.log(chalk.bold("\n  Generating fighter card...\n"));

  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const progression = readProgression();
  const card = buildFighterCard(agg, tamer, progression);

  if (opts.name) {
    card.buddyName = opts.name;
  }

  if (!card.buddyName.toLowerCase().endsWith("mon")) {
    card.buddyName += "mon";
  }

  // Load saved sprite/body from config, then allow CLI flags to override
  const savedSprite = getCustomSprite();
  if (savedSprite) {
    card.customSprite = savedSprite;
  }
  const savedBodyType = getBodyType();
  if (savedBodyType === "biped" || savedBodyType === "quadruped") {
    card.bodyType = savedBodyType;
  }

  if (opts.bodyType === "biped" || opts.bodyType === "quadruped") {
    card.bodyType = opts.bodyType;
  }

  if (opts.sprite) {
    card.customSprite = opts.sprite.split("\\n");
  }

  if (opts.fakeIdentity) {
    card.ownerHash = crypto.randomBytes(32).toString("hex");
  }

  let res: Response;
  try {
    res = await fetch(`${ARENA_URL}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
  } catch (err) {
    console.error(chalk.red("\n  Error: Could not connect to the arena.\n"));
    console.error(chalk.gray(`  Attempted URL: ${ARENA_URL}/api/upload`));
    console.error(chalk.gray(`  Check your network or set BUDDYMON_ARENA_URL.\n`));
    if (err instanceof Error) {
      console.error(chalk.gray(`  Detail: ${err.message}\n`));
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
