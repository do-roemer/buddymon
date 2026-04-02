---
name: buddymon
description: >-
  Trigger phrases: "buddymon", "fighter card", "upload buddy", "battle buddy",
  "arena leaderboard", "show my buddy", "buddymon stats", "transform buddymon".
  Execute buddymon CLI commands to create, upload, transform, battle, and manage fighter cards.
allowed-tools: Bash, Read
version: 0.1.0
---

# Buddymon - Claude Code Fighter Card

The Buddymon project lives at `~/Desktop/personal_projects/buddymon`.

All commands use the npm script wrapper which loads `.env.local` automatically:
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- <subcommand> [options]
```

## Terminal Tamer Name

The fighter card includes a "Terminal Tamer" field — the name of the person behind the buddy. The name is stored in `~/.config/buddymon/config.json`.

**Before running any card-generating command** (`buddy`, `upload`, `stats`, `export`):
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
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- buddy [--tamer "Name"]
```

### transform
Generate your fighter card with a custom full-body sprite designed by Claude. Exports the card locally — use `upload` to send it to the arena.
```bash
/buddymon transform [--tamer "Name"]
```
See the `/buddymon transform` command for full details.

### upload
Upload your fighter card to the arena. Picks up the custom sprite from a previous `transform` if available.
```bash
/buddymon upload [--tamer "Name"]
```

### battle
Battle an opponent by name or file path.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- battle <opponent-name>
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- battle <path-to-card.json>
```

### list
List all buddies in the arena.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- list
```

### leaderboard
Show arena rankings.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- leaderboard
```

### stats
Show detailed stat computation breakdown.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- stats [--tamer "Name"]
```

### scan
Show raw Claude Code usage data.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- scan
```

### export
Export your fighter card to a local JSON file.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- export [--tamer "Name"]
```

### help
Show all available commands.
```bash
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- help
```

## Important
- Always run commands from the buddymon project directory
- Show the full CLI output to the user — the ASCII art and colored output is part of the experience
- If any command fails with a module not found error, run `npm install` in the project directory first
