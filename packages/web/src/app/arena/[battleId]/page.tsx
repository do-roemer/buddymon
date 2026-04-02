import { getBattle } from "@/lib/db";
import { BattleReplay } from "@/components/BattleReplay";
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
      <BattleReplay result={battle.result} />
    </div>
  );
}
