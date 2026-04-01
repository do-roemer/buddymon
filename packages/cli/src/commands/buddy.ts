import chalk from "chalk";
import { parseStats, buildFighterCard } from "@buddymon/shared";
import type { BuddyHat } from "@buddymon/shared";
import { renderBuddy, getClassColor, getClassEmoji, getSpeciesColor, getRarityColor, getRarityStars } from "../render/ascii-buddy.js";
import { renderStatBars } from "../render/stat-bars.js";
import { getTerminalTamer } from "../terminal-tamer.js";

export function buddyCommand(opts: { tamer?: string }): void {
  const agg = parseStats();
  const tamer = getTerminalTamer(opts.tamer);
  const card = buildFighterCard(agg, tamer);
  const classColor = getClassColor(card.class);
  const speciesColor = getSpeciesColor(card.species);
  const rarityColor = getRarityColor(card.rarity);
  const emoji = getClassEmoji(card.class);

  console.log("");
  console.log(speciesColor.bold("  ╔════════════════════════════════════╗"));
  console.log(speciesColor.bold(`  ║  ${emoji} BUDDYMON FIGHTER CARD ${emoji}      ║`));
  console.log(speciesColor.bold("  ╠════════════════════════════════════╣"));
  console.log("");

  // Sprite (with actual eye and hat)
  console.log(renderBuddy(card.species, card.eye, card.hat as BuddyHat));
  console.log("");

  // Name and info
  const shinyTag = card.shiny ? chalk.yellow(" ✧SHINY✧") : "";
  const rarityTag = rarityColor(`${getRarityStars(card.rarity)} ${card.rarity.toUpperCase()}`);
  console.log(`  ${speciesColor.bold(card.buddyName)}  ${chalk.gray(`Lv.${card.level} ${card.species.toUpperCase()}`)}${shinyTag}`);
  console.log(`  ${rarityTag}${card.hat !== "none" ? chalk.gray(`  Hat: ${card.hat}`) : ""}`);
  console.log(`  ${chalk.italic(card.title)}`);
  console.log(`  Terminal Tamer: ${chalk.bold(card.terminalTamer)}`);
  console.log(
    `  Class: ${classColor(card.class.toUpperCase())}  |  ${card.dominantLanguage}  |  Peak hour: ${card.favoriteHour}:00`,
  );
  if (card.personality) {
    console.log(`  ${chalk.gray.italic(card.personality.slice(0, 80) + (card.personality.length > 80 ? "..." : ""))}`);
  }
  console.log("");

  // Stats
  console.log(chalk.bold.white("  Stats"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  console.log(renderStatBars(card.stats));
  console.log("");

  // Moves
  console.log(chalk.bold.white("  Moves"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  for (const move of card.moves) {
    const typeColor = {
      read: chalk.cyan,
      write: chalk.yellow,
      bash: chalk.red,
      agent: chalk.magenta,
      debug: chalk.green,
    }[move.type];

    console.log(
      `  ${typeColor(move.type.toUpperCase().padEnd(6))} ${chalk.bold(move.name.padEnd(16))} PWR:${String(move.power).padStart(3)}  ACC:${String(move.accuracy).padStart(3)}`,
    );
    if (move.effect) {
      console.log(chalk.gray(`         ${move.description}`));
    }
  }
  console.log("");

  // Passive
  console.log(chalk.bold.white("  Passive"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  console.log(`  ${chalk.magenta.bold(card.passive.name)}`);
  console.log(`  ${chalk.gray(card.passive.description)}`);

  console.log("");
  console.log(speciesColor.bold("  ╚════════════════════════════════════╝"));
  console.log("");
}
