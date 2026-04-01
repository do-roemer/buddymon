---
name: buddymon
description: "Battle your Claude Code buddy! Commands: buddy (default), export, upload, list, battle, leaderboard, scan, stats, help"
---

# Buddymon - Claude Code Battle Game

You are executing the `/buddymon` command. The Buddymon project lives at `~/Desktop/personal_projects/buddymon`.

Parse the user's arguments to determine the subcommand. If no argument is given, default to `buddy`.

## Terminal Tamer Name

The fighter card includes a "Terminal Tamer" field — the name of the person behind the buddy. The name is stored in `~/.config/buddymon/config.json`.

**Before running any card-generating command** (`buddy`, `export`, `upload`, `battle`):
1. Check if the config file exists and contains a `terminalTamer` value:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
2. If no name is set, **ask the user** what name they'd like to use as their Terminal Tamer name.
3. Pass the name via `--tamer "Name"` on the first run. After that, the CLI remembers it.

If the user wants to change their name later, pass `--tamer "New Name"` to any command.

## Subcommands

### buddy (default)
Show the user's fighter card with ASCII art, stats, and moves.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts buddy [--tamer "Name"]
```

### scan
Show raw Claude Code usage data summary.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts scan
```

### stats
Show detailed stat computation breakdown (base stats + usage bonuses).
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts stats
```

### export
Export the fighter card to a JSON file.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts export ~/Desktop/personal_projects/buddymon/buddymon-card.json [--tamer "Name"]
```
Tell the user where the file was saved.

### upload
Generate the fighter card and upload it to the web arena:
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts upload [--tamer "Name"]
```

If the upload succeeds, tell the user their buddy is in the arena. The CLI reads
`BUDDYMON_ARENA_URL` and defaults to `http://localhost:3000`.

### list
List all buddymons in the arena.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts list
```
If the arena is not running, tell the user to start it first.

### battle <opponent>
Battle against another buddy. The opponent can be specified as:
- **A buddy name** — fetches the opponent from the arena by name (e.g., `battle Rindwick`)
- **A file path** — loads from a local JSON file (e.g., `battle ./card.json`)

```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts battle "<opponent>" [--tamer "Name"]
```

If battling by name and the arena is not running, tell the user to start it first or provide a file path instead.

### leaderboard
Fetch and display the arena leaderboard:
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts leaderboard
```

### help
Show all available commands with descriptions.
```bash
cd ~/Desktop/personal_projects/buddymon && node --import tsx packages/cli/src/index.ts help
```

## Important
- Always run commands from the buddymon project directory: `~/Desktop/personal_projects/buddymon`
- Show the full output of CLI commands to the user — the ASCII art and colored output is part of the fun
- If any command fails with a module not found error, suggest running `npm install` in the project directory first
