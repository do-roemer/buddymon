---
name: bmon-upload
description: Upload your fighter card to the buddymon arena
---

# Buddymon Upload

Upload your Claude Code fighter card to the buddymon arena.

## Usage

```bash
npm run buddymon -- upload [--tamer "Your Name"]
```

If you haven't set your Terminal Tamer name before, you'll be prompted. Optionally pass `--tamer "Your Name"` to set it.

Your fighter card is generated from your Claude Code usage stats (sessions, tools used, code complexity, etc.) and uploaded to the public arena at https://buddymon.vercel.app

Once uploaded, you can:
- View your profile: https://buddymon.vercel.app/buddy/{id}
- Battle other players
- Climb the leaderboard

## What Gets Uploaded

- **Fighter Stats**: Based on your Claude Code activity (speed, power, defense, etc.)
- **Moves**: Unique abilities tied to your coding style
- **Passive Ability**: Bonus based on your terminal tamer profile
- **Sprite**: Randomly assigned buddymon character with customizations

Your actual code is NOT uploaded—only aggregated statistics and a randomly assigned buddy character.
