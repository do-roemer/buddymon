import { getAllBuddies } from "@/lib/db";
import { Leaderboard } from "@/components/Leaderboard";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const buddies = await getAllBuddies();

  return (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">LEADERBOARD</h1>
        <p className="text-xs text-gray-400 mt-1">
          {buddies.length} fighters registered
        </p>
      </div>
      <Leaderboard entries={buddies} />
    </div>
  );
}
