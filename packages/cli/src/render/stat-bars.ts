import chalk from "chalk";

const BAR_LENGTH = 20;
const FILLED = "█";
const EMPTY = "░";

function makeBar(value: number, max: number, color: chalk.ChalkInstance): string {
  const filled = Math.round((value / max) * BAR_LENGTH);
  const empty = BAR_LENGTH - filled;
  return color(FILLED.repeat(filled)) + chalk.gray(EMPTY.repeat(empty));
}

export function renderStatBars(stats: {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  rageMode: boolean;
}): string {
  const lines: string[] = [];

  lines.push(
    `  HP      ${chalk.bold(String(stats.hp).padStart(3))} ${makeBar(stats.hp, 300, chalk.green)}`,
  );
  lines.push(
    `  ATK     ${chalk.bold(String(stats.attack).padStart(3))} ${makeBar(stats.attack, 100, chalk.red)}`,
  );
  lines.push(
    `  DEF     ${chalk.bold(String(stats.defense).padStart(3))} ${makeBar(stats.defense, 100, chalk.blue)}`,
  );
  lines.push(
    `  SPD     ${chalk.bold(String(stats.speed).padStart(3))} ${makeBar(stats.speed, 100, chalk.yellow)}`,
  );
  lines.push(
    `  CRIT    ${chalk.bold(String(stats.critChance).padStart(3))}% ${makeBar(stats.critChance, 30, chalk.magenta)}`,
  );
  lines.push(
    `  RAGE    ${stats.rageMode ? chalk.red.bold("ON ") : chalk.gray("OFF")} ${stats.rageMode ? chalk.red(">>> ACTIVE <<<") : chalk.gray("inactive")}`,
  );

  return lines.join("\n");
}

export function renderHpBar(
  current: number,
  max: number,
  width: number = 20,
): string {
  const pct = current / max;
  const filled = Math.round(pct * width);
  const empty = width - filled;

  let color: chalk.ChalkInstance;
  if (pct > 0.5) color = chalk.green;
  else if (pct > 0.2) color = chalk.yellow;
  else color = chalk.red;

  return (
    color(FILLED.repeat(filled)) +
    chalk.gray(EMPTY.repeat(empty)) +
    ` ${current}/${max}`
  );
}
