"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { BattleResult, BattleAction, FighterCard, MoveType, Effectiveness } from "@buddymon/shared-types";
import { BuddySprite } from "./BuddySprite";

// ── Projectile config per move type ──────────────────────────────────
const PROJECTILES: Record<MoveType, { glyph: string; color: string }> = {
  read:  { glyph: ">>",  color: "#06b6d4" }, // cyan
  write: { glyph: "{}", color: "#eab308" }, // yellow
  bash:  { glyph: "$_",  color: "#ef4444" }, // red
  agent: { glyph: "@>",  color: "#a855f7" }, // purple
  debug: { glyph: "{!}", color: "#22c55e" }, // green
};

const EFFECTIVENESS_TEXT: Record<Effectiveness, { text: string; color: string } | null> = {
  super:  { text: "Super effective!", color: "#facc15" },
  weak:   { text: "Not very effective...", color: "#6b7280" },
  normal: null,
};

interface Props {
  result: BattleResult;
  onComplete?: () => void;
}

export function BattleArena({ result, onComplete }: Props) {
  const [currentActionIdx, setCurrentActionIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hp, setHp] = useState<[number, number]>([
    result.fighters[0].stats.hp,
    result.fighters[1].stats.hp,
  ]);
  const [shaking, setShaking] = useState<0 | 1 | null>(null);
  const [damagePopup, setDamagePopup] = useState<{
    idx: 0 | 1;
    amount: number;
    isCrit: boolean;
  } | null>(null);
  const [projectile, setProjectile] = useState<{
    moveType: MoveType;
    direction: "ltr" | "rtl";
    isCrit: boolean;
  } | null>(null);
  const [effectAnim, setEffectAnim] = useState<{
    idx: 0 | 1;
    kind: "heal" | "shield" | "dot";
  } | null>(null);
  const [effectivenessPopup, setEffectivenessPopup] = useState<{
    text: string;
    color: string;
  } | null>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  const allActions = result.log.flatMap((turn) => turn.actions);

  const playAction = useCallback(
    (idx: number) => {
      if (idx >= allActions.length) {
        setIsPlaying(false);
        return;
      }

      const action = allActions[idx];
      setCurrentActionIdx(idx);
      setHp(action.hpAfter);

      if (action.type === "attack" && action.moveType) {
        const direction = action.actorIdx === 0 ? "ltr" : "rtl";

        // 1. Launch projectile
        setProjectile({
          moveType: action.moveType,
          direction,
          isCrit: action.isCrit ?? false,
        });

        // 2. On projectile arrival (~400ms): shake + damage + effectiveness
        setTimeout(() => {
          setProjectile(null);
          setShaking(action.targetIdx);
          setDamagePopup({
            idx: action.targetIdx,
            amount: action.damage ?? 0,
            isCrit: action.isCrit ?? false,
          });

          // Show effectiveness callout
          if (action.effectiveness) {
            const eff = EFFECTIVENESS_TEXT[action.effectiveness];
            if (eff) {
              setEffectivenessPopup(eff);
              setTimeout(() => setEffectivenessPopup(null), 1200);
            }
          }

          // Flash target on crit
          setTimeout(() => setShaking(null), 300);
          setTimeout(() => setDamagePopup(null), 1000);
        }, 400);
      }

      if (action.type === "damage_tick") {
        setEffectAnim({ idx: action.targetIdx, kind: "dot" });
        setTimeout(() => setEffectAnim(null), 700);
      }

      if (action.type === "effect") {
        const narr = action.narration.toLowerCase();
        if (narr.includes("restored") || narr.includes("heal")) {
          setEffectAnim({ idx: action.actorIdx, kind: "heal" });
          setTimeout(() => setEffectAnim(null), 800);
        } else if (narr.includes("shield")) {
          setEffectAnim({ idx: action.actorIdx, kind: "shield" });
          setTimeout(() => setEffectAnim(null), 600);
        } else if (narr.includes("damage over time") || narr.includes("dot")) {
          setEffectAnim({ idx: action.targetIdx, kind: "dot" });
          setTimeout(() => setEffectAnim(null), 700);
        }
      }
    },
    [allActions],
  );

  useEffect(() => {
    if (!isPlaying) return;

    const next = currentActionIdx + 1;
    if (next >= allActions.length) {
      setIsPlaying(false);
      onComplete?.();
      return;
    }

    // Attacks need more time (projectile 400ms + impact anims)
    const delay = allActions[next]?.type === "attack" ? 2800 : 1500;
    const timer = setTimeout(() => playAction(next), delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentActionIdx, allActions, playAction]);

  const start = () => {
    setCurrentActionIdx(-1);
    setHp([result.fighters[0].stats.hp, result.fighters[1].stats.hp]);
    setProjectile(null);
    setEffectAnim(null);
    setEffectivenessPopup(null);
    setIsPlaying(true);
    setTimeout(() => playAction(0), 500);
  };

  const skipToEnd = () => {
    setIsPlaying(false);
    setProjectile(null);
    setEffectAnim(null);
    setEffectivenessPopup(null);
    const lastAction = allActions[allActions.length - 1];
    setCurrentActionIdx(allActions.length - 1);
    if (lastAction) setHp(lastAction.hpAfter);
  };

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
      playAction(0);
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentAction = currentActionIdx >= 0 ? allActions[currentActionIdx] : null;
  const isDone = currentActionIdx >= allActions.length - 1 && !isPlaying;
  const f1 = result.fighters[0];
  const f2 = result.fighters[1];

  return (
    <div ref={arenaRef} className="bg-[var(--bg-card)] pixel-border border-gray-600 rounded-lg p-6 relative scanlines">
      {/* Fighter display */}
      <div className="flex items-center justify-between mb-8 relative">
        {/* Fighter 1 */}
        <FighterDisplay
          card={f1}
          hp={hp[0]}
          isShaking={shaking === 0}
          isCritFlash={shaking === 0 && damagePopup?.isCrit === true}
          damagePopup={damagePopup?.idx === 0 ? damagePopup : null}
          effectAnim={effectAnim?.idx === 0 ? effectAnim.kind : null}
          side="left"
        />

        <div className="text-2xl font-bold text-gray-500">VS</div>

        {/* Fighter 2 */}
        <FighterDisplay
          card={f2}
          hp={hp[1]}
          isShaking={shaking === 1}
          isCritFlash={shaking === 1 && damagePopup?.isCrit === true}
          damagePopup={damagePopup?.idx === 1 ? damagePopup : null}
          effectAnim={effectAnim?.idx === 1 ? effectAnim.kind : null}
          side="right"
        />

        {/* Projectile layer */}
        {projectile && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              projectile.direction === "ltr" ? "left-[15%]" : "right-[15%]"
            } animate-projectile-${projectile.direction} z-10`}
            style={{
              "--projectile-distance": "200px",
              fontFamily: "'Courier New', monospace",
              fontSize: projectile.isCrit ? "20px" : "14px",
              fontWeight: "bold",
              color: PROJECTILES[projectile.moveType].color,
              textShadow: `0 0 8px ${PROJECTILES[projectile.moveType].color}, 0 0 16px ${PROJECTILES[projectile.moveType].color}`,
            } as React.CSSProperties}
          >
            {PROJECTILES[projectile.moveType].glyph}
          </div>
        )}

        {/* Effectiveness callout */}
        {effectivenessPopup && (
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-effectiveness z-20 whitespace-nowrap"
            style={{
              color: effectivenessPopup.color,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              textShadow: `0 0 6px ${effectivenessPopup.color}`,
            }}
          >
            {effectivenessPopup.text}
          </div>
        )}
      </div>

      {/* Action log */}
      <div className="bg-black/30 rounded p-3 min-h-[60px] mb-4">
        {currentAction ? (
          <p className="text-xs text-gray-200">
            <HighlightNames text={currentAction.narration} name1={f1.buddyName} name2={f2.buddyName} />
          </p>
        ) : isDone ? (
          <p className="text-sm font-bold text-yellow-400">
            <HighlightNames text={`${result.fighters[result.winner].buddyName} WINS in ${result.turns} turns!`} name1={f1.buddyName} name2={f2.buddyName} />
          </p>
        ) : (
          <p className="text-xs text-gray-500">Ready to battle...</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {isPlaying && (
          <button
            onClick={skipToEnd}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
          >
            Skip
          </button>
        )}
        {isDone && (
          <button
            onClick={start}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
          >
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

// ── Effect overlay glyphs ─────────────────────────────────────────────
const EFFECT_GLYPHS: Record<string, { glyph: string; color: string }> = {
  heal:   { glyph: "+HP", color: "#22c55e" },
  shield: { glyph: "[===]", color: "#3b82f6" },
  dot:    { glyph: "~*~", color: "#f97316" },
};

function FighterDisplay({
  card,
  hp,
  isShaking,
  isCritFlash,
  damagePopup,
  effectAnim,
  side,
}: {
  card: FighterCard;
  hp: number;
  isShaking: boolean;
  isCritFlash: boolean;
  damagePopup: { amount: number; isCrit: boolean } | null;
  effectAnim: "heal" | "shield" | "dot" | null;
  side: "left" | "right";
}) {
  const hpPct = Math.max(0, (hp / card.stats.hp) * 100);
  const hpColor = hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="text-center relative">
      <div className={`${isShaking ? "animate-shake" : ""} ${isCritFlash ? "animate-flash" : ""}`}>
        <BuddySprite
          species={card.species}
          size={8}
          animated={!isShaking}
          flipped={side === "right"}
          shiny={card.shiny}
          eye={card.eye}
          hat={card.hat}
          fighterClass={card.class}
          customSprite={card.customSprite}
          bodyType={card.bodyType}
        />
      </div>

      {/* Damage popup */}
      {damagePopup && (
        <div
          className={`absolute top-0 ${side === "left" ? "right-0" : "left-0"} animate-damage font-bold text-sm ${damagePopup.isCrit ? "text-yellow-400" : "text-red-400"}`}
        >
          {damagePopup.isCrit ? "CRIT! " : ""}-{damagePopup.amount}
        </div>
      )}

      {/* Effect animation overlay */}
      {effectAnim && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-${effectAnim} font-bold pointer-events-none z-10`}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "14px",
            color: EFFECT_GLYPHS[effectAnim].color,
            textShadow: `0 0 8px ${EFFECT_GLYPHS[effectAnim].color}`,
          }}
        >
          {EFFECT_GLYPHS[effectAnim].glyph}
        </div>
      )}

      <p className={`text-xs font-bold mt-2 ${side === "left" ? "text-cyan-400" : "text-red-400"}`}>{card.buddyName}</p>
      <p className="text-[8px] text-gray-400">
        Lv.{card.level} {card.class.toUpperCase()}
      </p>

      <div className="w-32 mx-auto mt-1">
        <div className="flex justify-between text-[8px] text-gray-400">
          <span>HP</span>
          <span>
            {hp}/{card.stats.hp}
          </span>
        </div>
        <div className="h-2 bg-black/50 rounded overflow-hidden">
          <div
            className={`h-full ${hpColor} hp-bar-fill`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function HighlightNames({ text, name1, name2 }: { text: string; name1: string; name2: string }) {
  const regex = new RegExp(`(${name1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${name2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "g");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part === name1 ? (
          <span key={i} className="text-cyan-400 font-bold">{part}</span>
        ) : part === name2 ? (
          <span key={i} className="text-red-400 font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
