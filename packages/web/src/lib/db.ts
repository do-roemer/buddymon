import * as fs from "node:fs";
import * as path from "node:path";
import type { FighterCard, BattleResult } from "@buddymon/shared";

export interface StoredBuddy {
  id: string;
  card: FighterCard;
  wins: number;
  losses: number;
  uploadedAt: string;
}

export interface StoredBattle {
  id: string;
  result: BattleResult;
  buddy1Id: string;
  buddy2Id: string;
  createdAt: string;
}

interface DB {
  buddies: Record<string, StoredBuddy>;
  battles: StoredBattle[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function ensureDir(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readDb(): DB {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    return { buddies: {}, battles: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDb(db: DB): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getAllBuddies(): StoredBuddy[] {
  const db = readDb();
  return Object.values(db.buddies).sort(
    (a, b) => b.wins - a.wins || a.losses - b.losses,
  );
}

export function getBuddy(id: string): StoredBuddy | null {
  const db = readDb();
  return db.buddies[id] ?? null;
}

export function getBuddyByName(name: string): StoredBuddy | null {
  const db = readDb();
  const lower = name.toLowerCase();
  return (
    Object.values(db.buddies).find(
      (b) => b.card.buddyName.toLowerCase() === lower,
    ) ?? null
  );
}

export function uploadBuddy(card: FighterCard): StoredBuddy {
  const db = readDb();

  // Use ownerHash as ID (one buddy per person)
  const id = card.ownerHash.slice(0, 12);

  const existing = db.buddies[id];
  const buddy: StoredBuddy = {
    id,
    card,
    wins: existing?.wins ?? 0,
    losses: existing?.losses ?? 0,
    uploadedAt: new Date().toISOString(),
  };

  db.buddies[id] = buddy;
  writeDb(db);
  return buddy;
}

export function storeBattle(
  result: BattleResult,
  buddy1Id: string,
  buddy2Id: string,
): StoredBattle {
  const db = readDb();

  const battle: StoredBattle = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    result,
    buddy1Id,
    buddy2Id,
    createdAt: new Date().toISOString(),
  };

  // Update win/loss records
  const winnerId = result.winner === 0 ? buddy1Id : buddy2Id;
  const loserId = result.winner === 0 ? buddy2Id : buddy1Id;

  if (db.buddies[winnerId]) db.buddies[winnerId].wins++;
  if (db.buddies[loserId]) db.buddies[loserId].losses++;

  db.battles.push(battle);
  writeDb(db);
  return battle;
}

export function getBattle(id: string): StoredBattle | null {
  const db = readDb();
  return db.battles.find((b) => b.id === id) ?? null;
}

export function getRecentBattles(limit: number = 10): StoredBattle[] {
  const db = readDb();
  return db.battles.slice(-limit).reverse();
}

export function getBuddyBattles(buddyId: string): StoredBattle[] {
  const db = readDb();
  return db.battles
    .filter((b) => b.buddy1Id === buddyId || b.buddy2Id === buddyId)
    .reverse();
}
