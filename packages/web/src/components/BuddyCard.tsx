"use client";

import type { FighterCard } from "@buddymon/shared-types";
import { BuddySprite } from "./BuddySprite";
import { StatRadar } from "./StatRadar";

const CLASS_COLORS: Record<string, string> = {
  explorer: "border-cyan-500",
  builder: "border-yellow-500",
  commander: "border-red-500",
  architect: "border-purple-500",
  debugger: "border-green-500",
};

const CLASS_BG: Record<string, string> = {
  explorer: "from-cyan-950/30",
  builder: "from-yellow-950/30",
  commander: "from-red-950/30",
  architect: "from-purple-950/30",
  debugger: "from-green-950/30",
};

const RARITY_COLORS: Record<string, string> = {
  common: "text-gray-500",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

const RARITY_STARS: Record<string, string> = {
  common: "\u2605",
  uncommon: "\u2605\u2605",
  rare: "\u2605\u2605\u2605",
  epic: "\u2605\u2605\u2605\u2605",
  legendary: "\u2605\u2605\u2605\u2605\u2605",
};

interface Props {
  card: FighterCard;
  selected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

export function BuddyCard({ card, selected = false, onClick, showDetails = false }: Props) {
  const borderColor = CLASS_COLORS[card.class] ?? "border-gray-500";
  const bgGrad = CLASS_BG[card.class] ?? "from-gray-950/30";
  const rarityColor = RARITY_COLORS[card.rarity] ?? "text-gray-500";
  const rarityStars = RARITY_STARS[card.rarity] ?? "\u2605";

  return (
    <div
      className={`
        pixel-border rounded-lg p-4 cursor-pointer transition-all
        bg-gradient-to-b ${bgGrad} to-[var(--bg-card)]
        ${borderColor} ${selected ? "ring-2 ring-white scale-105" : "hover:scale-102"}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <BuddySprite species={card.species} size={6} shiny={card.shiny} eye={card.eye} hat={card.hat} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white truncate">{card.buddyName}</h3>
            {card.shiny && <span className="text-[8px] text-yellow-300">&#10023;SHINY</span>}
          </div>
          <p className="text-[10px] text-gray-400">
            Lv.{card.level} {card.species.toUpperCase()} | {card.class.toUpperCase()}
          </p>
          <p className={`text-[8px] ${rarityColor}`}>
            {rarityStars} {card.rarity?.toUpperCase()}
            {card.hat && card.hat !== "none" && (
              <span className="text-gray-500 ml-2">Hat: {card.hat}</span>
            )}
          </p>
          <p className="text-[8px] text-gray-500 italic truncate">{card.title}</p>
          {card.terminalTamer && (
            <p className="text-[8px] text-gray-600">Tamer: {card.terminalTamer}</p>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3">
          <div className="flex justify-center">
            <StatRadar stats={card.stats} fighterClass={card.class} size={160} />
          </div>

          <div className="space-y-1">
            <StatBar label="HP" value={card.stats.hp} max={300} color="bg-green-500" />
            <StatBar label="ATK" value={card.stats.attack} max={100} color="bg-red-500" />
            <StatBar label="DEF" value={card.stats.defense} max={100} color="bg-blue-500" />
            <StatBar label="SPD" value={card.stats.speed} max={100} color="bg-yellow-500" />
          </div>

          <div className="space-y-1">
            <p className="text-[8px] text-gray-400 uppercase">Moves</p>
            {card.moves.map((move, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[8px] bg-black/20 rounded px-2 py-1"
              >
                <span className="text-white">{move.name}</span>
                <span className="text-gray-400">
                  {move.type.toUpperCase()} PWR:{move.power} ACC:{move.accuracy}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[8px] bg-purple-950/30 rounded px-2 py-1">
            <span className="text-purple-400">{card.passive.name}</span>
            <span className="text-gray-500 ml-2">{card.passive.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-[8px]">
      <span className="w-6 text-gray-400">{label}</span>
      <div className="flex-1 h-2 bg-black/30 rounded overflow-hidden">
        <div className={`h-full ${color} hp-bar-fill`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-gray-300">{value}</span>
    </div>
  );
}
