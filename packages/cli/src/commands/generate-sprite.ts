import * as fs from "node:fs";
import chalk from "chalk";
import { parseStats, buildFighterCard } from "@buddymon/shared";
import type { BodyType } from "@buddymon/shared";
import { getTerminalTamer, getBodyType, saveCustomSprite, saveBodyType } from "../terminal-tamer.js";
import { readProgression } from "../progression.js";
import { generateSprite } from "../sprite-generator.js";
import { renderBuddy } from "../render/ascii-buddy.js";

export function generateSpriteCommand(outputPath: string, opts: { tamer?: string }): void {
  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const progression = readProgression();
  const card = buildFighterCard(agg, tamer, progression);

  if (!card.buddyName.toLowerCase().endsWith("mon")) {
    card.buddyName += "mon";
  }

  // Use saved body type or the card's default
  const savedBodyType = getBodyType();
  const bodyType: BodyType = (savedBodyType === "biped" || savedBodyType === "quadruped")
    ? savedBodyType
    : card.bodyType ?? "biped";

  const sprite = generateSprite({
    class: card.class,
    bodyType,
    stats: card.stats,
    rarity: card.rarity,
    shiny: card.shiny,
    species: card.species,
    ownerHash: card.ownerHash,
  });

  // Save sprite to config
  saveCustomSprite(sprite);
  saveBodyType(bodyType);

  // Apply sprite to card and export
  card.customSprite = sprite;
  card.bodyType = bodyType;
  fs.writeFileSync(outputPath, JSON.stringify(card, null, 2));

  console.log(chalk.bold("\n  Sprite generated & card exported!\n"));

  // Show preview with head + body
  const preview = renderBuddy(
    card.species,
    card.eye,
    card.hat,
    card.class,
    sprite,
    bodyType,
    25, // Force level 25+ to show full body in preview
  );
  const indented = preview.split("\n").map((l) => "  " + l).join("\n");
  console.log(indented);

  console.log(`\n  ${chalk.green("Saved!")} ${chalk.bold(card.buddyName)} — ${card.class} Lv.${card.level}`);
  console.log(`  Body: ${chalk.cyan(bodyType)}, ${sprite.length} lines`);
  console.log(`  Card: ${chalk.cyan(outputPath)}\n`);
}
