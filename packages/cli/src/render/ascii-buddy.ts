import chalk, { type ChalkInstance } from "chalk";
import type { FighterClass, BuddySpecies, BuddyRarity, BuddyHat } from "@buddymon/shared";

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

// Class-specific held items / accessories (appended below the sprite)
const CLASS_ACCESSORIES: Record<FighterClass, string> = {
  explorer:  "    ~?>~    ",   // spyglass
  builder:   "   /|==|\\   ",   // hammer & nails
  commander: "   -=/>=-   ",   // command sword
  architect: "   |[##]|   ",   // blueprint scroll
  debugger:  "   ~{!!}~   ",   // bug catcher
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
): string {
  const color = SPECIES_COLORS[species] ?? chalk.white;

  const sprite = SPRITES[species] ?? SPRITES.blob;
  const lines = sprite.map((line) => line.replace(/\{E\}/g, eye));

  // Apply hat overlay on line 0 if it's blank
  if (hat !== "none" && !lines[0].trim()) {
    lines[0] = HAT_LINES[hat];
  }

  if (customSprite && customSprite.length > 0) {
    // Append custom body lines below the species head
    lines.push(...customSprite);
  } else if (fighterClass && CLASS_ACCESSORIES[fighterClass]) {
    // Fallback: class accessory icon
    const classColor = CLASS_COLORS[fighterClass];
    lines.push(classColor(CLASS_ACCESSORIES[fighterClass]));
    return lines.slice(0, -1).map((line) => color(line)).join("\n") + "\n" + lines[lines.length - 1];
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
