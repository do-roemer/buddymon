---
name: bmon-battle
description: Battle another player's fighter card
---

# Buddymon Battle

Battle against another buddymon from the arena or a local card file.

## Usage

Battle someone in the arena by name:
```bash
npm run buddymon -- battle <opponent-name>
```

Battle a local exported card:
```bash
npm run buddymon -- battle ./path/to/card.json
```

## How Battles Work

Battles are turn-based combat simulations where:
- Each buddy uses their moves and stats to attack, defend, or use special abilities
- Winners are determined by stat calculations and strategic move choices
- Battle results are recorded and affect leaderboard rankings
- Both players' win/loss records are updated

## Examples

```bash
npm run buddymon -- battle Rindwick
npm run buddymon -- battle ./exported-card.json
```

After a battle, you'll see:
- Battle result (win/loss)
- Updated rankings
- Link to view the battle details
