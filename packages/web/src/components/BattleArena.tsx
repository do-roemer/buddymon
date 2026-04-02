"use client";

import { useState, useEffect, useCallback } from "react";
import type { BattleResult, BattleAction, FighterCard } from "@buddymon/shared-types";
import { BuddySprite } from "./BuddySprite";

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

  // Flatten all actions for sequential playback
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

      if (action.type === "attack") {
        setShaking(action.targetIdx);
        setDamagePopup({
          idx: action.targetIdx,
          amount: action.damage ?? 0,
          isCrit: action.isCrit ?? false,
        });
        setTimeout(() => setShaking(null), 300);
        setTimeout(() => setDamagePopup(null), 1000);
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

    const delay = allActions[next]?.type === "attack" ? 2500 : 1500;
    const timer = setTimeout(() => playAction(next), delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentActionIdx, allActions, playAction]);

  const start = () => {
    setCurrentActionIdx(-1);
    setHp([result.fighters[0].stats.hp, result.fighters[1].stats.hp]);
    setIsPlaying(true);
    setTimeout(() => playAction(0), 500);
  };

  const skipToEnd = () => {
    setIsPlaying(false);
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
    <div className="bg-[var(--bg-card)] pixel-border border-gray-600 rounded-lg p-6 relative scanlines">
      {/* Fighter display */}
      <div className="flex items-center justify-between mb-8">
        {/* Fighter 1 */}
        <FighterDisplay
          card={f1}
          hp={hp[0]}
          isShaking={shaking === 0}
          damagePopup={damagePopup?.idx === 0 ? damagePopup : null}
          side="left"
        />

        <div className="text-2xl font-bold text-gray-500">VS</div>

        {/* Fighter 2 */}
        <FighterDisplay
          card={f2}
          hp={hp[1]}
          isShaking={shaking === 1}
          damagePopup={damagePopup?.idx === 1 ? damagePopup : null}
          side="right"
        />
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

function FighterDisplay({
  card,
  hp,
  isShaking,
  damagePopup,
  side,
}: {
  card: FighterCard;
  hp: number;
  isShaking: boolean;
  damagePopup: { amount: number; isCrit: boolean } | null;
  side: "left" | "right";
}) {
  const hpPct = Math.max(0, (hp / card.stats.hp) * 100);
  const hpColor = hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="text-center relative">
      <div className={isShaking ? "animate-shake" : ""}>
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
        />
      </div>

      {damagePopup && (
        <div
          className={`absolute top-0 ${side === "left" ? "right-0" : "left-0"} animate-damage font-bold text-sm ${damagePopup.isCrit ? "text-yellow-400" : "text-red-400"}`}
        >
          {damagePopup.isCrit ? "CRIT! " : ""}-{damagePopup.amount}
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
