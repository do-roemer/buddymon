import type {
  FighterCard,
  Move,
  MoveType,
  MoveEffect,
  BattleAction,
  BattleTurnLog,
  BattleResult,
  Effectiveness,
} from "./types.js";
import { TYPE_CHART } from "./constants.js";
import { unlockedMoves } from "./progression.js";

const MAX_TURNS = 30;

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(a: string, b: string, ts: string): number {
  const s = a + b + ts;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return hash;
}

// ── Active Buff/Debuff Tracking ──────────────────────────────────────
interface ActiveEffect {
  kind: "buff" | "debuff" | "dot" | "shield";
  stat?: "attack" | "defense" | "speed";
  amount: number;
  turnsLeft: number;
}

interface FighterState {
  card: FighterCard;
  hp: number;
  maxHp: number;
  effects: ActiveEffect[];
  turnCount: number; // for architect passive (every 3rd turn)
}

function getEffectiveAttack(state: FighterState): number {
  let atk = state.card.stats.attack;
  for (const e of state.effects) {
    if (e.kind === "buff" && e.stat === "attack") atk += e.amount;
    if (e.kind === "debuff" && e.stat === "attack") atk -= e.amount;
  }
  // Rage mode: +20% attack when HP < 30%
  if (state.card.stats.rageMode && state.hp < state.maxHp * 0.3) {
    atk = Math.round(atk * 1.2);
  }
  return Math.max(1, atk);
}

function getEffectiveDefense(state: FighterState): number {
  let def = state.card.stats.defense;
  for (const e of state.effects) {
    if (e.kind === "buff" && e.stat === "defense") def += e.amount;
    if (e.kind === "debuff" && e.stat === "defense") def -= e.amount;
  }
  return Math.max(1, def);
}

function getEffectiveSpeed(state: FighterState): number {
  let spd = state.card.stats.speed;
  for (const e of state.effects) {
    if (e.kind === "buff" && e.stat === "speed") spd += e.amount;
    if (e.kind === "debuff" && e.stat === "speed") spd -= e.amount;
  }
  return Math.max(1, spd);
}

function getShieldPercent(state: FighterState): number {
  let shield = 0;
  for (const e of state.effects) {
    if (e.kind === "shield") shield += e.amount;
  }
  return Math.min(shield, 75); // cap at 75%
}

function getEffectiveness(
  moveType: MoveType,
  defenderClass: FighterCard["class"],
): Effectiveness {
  const mult = TYPE_CHART[moveType][defenderClass];
  if (mult > 1) return "super";
  if (mult < 1) return "weak";
  return "normal";
}

function effectivenessNarration(eff: Effectiveness): string {
  switch (eff) {
    case "super": return "It's super effective!";
    case "weak": return "It's not very effective...";
    default: return "";
  }
}

