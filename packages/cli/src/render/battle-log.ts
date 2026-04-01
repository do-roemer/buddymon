import chalk from "chalk";
import type { BattleAction, BattleResult, FighterCard } from "@buddymon/shared";
import { renderHpBar } from "./stat-bars.js";
import { getClassColor } from "./ascii-buddy.js";

function colorName(card: FighterCard): string {
  return getClassColor(card.class).bold(card.buddyName);
}

function renderAction(
  action: BattleAction,
  fighters: [FighterCard, FighterCard],
): string {
  let line = "  ";

  switch (action.type) {
    case "attack": {
      line += colorName(fighters[action.actorIdx]);
      line += ` used ${chalk.bold(action.moveName!)}!`;
      if (action.isCrit) line += chalk.yellow.bold(" CRITICAL HIT!");
      if (action.effectiveness === "super")
        line += chalk.green.bold(" Super effective!");
      if (action.effectiveness === "weak")
        line += chalk.gray(" Not very effective...");
      line += ` ${chalk.red(`-${action.damage} HP`)}`;
      break;
    }
    case "miss":
      line += `${colorName(fighters[action.actorIdx])} used ${chalk.bold(action.moveName!)}... ${chalk.gray("but it missed!")}`;
      break;
    case "effect":
      line += chalk.cyan(`  ${action.narration}`);
      break;
    case "passive":
      line += chalk.magenta(`  ${action.narration}`);
      break;
    case "damage_tick":
      line += chalk.red(`  ${action.narration}`);
      break;
    case "ko":
      line += chalk.red.bold(`  ${action.narration}`);
      break;
  }

  return line;
}

export function renderBattleResult(result: BattleResult): string {
  const [f1, f2] = result.fighters;
  const lines: string[] = [];

  lines.push("");
  lines.push(chalk.bold.white("═".repeat(50)));
  lines.push(
    chalk.bold.white(
      `  ${colorName(f1)} (Lv.${f1.level})  VS  ${colorName(f2)} (Lv.${f2.level})`,
    ),
  );
  lines.push(chalk.bold.white("═".repeat(50)));
  lines.push("");

  for (const turn of result.log) {
    lines.push(chalk.gray(`── Turn ${turn.turnNumber} ──`));

    for (const action of turn.actions) {
      lines.push(renderAction(action, result.fighters));

      // Show HP bars after attacks and KOs
      if (action.type === "attack" || action.type === "ko" || action.type === "damage_tick") {
        const [hp1, hp2] = action.hpAfter;
        lines.push(
          `    ${f1.buddyName}: ${renderHpBar(hp1, f1.stats.hp, 15)}`,
        );
        lines.push(
          `    ${f2.buddyName}: ${renderHpBar(hp2, f2.stats.hp, 15)}`,
        );
      }
    }
    lines.push("");
  }

  lines.push(chalk.bold.white("═".repeat(50)));
  const winner = result.fighters[result.winner];
  lines.push(
    chalk.bold(
      `  ${getClassColor(winner.class)(`${winner.buddyName} WINS!`)} (${result.turns} turns)`,
    ),
  );
  lines.push(chalk.bold.white("═".repeat(50)));

  return lines.join("\n");
}
