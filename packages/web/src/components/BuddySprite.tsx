"use client";

import type { BuddySpecies, BuddyHat, BodyType } from "@buddymon/shared-types";

// Original Claude Code companion ASCII sprites (5 lines, ~12 wide)
// {E} is replaced with the eye character at render time
const SPRITES: Record<BuddySpecies, string[]> = {
  duck: [
    "            ",
    "    __      ",
    "  <({E} )___  ",
    "   (  ._>   ",
    "    `--\u00b4    ",
  ],
  goose: [
    "            ",
    "     ({E}>    ",
    "     ||     ",
    "   _(__)_   ",
    "    ^^^^    ",
  ],
  blob: [
    "            ",
    "   .----.   ",
    "  ( {E}  {E} )  ",
    "  (      )  ",
    "   `----\u00b4   ",
  ],
  cat: [
    "            ",
    "   /\\_/\\    ",
    "  ( {E}   {E})  ",
    "  (  \u03c9  )   ",
    '  (")_(")   ',
  ],
  dragon: [
    "            ",
    "  /^\\  /^\\  ",
    " <  {E}  {E}  > ",
    " (   ~~   ) ",
    "  `-vvvv-\u00b4  ",
  ],
  octopus: [
    "            ",
    "   .----.   ",
    "  ( {E}  {E} )  ",
    "  (______)  ",
    "  /\\/\\/\\/\\  ",
  ],
  owl: [
    "            ",
    "   /\\  /\\   ",
    "  (({E})({E}))  ",
    "  (  ><  )  ",
    "   `----\u00b4   ",
  ],
  penguin: [
    "            ",
    "  .---.     ",
    "  ({E}>{E})     ",
    " /(   )\\    ",
    "  `---\u00b4     ",
  ],
  turtle: [
    "            ",
    "   _,--._   ",
    "  ( {E}  {E} )  ",
    " /[______]\\ ",
    "  ``    ``  ",
  ],
  snail: [
    "            ",
    " {E}    .--.  ",
    "  \\  ( @ )  ",
    "   \\_`--\u00b4   ",
    "  ~~~~~~~   ",
  ],
  ghost: [
    "            ",
    "   .----.   ",
    "  / {E}  {E} \\  ",
    "  |      |  ",
    "  ~`~``~`~  ",
  ],
  axolotl: [
    "            ",
    "}~(______)~{",
    "}~({E} .. {E})~{",
    "  ( .--. )  ",
    "  (_/  \\_)  ",
  ],
  capybara: [
    "            ",
    "  n______n  ",
    " ( {E}    {E} ) ",
    " (   oo   ) ",
    "  `------\u00b4  ",
  ],
  cactus: [
    "            ",
    " n  ____  n ",
    " | |{E}  {E}| | ",
    " |_|    |_| ",
    "   |    |   ",
  ],
  robot: [
    "            ",
    "   .[||].   ",
    "  [ {E}  {E} ]  ",
    "  [ ==== ]  ",
    "  `------\u00b4  ",
  ],
  rabbit: [
    "            ",
    "   (\\__/)   ",
    "  ( {E}  {E} )  ",
    " =(  ..  )= ",
    '  (")__(")  ',
  ],
  mushroom: [
    "            ",
    " .-o-OO-o-. ",
    "(__________)",
    "   |{E}  {E}|   ",
    "   |____|   ",
  ],
  chonk: [
    "            ",
    "  /\\    /\\  ",
    " ( {E}    {E} ) ",
    " (   ..   ) ",
    "  `------\u00b4  ",
  ],
};

const HAT_LINES: Record<string, string> = {
  none:      "",
  crown:     "   \\^^^/    ",
  tophat:    "   [___]    ",
  propeller: "    -+-     ",
  halo:      "   (   )    ",
  wizard:    "    /^\\     ",
  beanie:    "   (___)    ",
  tinyduck:  "    ,>      ",
};

// Default tiny bodies for unevolved buddymons (level < 25 or no custom sprite)
const DEFAULT_BODY_BIPED: string[] = [
  "    |  |    ",
  "   _/  \\_   ",
];

const DEFAULT_BODY_QUADRUPED: string[] = [
  "      ",
  "      ",
  "      ",
  "~\\__  ",
  " || ||",
];

// Class-specific headgear (replaces rarity hats when class is known)
const CLASS_HATS: Record<string, string> = {
  explorer:  "    ~?>     ",   // spyglass / periscope
  builder:   "   [===]    ",   // hard hat
  commander: "   \\===/    ",   // military command cap
  architect: "    /##\\    ",   // blueprint thinking cap
  debugger:  "   d{!!}b   ",   // bug antenna headband
};

