#!/usr/bin/env node
import { Command } from "commander";
import { scanCommand } from "./commands/scan.js";
import { buddyCommand } from "./commands/buddy.js";
import { statsCommand } from "./commands/stats.js";
import { exportCommand } from "./commands/export.js";
import { listCommand } from "./commands/list.js";
import { leaderboardCommand } from "./commands/leaderboard.js";
import { helpCommand } from "./commands/help.js";
import { uploadCommand } from "./commands/upload.js";
import { feedCommand } from "./commands/feed.js";
import { generateSpriteCommand } from "./commands/generate-sprite.js";
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
  .option("--sprite <lines>", "Custom ASCII body sprite (lines separated by \\n)")
  .option("--body-type <type>", "Body type: biped (standing) or quadruped (on all fours)")
  .action(exportCommand);

program
  .command("upload")
  .description("Generate and upload your fighter card to the arena")
  .option("--tamer <name>", "Set your Terminal Tamer name")
  .option("--name <buddyName>", "Override your buddy's name")
  .option("--sprite <lines>", "Custom ASCII sprite (lines separated by \\n)")
  .option("--body-type <type>", "Body type: biped (standing) or quadruped (on all fours)")
  .option("--fake-identity", "Use a random owner hash (testing only)")
  .action(uploadCommand);

program
  .command("list")
  .description("List all buddymons in the arena")
  .action(listCommand);

program
  .command("generate-sprite")
  .description("Auto-generate a body sprite and export the fighter card")
  .argument("[path]", "Output path", "./buddymon-card.json")
  .option("--tamer <name>", "Set your Terminal Tamer name")
  .action(generateSpriteCommand);

program
  .command("feed")
  .description("Feed your buddy with burned tokens to gain XP")
  .action(feedCommand);

program
  .command("leaderboard")
  .description("Show the arena leaderboard")
  .action(leaderboardCommand);

program
  .command("help")
  .description("Show all available commands")
  .action(helpCommand);

program.parse();
