---
name: buddymon
description: "Your Claude Code fighter card — create, battle, and climb the leaderboard"
---

# Buddymon - Claude Code Fighter Card

You are executing the `/buddymon` command. The Buddymon project lives at `~/Desktop/personal_projects/buddymon`.

Parse the user's arguments to determine the subcommand and run the appropriate CLI command.

## Terminal Tamer Name

The fighter card includes a "Terminal Tamer" field — the name of the person behind the buddy. The name is stored in `~/.config/buddymon/config.json`.

**Before running any card-generating command** (`buddy`, `upload`):
1. Check if the config file exists and contains a `terminalTamer` value:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
2. If no name is set, **ask the user** what name they'd like to use as their Terminal Tamer name.
3. Pass the name via `--tamer "Name"` on the first run. After that, the CLI remembers it.

## Subcommands

### (no argument) or `buddy`
Show your fighter card with ASCII art, stats, and moves.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts buddy [--tamer "Name"]
```

### help
Show all available commands.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts help
```

### upload
Generate your fighter card and upload it to the arena.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts upload [--tamer "Name"]
```
Your buddy is now visible to other players. The CLI uses `BUDDYMON_ARENA_URL` (defaults to `http://localhost:3000`).

### list
List all buddies in the arena with their tamer, species, class, level, and record.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts list
```

### battle
Battle an opponent by name or file path.
```bash
# By name (opponent in the arena)
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts battle <opponent-name>

# By file (exported card)
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts battle <path-to-card.json>
```

### leaderboard
Show arena rankings.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts leaderboard
```

### export
Export your fighter card to a local JSON file for sharing.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts export [--tamer "Name"]
```

### scan
Show raw Claude Code usage data used to compute stats.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts scan
```

### stats
Show detailed stat computation breakdown.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts stats [--tamer "Name"]
```

## Important
- Always run commands from the buddymon project directory: `~/Desktop/personal_projects/buddymon`
- Show the full output of CLI commands to the user — the ASCII art and colored output is part of the experience
- If any command fails with a module not found error, suggest running `npm install` in the project directory first
