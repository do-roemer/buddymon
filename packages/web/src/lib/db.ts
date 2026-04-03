import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Redis } from "@upstash/redis";
import type { BattleResult, FighterCard } from "@buddymon/shared-types";

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

interface FileDb {
  buddies: Record<string, StoredBuddy>;
  battles: StoredBattle[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const BUDDY_IDS_KEY = "buddymon:buddies:ids";
const RECENT_BATTLES_KEY = "buddymon:battles:recent";
const RECENT_BATTLES_LIMIT = 100;
const BUDDY_BATTLES_LIMIT = 100;

const STORE_BATTLE_SCRIPT = `
local buddy1Raw = redis.call("GET", KEYS[1])
local buddy2Raw = redis.call("GET", KEYS[2])

if not buddy1Raw or not buddy2Raw then
  return redis.error_reply("One or both buddies not found")
end

local buddy1 = cjson.decode(buddy1Raw)
local buddy2 = cjson.decode(buddy2Raw)
local winnerIndex = tonumber(ARGV[2])

if winnerIndex == 0 then
  buddy1.wins = (buddy1.wins or 0) + 1
  buddy2.losses = (buddy2.losses or 0) + 1
else
  buddy2.wins = (buddy2.wins or 0) + 1
  buddy1.losses = (buddy1.losses or 0) + 1
end

redis.call("SET", KEYS[1], cjson.encode(buddy1))
redis.call("SET", KEYS[2], cjson.encode(buddy2))
redis.call("SET", KEYS[3], ARGV[1])
redis.call("LPUSH", KEYS[4], ARGV[3])
redis.call("LTRIM", KEYS[4], 0, tonumber(ARGV[4]) - 1)
redis.call("LPUSH", KEYS[5], ARGV[3])
redis.call("LTRIM", KEYS[5], 0, tonumber(ARGV[5]) - 1)
redis.call("LPUSH", KEYS[6], ARGV[3])
redis.call("LTRIM", KEYS[6], 0, tonumber(ARGV[5]) - 1)

return 1
`;

let redisInstance: Redis | null = null;

function isVercelDeployment(): boolean {
  return Boolean(process.env.VERCEL_URL);
}

function hasRedisEnv(): boolean {
  const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  const hasKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  return hasUpstash || hasKV;
}

function useRedis(): boolean {
  return isVercelDeployment() && hasRedisEnv();
}

function shouldUseFileFallback(): boolean {
  return !isVercelDeployment();
}

function missingStorageError(): Error {
  return new Error(
    "Arena storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in production.",
  );
}

function redis(): Redis {
  if (redisInstance) return redisInstance;

  // Support both Vercel KV and Upstash variable names
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('Redis environment variables not configured');
  }

  redisInstance = new Redis({ url, token, readYourWrites: true });
  return redisInstance;
}

function buddyKey(id: string): string {
  return `buddymon:buddy:${id}`;
}

function buddyNameKey(name: string): string {
  return `buddymon:buddy_name:${name.toLowerCase()}`;
}

function battleKey(id: string): string {
  return `buddymon:battle:${id}`;
}

function buddyBattlesKey(buddyId: string): string {
  return `buddymon:buddy:${buddyId}:battles`;
}

function sortBuddies(buddies: StoredBuddy[]): StoredBuddy[] {
  return buddies.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}

function compact<T>(values: Array<T | null>): T[] {
  return values.filter((value): value is T => value !== null);
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
}

async function readFileDb(): Promise<FileDb> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as FileDb;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "EROFS") {
      return { buddies: {}, battles: [] };
    }
    throw error;
  }
}

async function writeFileDb(db: FileDb): Promise<void> {
  await ensureDir();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

async function getBuddiesByIds(ids: string[]): Promise<StoredBuddy[]> {
  const buddies = await Promise.all(
    ids.map((id) => redis().get<StoredBuddy>(buddyKey(id))),
  );
  return compact(buddies);
}

async function getBattlesByIds(ids: string[]): Promise<StoredBattle[]> {
  const battles = await Promise.all(
    ids.map((id) => redis().get<StoredBattle>(battleKey(id))),
  );
  return compact(battles);
}

async function getAllBuddiesFromRedis(): Promise<StoredBuddy[]> {
  const ids = (await redis().smembers(BUDDY_IDS_KEY)) as string[] | null;
  return sortBuddies(await getBuddiesByIds(ids ?? []));
}

async function getAllBuddiesFromFile(): Promise<StoredBuddy[]> {
  const db = await readFileDb();
  return sortBuddies(Object.values(db.buddies));
}

async function getBuddyFromRedis(id: string): Promise<StoredBuddy | null> {
  return (await redis().get<StoredBuddy>(buddyKey(id))) ?? null;
}

async function getBuddyFromFile(id: string): Promise<StoredBuddy | null> {
  const db = await readFileDb();
  return db.buddies[id] ?? null;
}

async function getBuddyByNameFromRedis(name: string): Promise<StoredBuddy | null> {
  const id = await redis().get<string>(buddyNameKey(name));
  if (!id) return null;
  return getBuddyFromRedis(id);
}

async function getBuddyByNameFromFile(name: string): Promise<StoredBuddy | null> {
  const db = await readFileDb();
  const lower = name.toLowerCase();
  return (
    Object.values(db.buddies).find(
      (b) => b.card.buddyName.toLowerCase() === lower,
    ) ?? null
  );
}

async function uploadBuddyToRedis(card: FighterCard): Promise<StoredBuddy> {
  const id = card.ownerHash.slice(0, 12);
  const existing = await getBuddyFromRedis(id);
  const buddy: StoredBuddy = {
    id,
    card,
    wins: existing?.wins ?? 0,
    losses: existing?.losses ?? 0,
    uploadedAt: new Date().toISOString(),
  };

  const client = redis();
  const oldName = existing?.card.buddyName;

  await client.set(buddyKey(id), buddy);
  await client.sadd(BUDDY_IDS_KEY, id);
  await client.set(buddyNameKey(card.buddyName), id);

  if (oldName && oldName.toLowerCase() !== card.buddyName.toLowerCase()) {
    await client.del(buddyNameKey(oldName));
  }

  return buddy;
}

async function uploadBuddyToFile(card: FighterCard): Promise<StoredBuddy> {
  const db = await readFileDb();
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
  await writeFileDb(db);
  return buddy;
}

async function storeBattleInRedis(
  result: BattleResult,
  buddy1Id: string,
  buddy2Id: string,
): Promise<StoredBattle> {
  const battle: StoredBattle = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    result,
    buddy1Id,
    buddy2Id,
    createdAt: new Date().toISOString(),
  };

  await redis().eval(
    STORE_BATTLE_SCRIPT,
    [
      buddyKey(buddy1Id),
      buddyKey(buddy2Id),
      battleKey(battle.id),
      RECENT_BATTLES_KEY,
      buddyBattlesKey(buddy1Id),
      buddyBattlesKey(buddy2Id),
    ],
    [
      JSON.stringify(battle),
      String(result.winner),
      battle.id,
      String(RECENT_BATTLES_LIMIT),
      String(BUDDY_BATTLES_LIMIT),
    ],
  );

  return battle;
}