const SPECIES_COLORS: Record<BuddySpecies, string> = {
  capybara: "#C4A882",
  duck: "#FFD700",
  goose: "#F5F5F5",
  cat: "#FF9F43",
  rabbit: "#FFC0CB",
  owl: "#8B6914",
  penguin: "#87CEEB",
  turtle: "#4CAF50",
  snail: "#DEB887",
  dragon: "#E74C3C",
  octopus: "#FF6B9D",
  axolotl: "#FF69B4",
  ghost: "#B8B8FF",
  robot: "#95A5A6",
  blob: "#7CFC00",
  cactus: "#2E8B57",
  mushroom: "#CD853F",
  chonk: "#FFA07A",
};

interface Props {
  species: BuddySpecies;
  size?: number;
  animated?: boolean;
  flipped?: boolean;
  shiny?: boolean;
  eye?: string;
  hat?: string;
  fighterClass?: string;
  customSprite?: string[];
  bodyType?: BodyType;
  level?: number;
}

export function BuddySprite({
  species,
  size = 8,
  animated = true,
  flipped = false,
  shiny = false,
  eye = "\u00b7",
  hat = "none",
  fighterClass,
  customSprite,
  bodyType,
  level = 0,
}: Props) {
  const color = SPECIES_COLORS[species] ?? "#F5F5F5";

  // Always start with the species head (hat + eyes applied)
  const sprite = SPRITES[species] ?? SPRITES.blob;
  const lines = sprite.map((line) => line.replace(/\{E\}/g, eye));
  if (!lines[0].trim()) {
    if (fighterClass && CLASS_HATS[fighterClass]) {
      lines[0] = CLASS_HATS[fighterClass];
    } else if (hat !== "none") {
      lines[0] = HAT_LINES[hat] ?? "";
    }
  }

  // Evolution stages (only for actual fighters with a class):
  //   < 10: head only
  //  10-24: head + default tiny legs
  //   25+:  head + full custom body (falls back to tiny legs if no custom sprite)
  const hasFullBody = customSprite && customSprite.length > 0 && level >= 25;
  const hasTinyBody = fighterClass && level >= 10;

  const bodyLines = hasFullBody ? customSprite : hasTinyBody
    ? (bodyType === "quadruped" ? DEFAULT_BODY_QUADRUPED : DEFAULT_BODY_BIPED)
    : null;

  if (bodyLines) {
    const isQuadruped = bodyType === "quadruped" && (hasFullBody || hasTinyBody);
    if (isQuadruped) {
      const trimmedHead = lines.map((l) => l.trimEnd());
      const headContentWidth = Math.max(...trimmedHead.map((l) => l.length));
      const paddedHead = trimmedHead.map((l) => l.padStart(headContentWidth));

      const nonEmptyBody = bodyLines.filter((l) => l.trim().length > 0);
      const minBodyIndent = nonEmptyBody.length > 0
        ? Math.min(...nonEmptyBody.map((l) => l.match(/^( *)/)![1].length))
        : 0;
      const dedentedBody = bodyLines.map((l) => l.slice(minBodyIndent));

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
      lines.length = 0;
      lines.push(...combined);
    } else {
      // Biped: center head over wider body
      const bodyWidth = Math.max(...bodyLines.map((l) => l.length));
      const headWidth = Math.max(...lines.map((l) => l.length));
      if (bodyWidth > headWidth) {
        const pad = Math.floor((bodyWidth - headWidth) / 2);
        const padding = " ".repeat(pad);
        for (let i = 0; i < lines.length; i++) {
          lines[i] = padding + lines[i] + padding;
        }
      }
      lines.push(...bodyLines);
    }
  }

  // Scale font size relative to the size prop (size=8 is the default ~baseline)
  const fontSize = Math.max(8, size * 1.5);

  return (
    <div
      className={`inline-block ${animated ? "animate-bob" : ""} ${shiny ? "animate-shiny" : ""}`}
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
    >
      <pre
        style={{
          color,
          fontFamily: "'Courier New', 'Consolas', monospace",
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
          margin: 0,
          whiteSpace: "pre",
          textShadow: shiny ? `0 0 4px ${color}` : undefined,
        }}
      >
        {lines.join("\n")}
      </pre>
    </div>
  );
}
