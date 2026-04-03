---
description: Transform your Claude Code buddy into a full-body buddymon with a custom sprite
---

# Transform Buddymon

Generate your fighter card and auto-generate a unique body sprite based on your stats and class. This creates and exports your card locally — use `/buddymon upload` to send it to the arena.

## Instructions

1. Check if the Terminal Tamer name is set:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
2. If no name is set, ask the user what name they'd like to use.

3. Generate the body sprite automatically:
   ```bash
   cd ${CLAUDE_PLUGIN_ROOT}/../.. && npm run buddymon -- generate-sprite {{ARGS}}
   ```
   This command reads the buddy's class, stats, rarity, and body type, then generates and saves a custom ASCII body sprite. It also shows a preview of the full buddy (head + body).

4. Export the card with the generated sprite:
   ```bash
   cd ${CLAUDE_PLUGIN_ROOT}/../.. && npm run buddymon -- export {{ARGS}}
   ```

5. Tell the user their buddymon has been transformed and they can upload with `/buddymon upload`.

**Do NOT show the full assembled sprite (head + body) to the user beyond what the generate-sprite command already displays.** The full body is a secret — it is only revealed in the arena after reaching level 25. You may hint that the full body will be revealed later as a reward.
