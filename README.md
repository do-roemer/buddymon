# Buddymon

Turn your Claude Code usage stats into a battle-ready fighter card. Challenge teammates in the arena.

## Prerequisites

- [Claude Code](https://claude.ai/code) (the CLI tool)
- Node.js 18+ (for local development only)

## Getting Started

### Option A — Install from GitHub (recommended)

No cloning needed. In Claude Code, add the marketplace and install the plugin:

```
/plugin marketplace add do-roemer/buddymon
```

Then open `/plugin` → Discover tab → install **buddymon**.

Once installed, run:

```
/buddymon
```

You should see your fighter card with ASCII art, stats, and moves. If this is your first time, Claude will ask you to choose a **Terminal Tamer** name — this is the trainer name displayed on your card.

### Option B — Local development (contributors)

Clone the repo and install dependencies:

```bash
git clone https://github.com/do-roemer/buddymon.git && cd buddymon
npm install
```

No build step required — the project uses `tsx` to run TypeScript directly.

Then add the local checkout as a marketplace in Claude Code:

```
/plugin marketplace add /absolute/path/to/buddymon
```

Replace `/absolute/path/to/buddymon` with the actual path where you cloned the repo. Then install the plugin from the Discover tab as above.

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

## Deploying the Arena on Vercel

The web app can run on Vercel, but it needs durable external storage for uploads,
battles, and leaderboard data. The arena now expects an Upstash Redis database via:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

On Vercel, add an Upstash Redis integration from the Marketplace and expose those
environment variables to the `@buddymon/web` project.

For local development, if those environment variables are not set, the web app
falls back to `data/db.json` in the repo root.

## How Stats Work

Your buddy's stats are derived from your Claude Code usage in `~/.claude/`. The pipeline has 6 stages:

```
~/.claude/ (raw data)
    │
    ├─ stats-cache.json
    ├─ usage-data/session-meta/*.json
    └─ usage-data/facets/*.json
    │
    ▼
┌─────────────┐
│ Stats Parser │ → RawAggregate
└─────────────┘
    │
    ├─→ Class Resolver  → FighterClass
    ├─→ Stats Computer  → FighterStats (HP, ATK, DEF, SPD, CRIT, Rage)
    ├─→ Move Resolver   → 4 moves
    ├─→ Name Generator  → title
    └─→ Companion       → species, rarity, base stats, cosmetics
    │
    ▼
┌──────────────┐
│ Fighter Card │ → signed JSON
└──────────────┘
```

### Stage 1: Data Parsing (`stats-parser.ts`)

Reads from three sources in `~/.claude/`:

| Source | Data extracted |
|---|---|
| `stats-cache.json` | `totalSessions`, `totalMessages`, `hourCounts`, `dailyActivity`, `modelUsage` |
| `usage-data/session-meta/*.json` | Tool call counts per tool, tool errors, session duration, lines added/removed, languages used, late-night session detection (hours 22-4) |
| `usage-data/facets/*.json` | Outcome scores (`fully_achieved`→3, `mostly_achieved`→2, `partially_achieved`→1), helpfulness scores (`essential`→4, `very_helpful`→3, `somewhat_helpful`→2, `slightly_helpful`→1) |

Output: `RawAggregate` — a flat object with all aggregated usage data.

### Stage 2: Companion Traits (`companion.ts`)

Reads `~/.claude.json` to get your Claude Code companion data (name, personality). Uses your account ID to deterministically roll traits via a **seeded PRNG** (Mulberry32 with FNV-1a hash, salt: `"friend-2026-401"`).

**Roll order (deterministic):**

1. **Rarity** (weighted random):

   | Rarity | Weight |
   |---|---|
   | Common | 60% |
   | Uncommon | 25% |
   | Rare | 10% |
   | Epic | 4% |
   | Legendary | 1% |

2. **Species** — uniform random from 18 species (duck, goose, cat, rabbit, owl, penguin, turtle, snail, dragon, octopus, axolotl, ghost, robot, blob, cactus, mushroom, chonk, capybara)

3. **Eye** — uniform random from eye character set (`·`, `✦`, `×`, `◉`, `@`, `°`)

4. **Hat** — `"none"` if common rarity, otherwise uniform from hat set (crown, tophat, propeller, halo, wizard, beanie, tinyduck)

5. **Shiny** — 1% chance

6. **Base stats** — 5 stats rolled per rarity floor:

   | Rarity | Floor |
   |---|---|
   | Common | 5 |
   | Uncommon | 15 |
   | Rare | 25 |
   | Epic | 35 |
   | Legendary | 50 |

   One random stat is the **peak** (`min(100, floor + 50 + random*30)`), one is the **dump** (`max(1, floor - 10 + random*15)`), the rest are normal (`floor + random*40`).

   The 5 base stats are: `debugging`, `patience`, `chaos`, `wisdom`, `snark`.

### Stage 3: Class Resolution (`class-resolver.ts`)

Your class is determined by which tools you use most.

**Debugger override:** If error rate (`totalToolErrors / totalToolCalls`) > 10% AND average outcome score ≥ 2.0, you're a Debugger.

Otherwise, tool calls are grouped and the dominant group determines class:

| Tool Group | Tools | Class |
|---|---|---|
| Read | Read, Grep, Glob, WebSearch, WebFetch | Explorer |
| Write | Write, Edit, NotebookEdit | Builder |
| Bash | Bash | Commander |
| Agent | Agent, Tasks, Plans, Skills, MCP tools | Architect |

### Stage 4: Stat Computation (`stats-computer.ts`)

Base stats from the companion are mapped to fighter stats, then usage bonuses are added (40% weight, capped at +40 per stat):

| Base Stat | Fighter Stat | Base Formula | Usage Bonus Source |
|---|---|---|---|
| Patience | HP | `80 + (patience/100) × 140` → 80-220 | `(totalMessages + totalSessions×10) / 500`, capped at +80 |
| Chaos | ATK | `chaos × 0.6` → 0-60 | Sigmoid of tools-per-session (midpoint=15, steepness=0.15), ×0.4 |
| Debugging | DEF | `debugging × 0.6` → 0-60 | `(avgOutcome / 3) × 40` |
| Wisdom | SPD | `wisdom × 0.6` → 0-60 | Sigmoid of `1/avgSessionDuration` (midpoint=0.05, steepness=40), ×0.4. Shorter sessions → faster. |
| Snark | CRIT | `5 + (snark/100) × 15` → 5-20 | Longest daily streak, capped at +10 |

**Final stat ranges:** HP 80-300, ATK/DEF/SPD 1-100, CRIT 5-30%.

**Rage Mode:** Activates if >15% of sessions are late-night (hours 22-4).

**Level:** `floor(totalSessions / 7)`, capped at 50.

### Stage 5: Move Resolution (`move-resolver.ts`)

4 moves are selected based on your top 3 tool groups:

1. **Top group:** highest-power move + one utility move (has a status effect)
2. **2nd group:** medium-power move
3. **3rd group:** highest-accuracy move

Each move type has 4 options in the catalog (e.g. Read moves: Deep Scan, Pattern Match, Glob Storm, Source Dive). Moves have power (0-120), accuracy (60-100), and optional effects (buff, debuff, shield, heal, DoT).

### Stage 6: Title Generation (`name-generator.ts`)

Title is deterministic based on `ownerHash` + `favoriteHour`:

- **Late-night coders** (peak hour 22-4): titles like "The Midnight Coder", "The 3AM Debugger"
- **Early birds** (peak hour 5-7): titles like "The Dawn Compiler", "The Early Committer"
- **Others:** class-specific titles (e.g. Explorer → "The Code Archaeologist", "The Pattern Seeker")

### Signing

The final card is signed with HMAC-SHA256 (key: `"buddymon-v1"`) over the JSON payload. This prevents tampering with exported cards.
