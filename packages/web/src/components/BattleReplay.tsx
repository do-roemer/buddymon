"use client";

import { useState } from "react";
import type { BattleResult } from "@buddymon/shared-types";
import { BattleArena } from "./BattleArena";

interface Props {
  result: BattleResult;
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

export function BattleReplay({ result }: Props) {
  const [showLog, setShowLog] = useState(false);

  const name1 = result.fighters[0].buddyName;
  const name2 = result.fighters[1].buddyName;

  type BattleTurn = (typeof result.log)[number];
  type BattleLogAction = BattleTurn["actions"][number];

  return (
    <>
      <BattleArena result={result} onComplete={() => setShowLog(true)} />

      {showLog && (
        <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
          <h2 className="text-xs font-bold text-gray-400 mb-3">BATTLE LOG</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.log.map((turn: BattleTurn) => (
              <div key={turn.turnNumber}>
                <p className="text-[8px] text-gray-500">
                  Turn {turn.turnNumber}
                </p>
                {turn.actions.map((action: BattleLogAction, i: number) => (
                  <p
                    key={i}
                    className={`text-[10px] ${
                      action.type === "ko"
                        ? "text-red-400 font-bold"
                        : action.type === "attack"
                          ? "text-gray-200"
                          : "text-gray-400"
                    }`}
                  >
                    <HighlightNames text={action.narration} name1={name1} name2={name2} />
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
