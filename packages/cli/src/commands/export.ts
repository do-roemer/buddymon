import * as fs from "node:fs";
import chalk from "chalk";
import { parseStats, buildFighterCard } from "@buddymon/shared";
import type { BodyType } from "@buddymon/shared";
import { getTerminalTamer, getCustomSprite, getBodyType, saveCustomSprite, saveBodyType } from "../terminal-tamer.js";
import { readProgression } from "../progression.js";

export function exportCommand(outputPath: string, opts: { tamer?: string; sprite?: string; bodyType?: string }): void {
  console.log(chalk.bold("\n  Generating fighter card...\n"));

  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const progression = readProgression();
  const card = buildFighterCard(agg, tamer, progression);

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
    card.bodyType = opts.bodyType as BodyType;
    saveBodyType(opts.bodyType);
  }

  if (opts.sprite) {
    card.customSprite = opts.sprite.split("\\n");
    saveCustomSprite(card.customSprite);
  }

  fs.writeFileSync(outputPath, JSON.stringify(card, null, 2));

  console.log(`  ${chalk.green("Exported!")} ${chalk.bold(card.buddyName)}`);
  console.log(`  Class: ${card.class}  Level: ${card.level}`);
  console.log(`  Saved to: ${chalk.cyan(outputPath)}`);
  console.log(
    `\n  Share this file with teammates to battle in the arena!\n`,
  );
}
