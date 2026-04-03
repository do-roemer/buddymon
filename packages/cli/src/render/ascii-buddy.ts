import chalk, { type ChalkInstance } from "chalk";
import type { FighterClass, BuddySpecies, BuddyRarity, BuddyHat, BodyType } from "@buddymon/shared";

// Original Claude Code companion sprites (5 lines tall, ~12 wide)
// Ported from claude-code sprites.ts — {E} is replaced with the eye character
// Frame 0 (idle) used for fighter card display
const SPRITES: Record<BuddySpecies, string[]> = {
  duck: [
    '            ',
    '    __      ',
    '  <({E} )___  ',
    '   (  ._>   ',
    '    `--\u00b4    ',
  ],
  goose: [
    '            ',
    '     ({E}>    ',
    '     ||     ',
    '   _(__)_   ',
    '    ^^^^    ',
  ],
  blob: [
    '            ',
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (      )  ',
    '   `----\u00b4   ',
  ],
  cat: [
    '            ',
    '   /\\_/\\    ',
    '  ( {E}   {E})  ',
    '  (  \u03c9  )   ',
    '  (")_(")   ',
  ],
  dragon: [
    '            ',
    '  /^\\  /^\\  ',
    ' <  {E}  {E}  > ',
    ' (   ~~   ) ',
    '  `-vvvv-\u00b4  ',
  ],
  octopus: [
    '            ',
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (______)  ',
    '  /\\/\\/\\/\\  ',
  ],
  owl: [
    '            ',
    '   /\\  /\\   ',
    '  (({E})({E}))  ',
    '  (  ><  )  ',
    '   `----\u00b4   ',
  ],
  penguin: [
    '            ',
    '  .---.     ',
    '  ({E}>{E})     ',
    ' /(   )\\    ',
    '  `---\u00b4     ',
  ],
  turtle: [
    '            ',
    '   _,--._   ',
    '  ( {E}  {E} )  ',
    ' /[______]\\ ',
    '  ``    ``  ',
  ],
  snail: [
    '            ',
    ' {E}    .--.  ',
    '  \\  ( @ )  ',
    '   \\_`--\u00b4   ',
    '  ~~~~~~~   ',
  ],
  ghost: [
    '            ',
    '   .----.   ',
    '  / {E}  {E} \\  ',
    '  |      |  ',
    '  ~`~``~`~  ',
  ],
  axolotl: [
    '            ',
    '}~(______)~{',
    '}~({E} .. {E})~{',
    '  ( .--. )  ',
    '  (_/  \\_)  ',
  ],
  capybara: [
    '            ',
    '  n______n  ',
    ' ( {E}    {E} ) ',
    ' (   oo   ) ',
    '  `------\u00b4  ',
  ],
  cactus: [
    '            ',
    ' n  ____  n ',
    ' | |{E}  {E}| | ',
    ' |_|    |_| ',
    '   |    |   ',
  ],
  robot: [
    '            ',
    '   .[||].   ',
    '  [ {E}  {E} ]  ',
    '  [ ==== ]  ',
    '  `------\u00b4  ',
  ],
  rabbit: [
    '            ',
    '   (\\__/)   ',
    '  ( {E}  {E} )  ',
    ' =(  ..  )= ',
    '  (")__(")  ',
  ],
  mushroom: [
    '            ',
    ' .-o-OO-o-. ',
    '(__________)',
    '   |{E}  {E}|   ',
    '   |____|   ',
  ],
  chonk: [
    '            ',
    '  /\\    /\\  ',
    ' ( {E}    {E} ) ',
    ' (   ..   ) ',
    '  `------\u00b4  ',
  ],
};

const HAT_LINES: Record<BuddyHat, string> = {
  none:      '',
  crown:     '   \\^^^/    ',
  tophat:    '   [___]    ',
  propeller: '    -+-     ',
  halo:      '   (   )    ',
  wizard:    '    /^\\     ',
  beanie:    '   (___)    ',
  tinyduck:  '    ,>      ',
};

// Default tiny bodies for unevolved buddymons (level < 25 or no custom sprite)
const DEFAULT_BODY_BIPED: string[] = [
  '    |  |    ',
  '   _/  \\_   ',
];

const DEFAULT_BODY_QUADRUPED: string[] = [
  '      ',
  '      ',
  '      ',
  '~\\__  ',
  ' || ||',
];

// Class-specific headgear (replaces rarity hats when class is known)
const CLASS_HATS: Record<FighterClass, string> = {
  explorer:  '    ~?>     ',   // spyglass / periscope
  builder:   '   [===]    ',   // hard hat
  commander: '   \\===/    ',   // military command cap
  architect: '    /##\\    ',   // blueprint thinking cap
  debugger:  '   d{!!}b   ',   // bug antenna headband
};

const SPECIES_COLORS: Record<BuddySpecies, ChalkInstance> = {
  capybara: chalk.hex("#C4A882"),
  duck: chalk.yellow,
  goose: chalk.white,
  cat: chalk.hex("#FF9F43"),
  rabbit: chalk.hex("#FFC0CB"),
  owl: chalk.hex("#8B6914"),
  penguin: chalk.hex("#87CEEB"),
  turtle: chalk.green,
  snail: chalk.hex("#DEB887"),
  dragon: chalk.red,
  octopus: chalk.hex("#FF6B9D"),
  axolotl: chalk.hex("#FF69B4"),
  ghost: chalk.hex("#B8B8FF"),
  robot: chalk.hex("#C0C0C0"),
  blob: chalk.hex("#7CFC00"),
  cactus: chalk.hex("#2E8B57"),
  mushroom: chalk.hex("#CD853F"),
  chonk: chalk.hex("#FFA07A"),
};

