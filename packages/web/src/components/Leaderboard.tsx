"use client";

import type { FighterCard } from "@buddymon/shared-types";
import { BuddySprite } from "./BuddySprite";

const RARITY_COLORS: Record<string, string> = {
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

const RARITY_STARS: Record<string, string> = {
  uncommon: "\u2605\u2605",
  rare: "\u2605\u2605\u2605",
  epic: "\u2605\u2605\u2605\u2605",
  legendary: "\u2605\u2605\u2605\u2605\u2605",
};

interface LeaderboardEntry {
  id: string;
  card: FighterCard;
  wins: number;
  losses: number;
}

interface Props {
  entries: LeaderboardEntry[];
  limit?: number;
}

export function Leaderboard({ entries, limit }: Props) {
  const sorted = [...entries]
    .sort((a, b) => {
      const rateA = a.wins + a.losses > 0 ? a.wins / (a.wins + a.losses) : 0;
      const rateB = b.wins + b.losses > 0 ? b.wins / (b.wins + b.losses) : 0;
      return rateB - rateA || b.wins - a.wins;
    })
    .slice(0, limit);

  if (sorted.length === 0) {
    return (
      <div className="text-center text-gray-500 text-xs py-8">
        No buddies uploaded yet. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((entry, i) => {
        const total = entry.wins + entry.losses;
        const winRate = total > 0 ? Math.round((entry.wins / total) * 100) : 0;
        const rankColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];

        return (
          <a
            key={entry.id}
            href={`/buddy/${entry.id}`}
            className="flex items-center gap-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] pixel-border border-[var(--border-subtle)] rounded p-3 transition-all"
          >
            <span
              className={`text-sm font-bold w-8 text-center ${rankColors[i] ?? "text-gray-500"}`}
            >
              #{i + 1}
            </span>
            <BuddySprite species={entry.card.species} size={4} animated={false} shiny={entry.card.shiny} eye={entry.card.eye} hat={entry.card.hat} fighterClass={entry.card.class} customSprite={entry.card.customSprite} bodyType={entry.card.bodyType} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-white truncate">
                  {entry.card.buddyName}
                </p>
                {entry.card.rarity && entry.card.rarity !== "common" && (
                  <span className={`text-[8px] ${RARITY_COLORS[entry.card.rarity] ?? ""}`}>
                    {RARITY_STARS[entry.card.rarity] ?? ""}
                  </span>
                )}
                {entry.card.shiny && <span className="text-[8px] text-yellow-300">&#10023;</span>}
              </div>
              <p className="text-[8px] text-gray-400">
                Lv.{entry.card.level} {entry.card.class.toUpperCase()} |{" "}
                {entry.card.dominantLanguage}
                {entry.card.terminalTamer ? ` | Tamer: ${entry.card.terminalTamer}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white">
                {entry.wins}W / {entry.losses}L
              </p>
              <p className="text-[8px] text-gray-400">{winRate}% win rate</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
