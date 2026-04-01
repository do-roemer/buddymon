import type { FighterClass } from "./types.js";
import { NAME_PREFIXES, NAME_SUFFIXES, CLASS_TITLES } from "./constants.js";

/** Simple string hash (djb2) for deterministic name generation */
function hashString(s: string): number {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33) ^ s.charCodeAt(i);
  }
  return hash >>> 0;
}

export function generateBuddyName(
  fighterClass: FighterClass,
  ownerHash: string,
): string {
  const hash = hashString(ownerHash);
  const prefixes = NAME_PREFIXES[fighterClass];
  const prefix = prefixes[hash % prefixes.length];
  const suffix = NAME_SUFFIXES[(hash >>> 8) % NAME_SUFFIXES.length];
  return prefix + suffix;
}

export function generateTitle(
  fighterClass: FighterClass,
  ownerHash: string,
  favoriteHour: number,
): string {
  const hash = hashString(ownerHash + String(favoriteHour));

  // Late-night coders get special titles
  if (favoriteHour >= 22 || favoriteHour <= 4) {
    const nightTitles = [
      "The Midnight Coder",
      "The Night Owl",
      "The 3AM Debugger",
      "The Moonlight Hacker",
    ];
    return nightTitles[hash % nightTitles.length];
  }

  // Early birds
  if (favoriteHour >= 5 && favoriteHour <= 7) {
    const morningTitles = [
      "The Dawn Compiler",
      "The Early Committer",
      "The Sunrise Deployer",
    ];
    return morningTitles[hash % morningTitles.length];
  }

  // Standard titles based on class
  const titles = CLASS_TITLES[fighterClass];
  return titles[hash % titles.length];
}