const CLASS_COLORS: Record<FighterClass, ChalkInstance> = {
  explorer: chalk.cyan,
  builder: chalk.yellow,
  commander: chalk.red,
  architect: chalk.magenta,
  debugger: chalk.green,
};

const RARITY_COLORS: Record<BuddyRarity, ChalkInstance> = {
  common: chalk.gray,
  uncommon: chalk.green,
  rare: chalk.blue,
  epic: chalk.magenta,
  legendary: chalk.yellow,
};

const RARITY_STARS: Record<BuddyRarity, string> = {
  common: "\u2605",
  uncommon: "\u2605\u2605",
  rare: "\u2605\u2605\u2605",
  epic: "\u2605\u2605\u2605\u2605",
  legendary: "\u2605\u2605\u2605\u2605\u2605",
};

export function renderBuddy(
  species: BuddySpecies,
  eye: string = "\u00b7",
  hat: BuddyHat = "none",
  fighterClass?: FighterClass,
  customSprite?: string[],
  bodyType?: BodyType,
  level: number = 0,
): string {
  const color = SPECIES_COLORS[species] ?? chalk.white;

  const sprite = SPRITES[species] ?? SPRITES.blob;
  const lines = sprite.map((line) => line.replace(/\{E\}/g, eye));

  // Apply headgear on line 0 if it's blank — class item takes priority over rarity hat
  if (!lines[0].trim()) {
    if (fighterClass && CLASS_HATS[fighterClass]) {
      lines[0] = CLASS_HATS[fighterClass];
    } else if (hat !== "none") {
      lines[0] = HAT_LINES[hat];
    }
  }

  // Evolution: custom body sprite only shown at level 25+
  if (customSprite && customSprite.length > 0 && level >= 25) {
    if (bodyType === "quadruped") {
      // Quadruped: head on the LEFT, body on the RIGHT (side by side)
      // 1. Right-align head lines so the right content edges are flush,
      //    making the head connect snugly to the body on its right side.
      const trimmedHead = lines.map((l) => l.trimEnd());
      const headContentWidth = Math.max(...trimmedHead.map((l) => l.length));
      const paddedHead = trimmedHead.map((l) => l.padStart(headContentWidth));

      // 2. Strip common leading whitespace from body lines to close the gap
      const nonEmptyBody = customSprite.filter((l) => l.trim().length > 0);
      const minBodyIndent = nonEmptyBody.length > 0
        ? Math.min(...nonEmptyBody.map((l) => l.match(/^( *)/)![1].length))
        : 0;
      const dedentedBody = customSprite.map((l) => l.slice(minBodyIndent));

      const bodyHeight = dedentedBody.length;
      const headHeight = paddedHead.length;
      const totalHeight = Math.max(headHeight, bodyHeight);
      const headOffset = Math.max(0, Math.floor((totalHeight - headHeight) / 2));

      const combined: string[] = [];
      for (let i = 0; i < totalHeight; i++) {
        const headIdx = i - headOffset;
        const headLine = headIdx >= 0 && headIdx < headHeight
          ? paddedHead[headIdx]
          : " ".repeat(headContentWidth);
        const bodyLine = i < bodyHeight ? dedentedBody[i] : "";
        combined.push(headLine + bodyLine);
      }
      return combined.map((line) => color(line)).join("\n");
    }

    // Biped (default): center the head over the wider body sprite
    const bodyWidth = Math.max(...customSprite.map((l) => l.length));
    const headWidth = Math.max(...lines.map((l) => l.length));
    if (bodyWidth > headWidth) {
      const pad = Math.floor((bodyWidth - headWidth) / 2);
      const padding = " ".repeat(pad);
      for (let i = 0; i < lines.length; i++) {
        lines[i] = padding + lines[i] + padding;
      }
    }
    lines.push(...customSprite);
  } else if (fighterClass && bodyType === "quadruped") {
    // Default tiny quadruped body (4 legs, side by side)
    const trimmedHead = lines.map((l) => l.trimEnd());
    const headContentWidth = Math.max(...trimmedHead.map((l) => l.length));
    const paddedHead = trimmedHead.map((l) => l.padStart(headContentWidth));
    const totalHeight = Math.max(paddedHead.length, DEFAULT_BODY_QUADRUPED.length);
    const headOffset = Math.max(0, Math.floor((totalHeight - paddedHead.length) / 2));
    const combined: string[] = [];
    for (let i = 0; i < totalHeight; i++) {
      const headIdx = i - headOffset;
      const headLine = headIdx >= 0 && headIdx < paddedHead.length
        ? paddedHead[headIdx]
        : " ".repeat(headContentWidth);
      const bodyLine = i < DEFAULT_BODY_QUADRUPED.length ? DEFAULT_BODY_QUADRUPED[i] : "";
      combined.push(headLine + bodyLine);
    }
    return combined.map((line) => color(line)).join("\n");
  } else if (fighterClass) {
    // Default tiny biped body (2 legs, below head)
    lines.push(...DEFAULT_BODY_BIPED);
  }

  return lines.map((line) => color(line)).join("\n");
}

export function getSpeciesColor(species: BuddySpecies): ChalkInstance {
  return SPECIES_COLORS[species] ?? chalk.white;
}

export function getClassColor(fighterClass: FighterClass): ChalkInstance {
  return CLASS_COLORS[fighterClass];
}

export function getRarityColor(rarity: BuddyRarity): ChalkInstance {
  return RARITY_COLORS[rarity];
}

export function getRarityStars(rarity: BuddyRarity): string {
  return RARITY_STARS[rarity];
}

export function getClassEmoji(fighterClass: FighterClass): string {
  const emojis: Record<FighterClass, string> = {
    explorer: ">>",
    builder: "[]",
    commander: "$>",
    architect: "##",
    debugger: "{}",
  };
  return emojis[fighterClass];
}
