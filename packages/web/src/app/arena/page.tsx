"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FighterCard } from "@buddymon/shared-types";
import { BuddyCard } from "@/components/BuddyCard";

interface StoredBuddy {
  id: string;
  card: FighterCard;
  wins: number;
  losses: number;
}

export default function ArenaPage() {
  const [buddies, setBuddies] = useState<StoredBuddy[]>([]);
  const [selected, setSelected] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [battling, setBattling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setBuddies(data.buddies));
  }, []);

  const handleSelect = (id: string) => {
    setSelected(([a, b]) => {
      if (a === id) return [null, b];
      if (b === id) return [a, null];
      if (!a) return [id, b];
      if (!b) return [a, id];
      return [id, b];
    });
  };

  const handleBattle = async () => {
    if (!selected[0] || !selected[1]) return;
    setBattling(true);

    const res = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buddy1Id: selected[0],
        buddy2Id: selected[1],
      }),
    });

    const { battle } = await res.json();
    router.push(`/arena/${battle.id}`);
  };

  return (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">ARENA</h1>
        <p className="text-xs text-gray-400 mt-1">
          Select two fighters to battle
        </p>
      </div>

      {/* Selection indicator */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <span className={selected[0] ? "text-cyan-400" : "text-gray-600"}>
          {selected[0]
            ? buddies.find((b) => b.id === selected[0])?.card.buddyName
            : "Select fighter 1"}
        </span>
        <span className="text-gray-500">VS</span>
        <span className={selected[1] ? "text-red-400" : "text-gray-600"}>
          {selected[1]
            ? buddies.find((b) => b.id === selected[1])?.card.buddyName
            : "Select fighter 2"}
        </span>
      </div>

      {/* Battle button */}
      {selected[0] && selected[1] && (
        <div className="text-center">
          <button
            onClick={handleBattle}
            disabled={battling}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white text-sm font-bold rounded pixel-border border-red-400 disabled:border-gray-600 transition-all"
          >
            {battling ? "BATTLING..." : "FIGHT!"}
          </button>
        </div>
      )}

      {/* Buddy grid */}
      {buddies.length === 0 ? (
        <div className="text-center text-gray-500 text-xs py-12">
          No buddies uploaded yet. Upload yours to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buddies.map((buddy) => (
            <BuddyCard
              key={buddy.id}
              card={buddy.card}
              selected={selected.includes(buddy.id)}
              onClick={() => handleSelect(buddy.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
