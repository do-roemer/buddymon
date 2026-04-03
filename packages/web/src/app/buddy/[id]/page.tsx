import { getBuddy, getBuddyBattles } from "@/lib/db";
import { BuddyCard } from "@/components/BuddyCard";
import { StatRadar } from "@/components/StatRadar";
import { BuddySprite } from "@/components/BuddySprite";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuddyPage({ params }: Props) {
  const { id } = await params;
  const buddy = await getBuddy(id);

  if (!buddy) return notFound();

  const battles = await getBuddyBattles(id);
  const { card } = buddy;

  return (
    <div className="space-y-6 py-8 max-w-2xl mx-auto">
      {/* Profile header */}
      <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-6 text-center">
        <BuddySprite species={card.species ?? "blob"} size={10} shiny={card.shiny} eye={card.eye} hat={card.hat} fighterClass={card.class} customSprite={card.customSprite} bodyType={card.bodyType} level={card.level} />
        <h1 className="text-xl font-bold text-white mt-4">
          {card.buddyName}
          {card.shiny && <span className="text-yellow-300 ml-2 text-sm">&#10023;SHINY</span>}
        </h1>
        <p className="text-xs text-gray-400">
          Lv.{card.level} {(card.species ?? "unknown").toUpperCase()} | {card.class.toUpperCase()} | {card.dominantLanguage}
        </p>
        <RarityBadge rarity={card.rarity} />
        <p className="text-[10px] text-gray-500 italic mt-1">{card.title}</p>
        {card.terminalTamer && (
          <p className="text-[10px] text-gray-400 mt-1">Terminal Tamer: <span className="text-white font-bold">{card.terminalTamer}</span></p>
        )}
        {card.personality && (
          <p className="text-[8px] text-gray-600 italic mt-2 max-w-md mx-auto">
            &ldquo;{card.personality}&rdquo;
          </p>
        )}

        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div>
            <span className="text-green-400 font-bold">{buddy.wins}</span>
            <span className="text-gray-500 ml-1">wins</span>
          </div>
          <div>
            <span className="text-red-400 font-bold">{buddy.losses}</span>
            <span className="text-gray-500 ml-1">losses</span>
          </div>
          <div>
            <span className="text-white font-bold">
              {buddy.wins + buddy.losses > 0
                ? Math.round(
                    (buddy.wins / (buddy.wins + buddy.losses)) * 100,
                  )
                : 0}
              %
            </span>
            <span className="text-gray-500 ml-1">win rate</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
          <h2 className="text-xs font-bold text-gray-400 mb-3">STATS</h2>
          <div className="flex justify-center">
            <StatRadar
              stats={card.stats}
              fighterClass={card.class}
              size={200}
            />
          </div>
          <div className="space-y-1 mt-3">
            <StatLine label="HP" value={card.stats.hp} max={300} />
            <StatLine label="ATK" value={card.stats.attack} max={100} />
            <StatLine label="DEF" value={card.stats.defense} max={100} />
            <StatLine label="SPD" value={card.stats.speed} max={100} />
            <StatLine label="CRIT" value={card.stats.critChance} max={30} suffix="%" />
            <div className="text-[8px] text-gray-400 mt-2">
              Rage Mode:{" "}
              {card.stats.rageMode ? (
                <span className="text-red-400 font-bold">ACTIVE</span>
              ) : (
                <span className="text-gray-600">inactive</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Moves */}
          <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
            <h2 className="text-xs font-bold text-gray-400 mb-3">MOVES</h2>
            <div className="space-y-2">
              {card.moves.map((move, i) => (
                <div
                  key={i}
                  className="bg-black/20 rounded p-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white font-bold">
                      {move.name}
                    </span>
                    <span className="text-[8px] text-gray-400">
                      {move.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-3 text-[8px] text-gray-400 mt-1">
                    <span>PWR: {move.power}</span>
                    <span>ACC: {move.accuracy}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 italic mt-1">
                    {move.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Passive */}
          <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
            <h2 className="text-xs font-bold text-gray-400 mb-2">PASSIVE</h2>
            <p className="text-[10px] text-purple-400 font-bold">
              {card.passive.name}
            </p>
            <p className="text-[8px] text-gray-400">
              {card.passive.description}
            </p>
          </div>
        </div>
      </div>

      {/* Battle history */}
      {battles.length > 0 && (
        <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
          <h2 className="text-xs font-bold text-gray-400 mb-3">
            BATTLE HISTORY
          </h2>
          <div className="space-y-2">
            {battles.slice(0, 20).map((battle) => {
              const isWinner =
                (battle.buddy1Id === id && battle.result.winner === 0) ||
                (battle.buddy2Id === id && battle.result.winner === 1);
              const opponent =
                battle.buddy1Id === id
                  ? battle.result.fighters[1]
                  : battle.result.fighters[0];

              return (
                <a
                  key={battle.id}
                  href={`/arena/${battle.id}`}
                  className="flex items-center justify-between bg-black/20 rounded p-2 hover:bg-black/30 transition-all"
                >
                  <span
                    className={`text-[10px] font-bold ${isWinner ? "text-green-400" : "text-red-400"}`}
                  >
                    {isWinner ? "WIN" : "LOSS"}
                  </span>
                  <span className="text-[10px] text-gray-300">
                    vs {opponent.buddyName}
                  </span>
                  <span className="text-[8px] text-gray-500">
                    {battle.result.turns} turns
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Meta info */}
      <div className="text-center text-[8px] text-gray-600">
        Sessions: {card.totalSessions} | Peak hour: {card.favoriteHour}:00 |
        Uploaded: {new Date(buddy.uploadedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

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

function RarityBadge({ rarity }: { rarity?: string }) {
  if (!rarity) return null;
  const color = RARITY_COLORS[rarity] ?? "text-gray-500";
  const stars = RARITY_STARS[rarity] ?? "\u2605";
  return (
    <p className={`text-[10px] mt-1 ${color}`}>
      {stars} {rarity.toUpperCase()}
    </p>
  );
}

function StatLine({
  label,
  value,
  max,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[8px]">
      <span className="w-8 text-gray-400">{label}</span>
      <span className="text-white font-bold w-8 text-right">
        {value}
        {suffix}
      </span>
      <div className="flex-1 h-1.5 bg-black/30 rounded overflow-hidden">
        <div
          className="h-full bg-white/30"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