async function storeBattleInFile(
  result: BattleResult,
  buddy1Id: string,
  buddy2Id: string,
): Promise<StoredBattle> {
  const db = await readFileDb();
  const buddy1 = db.buddies[buddy1Id];
  const buddy2 = db.buddies[buddy2Id];

  if (!buddy1 || !buddy2) {
    throw new Error("One or both buddies not found");
  }

  const battle: StoredBattle = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    result,
    buddy1Id,
    buddy2Id,
    createdAt: new Date().toISOString(),
  };

  const winnerId = result.winner === 0 ? buddy1Id : buddy2Id;
  const loserId = result.winner === 0 ? buddy2Id : buddy1Id;

  db.buddies[winnerId].wins++;
  db.buddies[loserId].losses++;
  db.battles.push(battle);

  await writeFileDb(db);
  return battle;
}

async function getBattleFromRedis(id: string): Promise<StoredBattle | null> {
  return (await redis().get<StoredBattle>(battleKey(id))) ?? null;
}

async function getBattleFromFile(id: string): Promise<StoredBattle | null> {
  const db = await readFileDb();
  return db.battles.find((battle) => battle.id === id) ?? null;
}

async function getRecentBattlesFromRedis(limit: number): Promise<StoredBattle[]> {
  const ids = await redis().lrange<string>(RECENT_BATTLES_KEY, 0, limit - 1);
  return getBattlesByIds(ids ?? []);
}

async function getRecentBattlesFromFile(limit: number): Promise<StoredBattle[]> {
  const db = await readFileDb();
  return db.battles.slice(-limit).reverse();
}

async function getBuddyBattlesFromRedis(buddyId: string): Promise<StoredBattle[]> {
  const ids = await redis().lrange<string>(
    buddyBattlesKey(buddyId),
    0,
    BUDDY_BATTLES_LIMIT - 1,
  );
  return getBattlesByIds(ids ?? []);
}

async function getBuddyBattlesFromFile(buddyId: string): Promise<StoredBattle[]> {
  const db = await readFileDb();
  return db.battles
    .filter((battle) => battle.buddy1Id === buddyId || battle.buddy2Id === buddyId)
    .reverse();
}

export async function getAllBuddies(): Promise<StoredBuddy[]> {
  if (useRedis()) return getAllBuddiesFromRedis();
  if (shouldUseFileFallback()) return getAllBuddiesFromFile();
  return [];
}

export async function getBuddy(id: string): Promise<StoredBuddy | null> {
  if (useRedis()) return getBuddyFromRedis(id);
  if (shouldUseFileFallback()) return getBuddyFromFile(id);
  return null;
}

export async function getBuddyByName(name: string): Promise<StoredBuddy | null> {
  if (useRedis()) return getBuddyByNameFromRedis(name);
  if (shouldUseFileFallback()) return getBuddyByNameFromFile(name);
  return null;
}

export async function uploadBuddy(card: FighterCard): Promise<StoredBuddy> {
  if (useRedis()) return uploadBuddyToRedis(card);
  if (shouldUseFileFallback()) return uploadBuddyToFile(card);
  throw missingStorageError();
}

export async function storeBattle(
  result: BattleResult,
  buddy1Id: string,
  buddy2Id: string,
): Promise<StoredBattle> {
  if (useRedis()) return storeBattleInRedis(result, buddy1Id, buddy2Id);
  if (shouldUseFileFallback()) return storeBattleInFile(result, buddy1Id, buddy2Id);
  throw missingStorageError();
}

export async function getBattle(id: string): Promise<StoredBattle | null> {
  if (useRedis()) return getBattleFromRedis(id);
  if (shouldUseFileFallback()) return getBattleFromFile(id);
  return null;
}

export async function getRecentBattles(limit: number = 10): Promise<StoredBattle[]> {
  if (useRedis()) return getRecentBattlesFromRedis(limit);
  if (shouldUseFileFallback()) return getRecentBattlesFromFile(limit);
  return [];
}

export async function getBuddyBattles(buddyId: string): Promise<StoredBattle[]> {
  if (useRedis()) return getBuddyBattlesFromRedis(buddyId);
  if (shouldUseFileFallback()) return getBuddyBattlesFromFile(buddyId);
  return [];
}
