---
description: Upload your buddymon fighter card to the arena
---

# Upload Buddymon

Upload your fighter card to the arena. If you haven't transformed yet, run `/buddymon transform` first to create a custom body sprite.

## Instructions

1. Check if the Terminal Tamer name is set:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
2. If no name is set, ask the user what name they'd like to use.

3. Check if a saved card exists (from a previous `/buddymon transform`):
   ```bash
   cat ~/Desktop/personal_projects/buddymon/buddymon-card.json 2>/dev/null | head -5
   ```

4. If a saved card with a `customSprite` exists, upload it with the sprite:
   ```bash
   cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- upload --sprite "$(node -e "const c=JSON.parse(require('fs').readFileSync('buddymon-card.json','utf8'));console.log(c.customSprite.join('\\\\n'))")" {{ARGS}}
   ```

   If no saved card exists, upload without a custom sprite:
   ```bash
   cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- upload {{ARGS}}
   ```

5. Show the full output including the arena URL and profile link.

If the command fails with a connection error, check that `.env.local` has `BUDDYMON_ARENA_URL` set.
