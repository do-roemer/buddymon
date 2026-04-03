import { getAllBuddies } from "@/lib/db";
import { BuddySprite } from "@/components/BuddySprite";
import { JoinButton } from "@/components/JoinModal";
import type { BuddySpecies } from "@buddymon/shared-types";
import type { StoredBuddy } from "@/lib/db";

export const dynamic = "force-dynamic";

const HERO_SPECIES: BuddySpecies[] = ["capybara", "duck", "cat", "dragon", "robot", "ghost", "axolotl"];

const CLASS_COLORS: Record<string, string> = {
  explorer: "border-cyan-500 from-cyan-950/30",
  builder: "border-yellow-500 from-yellow-950/30",
  commander: "border-red-500 from-red-950/30",
  architect: "border-purple-500 from-purple-950/30",
  debugger: "border-green-500 from-green-950/30",
};

const CLASS_TEXT: Record<string, string> = {
  explorer: "text-cyan-400",
  builder: "text-yellow-400",
  commander: "text-red-400",
  architect: "text-purple-400",
  debugger: "text-green-400",
};

export default async function Home() {
  const buddies = await getAllBuddies();

  return (
    <div className="space-y-8 py-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-4 flex-wrap">
          {HERO_SPECIES.map((species) => (
            <BuddySprite key={species} species={species} size={6} />
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white">BUDDYMON ARENA</h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Your Claude Code token burn becomes XP. Feed your buddy, level up, battle
          globally.
        </p>
        <JoinButton />
      </div>

      {/* Fighter grid */}
      {buddies.length === 0 ? (
        <div className="text-center text-gray-500 text-xs py-12">
          No fighters uploaded yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {buddies.map((buddy) => (
              <FighterCard key={buddy.id} buddy={buddy} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FighterCard({ buddy }: { buddy: StoredBuddy }) {
  const { card } = buddy;
  const classStyle = CLASS_COLORS[card.class] ?? "border-gray-500 from-gray-950/30";
  const classText = CLASS_TEXT[card.class] ?? "text-gray-400";
  const winRate =
    buddy.wins + buddy.losses > 0
      ? Math.round((buddy.wins / (buddy.wins + buddy.losses)) * 100)
      : 0;

  return (
    <a
      href={`/buddy/${buddy.id}`}
      className={`block pixel-border rounded-lg p-4 bg-gradient-to-b ${classStyle} to-[var(--bg-card)] hover:scale-102 transition-all`}
    >
      <div className="flex justify-center">
        <BuddySprite
          species={card.species}
          size={6}
          shiny={card.shiny}
          eye={card.eye}
          hat={card.hat}
          fighterClass={card.class}
          customSprite={card.customSprite}
          bodyType={card.bodyType}
          level={card.level}
        />
      </div>

      <div className="text-center mt-2 space-y-1">
        <h3 className="text-[10px] font-bold text-white truncate">
          {card.buddyName}
          {card.shiny && <span className="text-yellow-300 ml-1">&#10023;</span>}
        </h3>

        <p className="text-[8px] text-gray-400">
          Lv.{card.level} {card.species.toUpperCase()}
        </p>

        <p className={`text-[8px] font-bold ${classText}`}>
          {card.class.toUpperCase()}
        </p>

        {card.terminalTamer && (
          <p className="text-[7px] text-gray-500">
            {card.terminalTamer}
          </p>
        )}

        <div className="flex justify-center gap-2 text-[8px]">
          <span className="text-green-400">{buddy.wins}W</span>
          <span className="text-red-400">{buddy.losses}L</span>
          <span className="text-gray-500">{winRate}%</span>
        </div>
      </div>
    </a>
  );
}
