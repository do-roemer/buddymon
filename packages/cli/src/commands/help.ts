import chalk from "chalk";

const COMMANDS = [
  { name: "buddy",       args: "",              desc: "Show your fighter card (default)" },
  { name: "export",      args: "[path]",        desc: "Export your fighter card as JSON" },
  { name: "upload",      args: "",              desc: "Export + upload to the arena" },
  { name: "list",        args: "",              desc: "List all buddymons in the arena" },
  { name: "leaderboard", args: "",              desc: "Show arena rankings" },
  { name: "scan",        args: "",              desc: "Show raw Claude Code usage data" },
  { name: "stats",       args: "",              desc: "Detailed stat computation breakdown" },
  { name: "help",        args: "",              desc: "Show this help message" },
];

export function helpCommand(): void {
  console.log("");
  console.log(chalk.bold("  Buddymon — Battle your Claude Code buddy!"));
  console.log(chalk.gray("  Usage: /buddymon <command>"));
  console.log("");

  for (const cmd of COMMANDS) {
    const nameStr = chalk.cyan(cmd.name.padEnd(14));
    const argsStr = chalk.gray(cmd.args.padEnd(14));
    console.log(`  ${nameStr}${argsStr}${cmd.desc}`);
  }

  console.log("");
  console.log(chalk.gray("  Options:"));
  console.log(`  ${chalk.cyan("--tamer <name>".padEnd(28))}Set your Terminal Tamer name`);
  console.log("");
}
