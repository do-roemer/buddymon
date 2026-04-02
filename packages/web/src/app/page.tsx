import { getAllBuddies, getRecentBattles } from "@/lib/db";
import { Leaderboard } from "@/components/Leaderboard";
import { BuddySprite } from "@/components/BuddySprite";
import type { BuddySpecies } from "@buddymon/shared-types";

export const dynamic = "force-dynamic";

const HERO_SPECIES: BuddySpecies[] = ["capybara", "duck", "cat", "dragon", "robot", "ghost", "axolotl"];

export default async function Home() {
  const [buddies, recentBattles] = await Promise.all([
    getAllBuddies(),
    getRecentBattles(5),
  ]);

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
