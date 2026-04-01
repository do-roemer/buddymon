import { getBattle } from "@/lib/db";
import { BattleArena } from "@/components/BattleArena";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ battleId: string }>;
}

export default async function BattlePage({ params }: Props) {
  const { battleId } = await params;
  const battle = await getBattle(battleId);

  if (!battle) return notFound();

  return (
    <div className="space-y-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-white text-center">BATTLE REPLAY</h1>
      <BattleArena result={battle.result} />

      {/* Full text log */}
      <div className="bg-[var(--bg-card)] pixel-border border-[var(--border-subtle)] rounded-lg p-4">
        <h2 className="text-xs font-bold text-gray-400 mb-3">BATTLE LOG</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {battle.result.log.map((turn) => (
            <div key={turn.turnNumber}>
              <p className="text-[8px] text-gray-500">
                Turn {turn.turnNumber}
              </p>
              {turn.actions.map((action, i) => (
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
                  {action.narration}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