// ── Move Selection AI ────────────────────────────────────────────────
function selectMove(
  attacker: FighterState,
  defender: FighterState,
  rng: () => number,
): Move {
  const allMoves = attacker.card.moves;
  const moves = allMoves.slice(0, unlockedMoves(attacker.card.level));
  const weights = moves.map((m) => {
    const typeMult = TYPE_CHART[m.type][defender.card.class];
    return m.power * typeMult * (m.accuracy / 100);
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let roll = rng() * totalWeight;
  for (let i = 0; i < moves.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return moves[i];
  }
  return moves[moves.length - 1];
}

// ── Apply Move Effect ────────────────────────────────────────────────
function applyEffect(
  effect: MoveEffect,
  attacker: FighterState,
  defender: FighterState,
): string {
  switch (effect.kind) {
    case "buff":
      attacker.effects.push({
        kind: "buff",
        stat: effect.stat,
        amount: effect.amount,
        turnsLeft: effect.turns,
      });
      return `${attacker.card.buddyName}'s ${effect.stat} rose!`;
    case "debuff":
      defender.effects.push({
        kind: "debuff",
        stat: effect.stat,
        amount: effect.amount,
        turnsLeft: effect.turns,
      });
      return `${defender.card.buddyName}'s ${effect.stat} fell!`;
    case "heal": {
      const healAmount = Math.round(attacker.maxHp * (effect.percent / 100));
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
      return `${attacker.card.buddyName} restored ${healAmount} HP!`;
    }
    case "dot":
      defender.effects.push({
        kind: "dot",
        amount: effect.damagePerTurn,
        turnsLeft: effect.turns,
      });
      return `${defender.card.buddyName} is taking damage over time!`;
    case "shield":
      attacker.effects.push({
        kind: "shield",
        amount: effect.percent,
        turnsLeft: effect.turns,
      });
      return `${attacker.card.buddyName} raised a shield!`;
  }
}

// ── Main Battle Resolution ───────────────────────────────────────────
export function resolveBattle(
  card1: FighterCard,
  card2: FighterCard,
  seed?: string,
): BattleResult {
  const rng = mulberry32(
    hashSeed(card1.ownerHash, card2.ownerHash, seed ?? Date.now().toString()),
  );

  const states: [FighterState, FighterState] = [
    { card: card1, hp: card1.stats.hp, maxHp: card1.stats.hp, effects: [], turnCount: 0 },
    { card: card2, hp: card2.stats.hp, maxHp: card2.stats.hp, effects: [], turnCount: 0 },
  ];

  const log: BattleTurnLog[] = [];

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const actions: BattleAction[] = [];

    // Determine turn order by speed + jitter
    const speed0 = getEffectiveSpeed(states[0]) + (rng() * 10 - 5);
    const speed1 = getEffectiveSpeed(states[1]) + (rng() * 10 - 5);
    const order: [0 | 1, 0 | 1] = speed0 >= speed1 ? [0, 1] : [1, 0];

    for (const attackerIdx of order) {
      const defenderIdx = (attackerIdx === 0 ? 1 : 0) as 0 | 1;
      const attacker = states[attackerIdx];
      const defender = states[defenderIdx];

      if (attacker.hp <= 0) continue;

      attacker.turnCount++;

      // Start-of-turn: tick down effects, apply DoTs
      const expiredEffects: number[] = [];
      for (let i = 0; i < attacker.effects.length; i++) {
        attacker.effects[i].turnsLeft--;
        if (attacker.effects[i].turnsLeft <= 0) {
          expiredEffects.push(i);
        }
      }
      for (let i = expiredEffects.length - 1; i >= 0; i--) {
        attacker.effects.splice(expiredEffects[i], 1);
      }

      // Apply DoT damage to this fighter
      for (const e of attacker.effects) {
        if (e.kind === "dot") {
          attacker.hp = Math.max(0, attacker.hp - e.amount);
          actions.push({
            type: "damage_tick",
            actorIdx: defenderIdx,
            targetIdx: attackerIdx,
            damage: e.amount,
            hpAfter: [states[0].hp, states[1].hp],
            narration: `${attacker.card.buddyName} takes ${e.amount} damage from status effect!`,
          });
          if (attacker.hp <= 0) break;
        }
      }
      if (attacker.hp <= 0) {
        actions.push({
          type: "ko",
          actorIdx: defenderIdx,
          targetIdx: attackerIdx,
          hpAfter: [states[0].hp, states[1].hp],
          narration: `${attacker.card.buddyName} fainted from status damage!`,
        });
        break;
      }

      // Start-of-turn passives
      if (attacker.card.passive.trigger === "start_of_turn") {
        // Architect: every 3rd turn
        if (attacker.card.class === "architect" && attacker.turnCount % 3 === 0) {
          const narr = applyEffect(attacker.card.passive.effect, attacker, defender);
          actions.push({
            type: "passive",
            actorIdx: attackerIdx,
            targetIdx: attackerIdx,
            hpAfter: [states[0].hp, states[1].hp],
            narration: `${attacker.card.buddyName}'s ${attacker.card.passive.name} activates! ${narr}`,
          });
        }
        // Builder: every turn
        if (attacker.card.class === "builder") {
          const narr = applyEffect(attacker.card.passive.effect, attacker, defender);
          actions.push({
            type: "passive",
            actorIdx: attackerIdx,
            targetIdx: attackerIdx,
            hpAfter: [states[0].hp, states[1].hp],
            narration: `${attacker.card.buddyName}'s ${attacker.card.passive.name} activates! ${narr}`,
          });
        }
      }

      // Select and execute move
      const move = selectMove(attacker, defender, rng);
      const accuracyRoll = rng() * 100;

      if (accuracyRoll > move.accuracy) {
        // Miss!
        actions.push({
          type: "miss",
          actorIdx: attackerIdx,
          targetIdx: defenderIdx,
          moveName: move.name,
          moveType: move.type,
          hpAfter: [states[0].hp, states[1].hp],
          narration: `${attacker.card.buddyName} used ${move.name}... but it missed!`,
        });

        // Explorer dodge passive
        if (defender.card.passive.trigger === "on_dodge") {
          const narr = applyEffect(defender.card.passive.effect, defender, attacker);
          actions.push({
            type: "passive",
            actorIdx: defenderIdx,
            targetIdx: attackerIdx,
            hpAfter: [states[0].hp, states[1].hp],
            narration: `${defender.card.buddyName}'s ${defender.card.passive.name} activates! ${narr}`,
          });
        }
        continue;
      }

      // Hit! Calculate damage
      const effAtk = getEffectiveAttack(attacker);
      const effDef = getEffectiveDefense(defender);
      const typeMult = TYPE_CHART[move.type][defender.card.class];
      const effectiveness = getEffectiveness(move.type, defender.card.class);

      const isCrit = rng() * 100 < attacker.card.stats.critChance;
      const critMult = isCrit ? 1.5 : 1.0;
      const rageMult =
        attacker.card.stats.rageMode && attacker.hp < attacker.maxHp * 0.3
          ? 1.2
          : 1.0;
      const variance = 0.85 + rng() * 0.15;
      const shieldMult = 1 - getShieldPercent(defender) / 100;

      const baseDamage = (move.power * effAtk) / (50 + effDef);
      const finalDamage = Math.max(
        1,
        Math.floor(baseDamage * typeMult * critMult * rageMult * variance * shieldMult),
      );

      defender.hp = Math.max(0, defender.hp - finalDamage);

      let narration = `${attacker.card.buddyName} used ${move.name}!`;
      if (isCrit) narration += " Critical hit!";
      const effNarr = effectivenessNarration(effectiveness);
      if (effNarr) narration += ` ${effNarr}`;
      narration += ` Dealt ${finalDamage} damage.`;

      actions.push({
        type: "attack",
        actorIdx: attackerIdx,
        targetIdx: defenderIdx,
        moveName: move.name,
        moveType: move.type,
        damage: finalDamage,
        isCrit,
        effectiveness,
        hpAfter: [states[0].hp, states[1].hp],
        narration,
      });

      // Apply move effect
      if (move.effect) {
        const effectNarr = applyEffect(move.effect, attacker, defender);
        actions.push({
          type: "effect",
          actorIdx: attackerIdx,
          targetIdx: defenderIdx,
          hpAfter: [states[0].hp, states[1].hp],
          narration: effectNarr,
        });
      }

      // On-crit passive (Commander)
      if (isCrit && attacker.card.passive.trigger === "on_crit") {
        const narr = applyEffect(attacker.card.passive.effect, attacker, defender);
        actions.push({
          type: "passive",
          actorIdx: attackerIdx,
          targetIdx: defenderIdx,
          hpAfter: [states[0].hp, states[1].hp],
          narration: `${attacker.card.buddyName}'s ${attacker.card.passive.name} activates! ${narr}`,
        });
      }

      // On-hit passive (Debugger — defender heals when hit)
      if (defender.card.passive.trigger === "on_hit" && defender.hp > 0) {
        const narr = applyEffect(defender.card.passive.effect, defender, attacker);
        actions.push({
          type: "passive",
          actorIdx: defenderIdx,
          targetIdx: defenderIdx,
          hpAfter: [states[0].hp, states[1].hp],
          narration: `${defender.card.buddyName}'s ${defender.card.passive.name} activates! ${narr}`,
        });
      }

      // Check KO
      if (defender.hp <= 0) {
        actions.push({
          type: "ko",
          actorIdx: attackerIdx,
          targetIdx: defenderIdx,
          hpAfter: [states[0].hp, states[1].hp],
          narration: `${defender.card.buddyName} fainted!`,
        });
        break;
      }
    }

    log.push({ turnNumber: turn, actions });

    // Check if battle is over
    if (states[0].hp <= 0 || states[1].hp <= 0) break;
  }

  // Determine winner (by remaining HP percentage if timeout)
  let winner: 0 | 1;
  if (states[0].hp <= 0) {
    winner = 1;
  } else if (states[1].hp <= 0) {
    winner = 0;
  } else {
    // Timeout: higher HP% wins
    const pct0 = states[0].hp / states[0].maxHp;
    const pct1 = states[1].hp / states[1].maxHp;
    winner = pct0 >= pct1 ? 0 : 1;
  }

  return {
    winner,
    turns: log.length,
    log,
    fighters: [card1, card2],
  };
}
