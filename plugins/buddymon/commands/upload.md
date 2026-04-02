---
description: Upload your buddymon fighter card to the arena
---

# Upload Buddymon

Generate your fighter card from Claude Code usage stats and upload it to the arena.

## Instructions

1. Check if the Terminal Tamer name is set:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
2. If no name is set, ask the user what name they'd like to use.
3. Run the upload:
   ```bash
   cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- upload {{ARGS}}
   ```
4. Show the full output including the arena URL and profile link.

If the command fails with a connection error, check that `.env.local` has `BUDDYMON_ARENA_URL` set.
