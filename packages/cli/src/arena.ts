export let ARENA_URL = process.env.BUDDYMON_ARENA_URL ?? "https://buddymon.vercel.app";

export function setLocal(): void {
  ARENA_URL = "http://localhost:3000";
}

export function isLocalArenaUrl(): boolean {
  return ARENA_URL === "http://localhost:3000";
}
