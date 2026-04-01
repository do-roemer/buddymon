export const ARENA_URL = process.env.BUDDYMON_ARENA_URL ?? "http://localhost:3000";

export function isLocalArenaUrl(): boolean {
  return ARENA_URL === "http://localhost:3000";
}
