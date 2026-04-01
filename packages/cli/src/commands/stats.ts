import chalk from "chalk";
import {
  parseStats,
  readCompanion,
  resolveClass,
  computeStats,
  computeLevel,
  computeToolGroupDistribution,
} from "@buddymon/shared";

export function statsCommand(): void {
  const agg = parseStats();
  const companion = readCompanion();
  const fighterClass = resolveClass(agg);
  const stats = computeStats(agg, companion.baseStats);
  const level = computeLevel(agg.totalSessions);
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
    console.log(chalk.gray("\n  Base stats = 60% weight, usage bonuses = 40% weight"));
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

  // Level
  console.log(chalk.bold.white("\n  Level"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  console.log(`  totalSessions / 7 = ${agg.totalSessions} / 7 = ${level}`);

  // Final stats
  console.log(chalk.bold.white("\n  Final Fighter Stats"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  console.log(`  HP       ${chalk.green.bold(String(stats.hp).padStart(3))}  ${companion.baseStats ? `(base: ${Math.round(80 + (companion.baseStats.patience / 100) * 140)} + usage bonus)` : "(pure usage)"}`);
  console.log(`  ATK      ${chalk.red.bold(String(stats.attack).padStart(3))}  ${companion.baseStats ? `(base: ${Math.round(companion.baseStats.chaos * 0.6)} + usage bonus)` : "(pure usage)"}`);
  console.log(`  DEF      ${chalk.cyan.bold(String(stats.defense).padStart(3))}  ${companion.baseStats ? `(base: ${Math.round(companion.baseStats.debugging * 0.6)} + usage bonus)` : "(pure usage)"}`);
  console.log(`  SPD      ${chalk.yellow.bold(String(stats.speed).padStart(3))}  ${companion.baseStats ? `(base: ${Math.round(companion.baseStats.wisdom * 0.6)} + usage bonus)` : "(pure usage)"}`);
  console.log(`  CRIT     ${chalk.magenta.bold(String(stats.critChance).padStart(3))}% ${companion.baseStats ? `(base: ${Math.round(5 + (companion.baseStats.snark / 100) * 15)} + streak bonus)` : "(pure usage)"}`);

  // Rage
  const sessionCount = agg.totalSessionsFromMeta || 1;
  console.log(
    `  RAGE     ${stats.rageMode ? chalk.red.bold("ON ") : chalk.gray("OFF")}  lateNight: ${agg.lateNightSessions}/${sessionCount} = ${((agg.lateNightSessions / sessionCount) * 100).toFixed(1)}% (>15% = ON)`,
  );

  console.log("");
}
