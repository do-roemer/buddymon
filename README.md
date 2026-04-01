# Buddymon

Turn your Claude Code usage stats into a battle-ready fighter card. Challenge teammates in the arena.

## Prerequisites

- Node.js 18+
- [Claude Code](https://claude.ai/code) (the CLI tool)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/do-roemer/buddymon.git && cd buddymon
npm install
```

No build step required — the project uses `tsx` to run TypeScript directly.

### 2. Install the Claude Code plugin

All Buddymon commands run through Claude Code via the `/buddymon` slash command. To enable it, add the plugin to your Claude Code settings.

Open `.claude/settings.json` in your project (or global settings at `~/.claude/settings.json`) and add:

```json
{
  "plugins": ["buddymon@local:/absolute/path/to/buddymon/plugin"]
}
```

Replace `/absolute/path/to/buddymon` with the actual path where you cloned the repo.

### 3. Verify the plugin

Open Claude Code and type:

```
/buddymon
```

You should see your fighter card with ASCII art, stats, and moves. If this is your first time, Claude will ask you to choose a **Terminal Tamer** name — this is the trainer name displayed on your card.

## Commands

| Command | Description |
|---|---|
| `/buddymon` | Show your fighter card |
| `/buddymon help` | Show all available commands |
| `/buddymon upload` | Upload your card to the arena |
| `/buddymon list` | List all buddies in the arena |
| `/buddymon battle <opponent>` | Battle by name or file path |
| `/buddymon leaderboard` | Show arena rankings |
| `/buddymon export` | Export card to a local JSON file |
| `/buddymon scan` | Raw Claude Code usage data |
| `/buddymon stats` | Detailed stat computation breakdown |

## Joining the Arena

### 1. Upload your card

In Claude Code, run:

```
/buddymon upload
```

Claude will generate your fighter card from your Claude Code usage data and upload it to the arena. Your buddy is now visible to other players.

### 2. List opponents

```
/buddymon list
```

Shows all uploaded buddymons with their tamer, species, class, level, and win/loss record.

### 3. Battle

**By name** — pick an opponent from the arena:

```
/buddymon battle Voltaire
```

**By file** — battle a teammate's exported card directly:

```
/buddymon battle ./teammate-card.json
```

### 4. Check the leaderboard

```
/buddymon leaderboard
```

## How Stats Work

Your buddy's stats are derived from your Claude Code usage in `~/.claude/`. The more you use Claude Code, the stronger your buddy gets.

| Base Stat | Fighter Stat | Source |
|---|---|---|
| Patience | HP | Session duration, message count |
| Debugging | Defense | Error recovery rate, debug tool usage |
| Chaos | Attack | Tool call volume, variety |
| Wisdom | Speed | Language diversity, successful outcomes |
| Snark | Crit Chance | Late-night sessions, edge-case patterns |

**Level** = `total sessions / 7` (capped at 50)

**Class** is determined by your tool usage distribution:

| Class | Style |
|---|---|
| Explorer | Heavy Read/Glob usage |
| Builder | Heavy Write/Edit usage |
| Commander | Heavy Bash/Agent usage |
| Architect | Balanced across all tools |
| Debugger | High error rate with good recovery |

**Moves** are selected from your top tool groups. Higher usage in a category = stronger moves of that type.

**Cosmetics** (rarity, eye character, hat, shiny) are derived deterministically from your Claude Code account ID — the same companion you see in Claude Code.
