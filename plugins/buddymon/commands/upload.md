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

If the command fails with a DNS/connection error (e.g. `ENOTFOUND`, `getaddrinfo`, or "Could not connect to the arena") this is likely the sandbox blocking outbound network access to `*.vercel.app`. **Do NOT retry with `dangerouslyDisableSandbox`.** Instead, print the exact command the user needs to run themselves using the `!` prefix (which executes in the current session). Format it as a single copy-paste block, e.g.:

```
Run this in your terminal (paste as-is):

! cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- upload --sprite "..."
```

Make sure the command includes the full `--sprite` value so the user doesn't have to assemble it.
