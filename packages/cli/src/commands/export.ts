import * as fs from "node:fs";
import chalk from "chalk";
import { parseStats, buildFighterCard } from "@buddymon/shared";
import { getTerminalTamer } from "../terminal-tamer.js";

export function exportCommand(outputPath: string, opts: { tamer?: string; sprite?: string }): void {
  console.log(chalk.bold("\n  Generating fighter card...\n"));

  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const card = buildFighterCard(agg, tamer);

  if (!card.buddyName.toLowerCase().endsWith("mon")) {
    card.buddyName += "mon";
  }

  if (opts.sprite) {
    card.customSprite = opts.sprite.split("\\n");
  }

  fs.writeFileSync(outputPath, JSON.stringify(card, null, 2));

  console.log(`  ${chalk.green("Exported!")} ${chalk.bold(card.buddyName)}`);
  console.log(`  Class: ${card.class}  Level: ${card.level}`);
  console.log(`  Saved to: ${chalk.cyan(outputPath)}`);
  console.log(
    `\n  Share this file with teammates to battle in the arena!\n`,
  );
}
