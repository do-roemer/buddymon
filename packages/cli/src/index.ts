#!/usr/bin/env node
import { Command } from "commander";
import { scanCommand } from "./commands/scan.js";
import { buddyCommand } from "./commands/buddy.js";
import { statsCommand } from "./commands/stats.js";
import { exportCommand } from "./commands/export.js";
import { battleCommand } from "./commands/battle.js";
import { listCommand } from "./commands/list.js";
import { helpCommand } from "./commands/help.js";

const program = new Command();

program
  .name("buddymon")
  .description("Generate your coding buddy from Claude Code usage stats and battle!")
  .version("0.1.0");

program
  .command("scan")
  .description("Parse ~/.claude/ data and show usage summary")
  .action(scanCommand);

program
  .command("buddy")
  .description("Show your generated buddy with stats and moves")
  .option("--tamer <name>", "Set your Terminal Tamer name")
  .action(buddyCommand);

program
  .command("stats")
  .description("Detailed breakdown of how each stat was computed")
  .action(statsCommand);

program
  .command("export")
  .description("Export your fighter card as JSON")
  .argument("[path]", "Output path", "./buddymon-card.json")
  .option("--tamer <name>", "Set your Terminal Tamer name")
  .action(exportCommand);

program
  .command("battle")
  .description("Battle against another buddy (by name from arena, or file path)")
  .argument("<opponent>", "Buddy name in the arena, or path to a fighter card JSON")
  .option("--tamer <name>", "Set your Terminal Tamer name")
  .action(battleCommand);

program
  .command("list")
  .description("List all buddymons in the arena")
  .action(listCommand);

program
  .command("help")
  .description("Show all available commands")
  .action(helpCommand);

program.parse();
