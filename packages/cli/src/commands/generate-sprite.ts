import chalk from "chalk";
import { parseStats, buildFighterCard } from "@buddymon/shared";
import type { BodyType } from "@buddymon/shared";
import { getTerminalTamer, getBodyType, saveCustomSprite, saveBodyType } from "../terminal-tamer.js";
import { readProgression } from "../progression.js";
import { generateSprite } from "../sprite-generator.js";
import { renderBuddy } from "../render/ascii-buddy.js";

export function generateSpriteCommand(opts: { tamer?: string }): void {
  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const progression = readProgression();
  const card = buildFighterCard(agg, tamer, progression);

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

  // Save to config
  saveCustomSprite(sprite);
  saveBodyType(bodyType);

  console.log(chalk.bold("\n  Sprite generated!\n"));

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

  console.log(`\n  ${chalk.green("Saved!")} Body type: ${chalk.cyan(bodyType)}, ${sprite.length} lines`);
  console.log(`  Run ${chalk.cyan("npm run buddymon -- export")} to generate your card.\n`);
}
