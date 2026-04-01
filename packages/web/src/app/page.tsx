import { getAllBuddies, getRecentBattles } from "@/lib/db";
import { UploadCard } from "@/components/UploadCard";
import { Leaderboard } from "@/components/Leaderboard";
import { BuddySprite } from "@/components/BuddySprite";
import type { BuddySpecies } from "@buddymon/shared";

export const dynamic = "force-dynamic";

const HERO_SPECIES: BuddySpecies[] = ["capybara", "duck", "cat", "dragon", "robot", "ghost", "axolotl"];

export default function Home() {
  const buddies = getAllBuddies();
  const recentBattles = getRecentBattles(5);

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
          Your Claude Code usage stats become your fighter. Train locally, battle
          globally.
        </p>
      </div>

      {/* Upload */}
      <div className="max-w-md mx-auto">
        <UploadCard />
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <StepCard
          step="1"
          title="Generate"
          description="Run 'buddymon buddy' to see your fighter generated from ~/.claude/ stats"
        />
        <StepCard
          step="2"
          title="Export"
          description="Run 'buddymon export' to save your fighter card as JSON"
        />
        <StepCard
          step="3"
          title="Battle"
          description="Upload your card here and battle teammates in the arena"
        />
      </div>

      {/* Leaderboard preview */}
      {buddies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Top Fighters</h2>
            <a
              href="/leaderboard"
              className="text-[10px] text-cyan-400 hover:text-cyan-300"
            >
              View all
            </a>
          </div>
          <Leaderboard entries={buddies} limit={5} />
        </div>
      )}

      {/* Recent battles */}
      {recentBattles.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-white mb-3">Recent Battles</h2>
          <div className="space-y-2">
            {recentBattles.map((battle) => (
              <a
                key={battle.id}
                href={`/arena/${battle.id}`}
                className="block bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] pixel-border border-[var(--border-subtle)] rounded p-3 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={
                      battle.result.winner === 0
                        ? "text-green-400 font-bold"
                        : "text-gray-400"
                    }
                  >
                    {battle.result.fighters[0].buddyName}
                  </span>
                  <span className="text-gray-500 text-[8px]">
                    {battle.result.turns} turns
                  </span>
                  <span
                    className={
                      battle.result.winner === 1
                        ? "text-green-400 font-bold"
                        : "text-gray-400"
                    }
                  >
                    {battle.result.fighters[1].buddyName}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
      <span className="text-cyan-400 text-xs font-bold">STEP {step}</span>
      <h3 className="text-sm font-bold text-white mt-1">{title}</h3>
      <p className="text-[8px] text-gray-400 mt-1">{description}</p>
    </div>
  );
}
