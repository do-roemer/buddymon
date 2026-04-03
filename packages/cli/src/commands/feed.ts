import chalk from "chalk";
import { readCompanion, xpForLevel, MAX_LEVEL } from "@buddymon/shared";
import { performFeed, readProgression } from "../progression.js";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(n);
}

function renderXPBar(current: number, max: number, width: number = 20): string {
  if (max === Infinity) return chalk.green("=".repeat(width)) + " MAX";
  const ratio = Math.min(current / max, 1);
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  return chalk.green("=".repeat(filled)) + chalk.gray("-".repeat(empty));
}

export function feedCommand(): void {
  const companion = readCompanion();
  const buddyName = companion.name ?? "Buddy";

  const result = performFeed();

  if (result.tokensConsumed === 0) {
    const state = readProgression();
    console.log("");
    console.log(chalk.bold(`  ${buddyName} is full!`));
    console.log(chalk.gray("  No unclaimed sessions to feed."));
    console.log("");
    console.log(`  Level ${chalk.bold(String(state.level))}  [${renderXPBar(state.currentXP, state.xpToNextLevel)}]  ${state.currentXP}/${state.level >= MAX_LEVEL ? "MAX" : state.xpToNextLevel} XP`);
    console.log(`  Total XP: ${chalk.cyan(String(state.totalXPEarned))}  |  Tokens fed: ${chalk.cyan(formatTokens(state.totalTokensFed))}`);
    console.log("");
    return;
  }

  console.log("");
  console.log(chalk.bold(`  Feeding ${buddyName}...`));
  console.log(chalk.gray("  " + "-".repeat(40)));
  console.log(`  Sessions consumed:  ${chalk.white.bold(String(result.sessionsProcessed))}`);
  console.log(`  Tokens burned:      ${chalk.white.bold(formatTokens(result.tokensConsumed))}`);
  console.log(`  XP gained:          ${chalk.green.bold("+" + result.xpGained)}`);
  console.log("");

  if (result.levelsGained > 0) {
    console.log(chalk.yellow.bold(`  LEVEL UP! ${result.previousLevel} -> ${result.newLevel}`));
    if (result.levelsGained > 1) {
      console.log(chalk.yellow(`  (+${result.levelsGained} levels!)`));
    }
    console.log("");
  }

  const { state } = result;
  const nextXP = state.level >= MAX_LEVEL ? "MAX" : String(state.xpToNextLevel);
  console.log(`  Level ${chalk.bold(String(state.level))}  [${renderXPBar(state.currentXP, state.xpToNextLevel)}]  ${state.currentXP}/${nextXP} XP`);
  console.log(`  Total XP: ${chalk.cyan(String(state.totalXPEarned))}  |  Tokens fed: ${chalk.cyan(formatTokens(state.totalTokensFed))}`);
  console.log("");
}
