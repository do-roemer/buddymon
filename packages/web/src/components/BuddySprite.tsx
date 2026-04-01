"use client";

import type { BuddySpecies, BuddyHat } from "@buddymon/shared-types";

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
}

export function BuddySprite({
  species,
  size = 8,
  animated = true,
  flipped = false,
  shiny = false,
  eye = "\u00b7",
  hat = "none",
}: Props) {
  const sprite = SPRITES[species] ?? SPRITES.blob;
  const color = SPECIES_COLORS[species] ?? "#F5F5F5";

  // Replace eye placeholders and apply hat
  const lines = sprite.map((line) => line.replace(/\{E\}/g, eye));
  if (hat !== "none" && !lines[0].trim()) {
    lines[0] = HAT_LINES[hat] ?? "";
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
