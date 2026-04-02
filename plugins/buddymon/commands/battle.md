---
description: Battle another buddymon fighter in the arena
argument-hint: "<opponent-name>"
---

# Battle Buddymon

Battle against another buddymon from the arena by name, or battle a local exported card.

## Instructions

1. Run the battle command:
   ```bash
   cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- battle {{ARGS}}
   ```
2. Show the full battle output to the user — the play-by-play is part of the experience.

## Examples

```bash
# By arena name
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- battle Rindwick

# By local file
cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- battle ./exported-card.json
```
