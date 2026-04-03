---
description: Transform your Claude Code buddy into a full-body buddymon with a custom sprite
---

# Transform Buddymon

Generate your fighter card with an auto-generated body sprite. After this, use `/buddymon upload` to send it to the arena.

## Instructions

1. Check if the Terminal Tamer name is set:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
   If no name is set, ask the user what name they'd like to use (pass it via `--tamer "Name"`).

2. Generate the sprite and export the card in one step:
   ```bash
   cd ${CLAUDE_PLUGIN_ROOT}/../.. && npm run buddymon -- generate-sprite {{ARGS}}
   ```
   This command reads the buddy's class, stats, rarity, and body type, auto-generates a custom ASCII body sprite, saves it, and exports the full fighter card to `buddymon-card.json`.

3. Tell the user their buddymon has been transformed and they can upload with `/buddymon upload`.

**Do NOT show the full assembled sprite beyond what the command already displays.** The full body is revealed in the arena after reaching level 25.
