import chalk from "chalk";
import { ARENA_URL } from "../arena.js";

interface StoredBuddy {
  id: string;
  card: { buddyName: string; species: string; class: string; level: number; terminalTamer: string };
  wins: number;
  losses: number;
}

export async function listCommand(): Promise<void> {
  let buddies: StoredBuddy[];
  try {
    const res = await fetch(`${ARENA_URL}/api/buddymons`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    buddies = data.buddies;
  } catch (err) {
    console.error(chalk.red("\n  Error: Could not connect to the arena.\n"));
    console.error(chalk.gray(`  Attempted URL: ${ARENA_URL}/api/buddymons`));
    console.error(chalk.gray(`  Check your network or set BUDDYMON_ARENA_URL.\n`));
    if (err instanceof Error) {
      console.error(chalk.gray(`  Detail: ${err.message}\n`));
    }
    process.exit(1);
  }

  if (buddies.length === 0) {
    console.log(chalk.yellow("\n  No buddymons in the arena yet. Be the first to upload!\n"));
    return;
  }

  console.log(chalk.bold("\n  Arena Buddymons"));
  console.log(chalk.gray("  " + "─".repeat(72)));
  console.log(
    chalk.gray(
      `  ${"#".padEnd(4)}${"Name".padEnd(16)}${"Tamer".padEnd(14)}${"Species".padEnd(12)}${"Class".padEnd(12)}${"Lv".padEnd(5)}${"W".padEnd(5)}${"L".padEnd(5)}${"Rate"}`,
    ),
  );
  console.log(chalk.gray("  " + "─".repeat(72)));

  buddies.forEach((b, i) => {
    const total = b.wins + b.losses;
    const rate = total > 0 ? `${Math.round((b.wins / total) * 100)}%` : "—";
    console.log(
      `  ${String(i + 1).padEnd(4)}${chalk.bold(b.card.buddyName.padEnd(16))}${(b.card.terminalTamer ?? "—").padEnd(14)}${b.card.species.padEnd(12)}${b.card.class.padEnd(12)}${String(b.card.level).padEnd(5)}${chalk.green(String(b.wins).padEnd(5))}${chalk.red(String(b.losses).padEnd(5))}${rate}`,
    );
  });

  console.log("");
}
