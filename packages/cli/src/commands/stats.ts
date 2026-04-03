import chalk from "chalk";
import {
  parseStats,
  readCompanion,
  resolveClass,
  computeStatsFromLevel,
  computeToolGroupDistribution,
  xpForLevel,
  MAX_LEVEL,
  CLASS_GROWTH_RATES,
} from "@buddymon/shared";
import { readProgression } from "../progression.js";

export function statsCommand(): void {
  const agg = parseStats();
  const companion = readCompanion();
  const fighterClass = resolveClass(agg);
  const progression = readProgression();
  const level = progression.level;
  const lateNightRatio = agg.totalSessionsFromMeta > 0
    ? agg.lateNightSessions / agg.totalSessionsFromMeta
    : 0;
  const stats = companion.baseStats
    ? computeStatsFromLevel(level, fighterClass, companion.baseStats, lateNightRatio)
    : { hp: 80, attack: 1, defense: 1, speed: 1, critChance: 5, rageMode: false };
  const dist = computeToolGroupDistribution(agg.toolTotals);

  console.log(chalk.bold("\n  Stat Computation Breakdown\n"));

  // Base stats from buddy
  if (companion.baseStats) {
    const bs = companion.baseStats;
    console.log(chalk.bold.white("  Buddy Base Stats (from /buddy)"));
    console.log(chalk.gray("  " + "─".repeat(40)));
    console.log(`  DEBUGGING  ${String(bs.debugging).padStart(3)}  ${chalk.cyan("-> DEF base")}`);
    console.log(`  PATIENCE   ${String(bs.patience).padStart(3)}  ${chalk.green("-> HP base")}`);
    console.log(`  CHAOS      ${String(bs.chaos).padStart(3)}  ${chalk.red("-> ATK base")}`);
    console.log(`  WISDOM     ${String(bs.wisdom).padStart(3)}  ${chalk.yellow("-> SPD base")}`);
    console.log(`  SNARK      ${String(bs.snark).padStart(3)}  ${chalk.magenta("-> CRIT base")}`);
    console.log(chalk.gray("\n  Base stats + level growth = final stats (feed tokens to level up!)"));
  }

  // Class resolution
  console.log(chalk.bold.white("\n  Class Resolution"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  const totalGroup = dist.read + dist.write + dist.bash + dist.agent + dist.debug;
  const pct = (n: number) =>
    totalGroup > 0 ? ((n / totalGroup) * 100).toFixed(1) + "%" : "0%";
  console.log(`  read:   ${String(dist.read).padStart(5)}  (${pct(dist.read).padStart(6)})`);
  console.log(`  write:  ${String(dist.write).padStart(5)}  (${pct(dist.write).padStart(6)})`);
  console.log(`  bash:   ${String(dist.bash).padStart(5)}  (${pct(dist.bash).padStart(6)})`);
  console.log(`  agent:  ${String(dist.agent).padStart(5)}  (${pct(dist.agent).padStart(6)})`);
  console.log(`  debug:  ${String(dist.debug).padStart(5)}  (${pct(dist.debug).padStart(6)})`);

  const errorRate =
    agg.totalToolCalls > 0
      ? ((agg.totalToolErrors / agg.totalToolCalls) * 100).toFixed(1)
      : "0";
  console.log(`\n  Error rate: ${errorRate}% (>10% + good recovery = Debugger override)`);
  console.log(`  ${chalk.bold(`Result: ${fighterClass.toUpperCase()}`)}`);

  // Level & XP
  console.log(chalk.bold.white("\n  Level & XP (Progression)"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  console.log(`  Level:         ${chalk.bold(String(level))}`);
  console.log(`  Total XP:      ${chalk.cyan(String(progression.totalXPEarned))}`);
  console.log(`  Current XP:    ${progression.currentXP} / ${level >= MAX_LEVEL ? "MAX" : xpForLevel(level)}`);
  console.log(`  Tokens fed:    ${chalk.cyan(String(progression.totalTokensFed))}`);
  console.log(`  Last fed:      ${progression.lastFedAt ? new Date(progression.lastFedAt).toLocaleString() : chalk.gray("never")}`);

  // Final stats (growth-rate based)
  const growth = CLASS_GROWTH_RATES[fighterClass];
  console.log(chalk.bold.white("\n  Final Fighter Stats"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  if (companion.baseStats) {
    const bs = companion.baseStats;
    const hpBase = Math.round(80 + (bs.patience / 100) * 140);
    const atkBase = Math.round(bs.chaos * 0.6);
    const defBase = Math.round(bs.debugging * 0.6);
    const spdBase = Math.round(bs.wisdom * 0.6);
    const critBase = Math.round(5 + (bs.snark / 100) * 15);
    console.log(`  HP       ${chalk.green.bold(String(stats.hp).padStart(3))}  (base: ${hpBase} + ${level} x ${growth.hp} = +${Math.floor(level * growth.hp)})`);
    console.log(`  ATK      ${chalk.red.bold(String(stats.attack).padStart(3))}  (base: ${atkBase} + ${level} x ${growth.attack} = +${Math.floor(level * growth.attack)})`);
    console.log(`  DEF      ${chalk.cyan.bold(String(stats.defense).padStart(3))}  (base: ${defBase} + ${level} x ${growth.defense} = +${Math.floor(level * growth.defense)})`);
    console.log(`  SPD      ${chalk.yellow.bold(String(stats.speed).padStart(3))}  (base: ${spdBase} + ${level} x ${growth.speed} = +${Math.floor(level * growth.speed)})`);
    console.log(`  CRIT     ${chalk.magenta.bold(String(stats.critChance).padStart(3))}% (base: ${critBase} + ${level} x ${growth.crit} = +${Math.floor(level * growth.crit)})`);
  } else {
    console.log(`  HP  ${stats.hp}  ATK  ${stats.attack}  DEF  ${stats.defense}  SPD  ${stats.speed}  CRIT  ${stats.critChance}%`);
    console.log(chalk.gray("  (no base stats from companion — using defaults)"));
  }

  // Rage
  const sessionCount = agg.totalSessionsFromMeta || 1;
  console.log(
    `  RAGE     ${stats.rageMode ? chalk.red.bold("ON ") : chalk.gray("OFF")}  lateNight: ${agg.lateNightSessions}/${sessionCount} = ${((agg.lateNightSessions / sessionCount) * 100).toFixed(1)}% (>15% = ON)`,
  );

  console.log("");
}
