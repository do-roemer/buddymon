import chalk from "chalk";
import { parseStats } from "@buddymon/shared";

export function scanCommand(): void {
  console.log(chalk.bold("\n  Scanning ~/.claude/ for usage data...\n"));

  const agg = parseStats();

  console.log(chalk.bold.white("  Usage Summary"));
  console.log(chalk.gray("  " + "─".repeat(40)));
  console.log(`  Total Sessions:    ${chalk.bold(String(agg.totalSessions))}`);
  console.log(`  Total Messages:    ${chalk.bold(String(agg.totalMessages))}`);
  console.log(
    `  Sessions w/ Meta:  ${chalk.bold(String(agg.totalSessionsFromMeta))}`,
  );
  console.log(
    `  Avg Duration:      ${chalk.bold(Math.round(agg.avgSessionDuration) + " min")}`,
  );
  console.log(`  Total Tool Calls:  ${chalk.bold(String(agg.totalToolCalls))}`);
  console.log(`  Total Errors:      ${chalk.bold(String(agg.totalToolErrors))}`);
  console.log(`  Lines Added:       ${chalk.green.bold("+" + agg.linesAdded)}`);
  console.log(`  Lines Removed:     ${chalk.red.bold("-" + agg.linesRemoved)}`);
  console.log(
    `  Late Night:        ${chalk.bold(String(agg.lateNightSessions))} sessions`,
  );

  // Top tools
  const sortedTools = Object.entries(agg.toolTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (sortedTools.length > 0) {
    console.log(chalk.bold.white("\n  Top Tools"));
    console.log(chalk.gray("  " + "─".repeat(40)));
    for (const [tool, count] of sortedTools) {
      console.log(`  ${tool.padEnd(20)} ${chalk.bold(String(count))}`);
    }
  }

  // Top languages
  const sortedLangs = Object.entries(agg.languageTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sortedLangs.length > 0) {
    console.log(chalk.bold.white("\n  Top Languages"));
    console.log(chalk.gray("  " + "─".repeat(40)));
    for (const [lang, count] of sortedLangs) {
      console.log(`  ${lang.padEnd(20)} ${chalk.bold(String(count))} sessions`);
    }
  }

  console.log("");
}
