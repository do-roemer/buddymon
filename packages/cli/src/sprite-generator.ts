import type { FighterClass, FighterStats, BuddyRarity, BuddySpecies, BodyType } from "@buddymon/shared";

const LINE_WIDTH = 22;

export interface SpriteInput {
  class: FighterClass;
  bodyType: BodyType;
  stats: FighterStats;
  rarity: BuddyRarity;
  shiny: boolean;
  species: BuddySpecies;
  ownerHash: string;
}

// ── Template pool structure ───────────────────────────────────────────
// Each class×bodyType has: base variants (neutral), plus stat-specific
// variants for ATK, DEF, SPD emphasis. The generator picks the pool
// based on the dominant stat (>60), then hash-selects within that pool.

interface TemplatePool {
  base: string[][];
  atk: string[][];
  def: string[][];
  spd: string[][];
}

// ── BIPED TEMPLATES ───────────────────────────────────────────────────
// 8 lines each, padded to 22 chars. Body goes BELOW the head.

const BIPED: Record<FighterClass, TemplatePool> = {
  // ── Explorer: adventure gear, spyglass, compass, backpack ──────────
  explorer: {
    base: [
      [ // Spyglass + backpack
        "      |      |",
        " ?~> /| .--. |\\",
        "    | | |  | | |",
        "    | | [==] | |",
        "    |_|      |_|",
        "     |   ||   |",
        "     |   ||   |",
        "    _/   /\\   \\_",
      ],
      [ // Compass + map
        "      |      |",
        "    /=| .__. |\\  (~)",
        "    | | |  | | |",
        "    | | (^^) | |",
        "    |_|      |_|",
        "     |   ||   |",
        "     |   ||   |",
        "    _/   /\\   \\_",
      ],
      [ // Lantern + rope
        "      |      |",
        " {o} /| .--. |\\",
        "    | | |  | | |",
        "    | | [{}] | |",
        "    |_|  \\/  |_|",
        "     |   ||   |",
        "     |   ||   |",
        "    _/   /\\   \\_",
      ],
    ],
    atk: [ // Armed explorer — crossbow, dagger, aggressive stance
      [
        "    ^^|      |^^",
        " >>>/|| .--. ||\\>>",
        "    | | |><| | |",
        "    | | [==] | |",
        "    |_|  ^^  |_|",
        "     | _/||\\_  |",
        "     |/  ||  \\|",
        "    _/  /  \\  \\_",
      ],
      [
        "    ^^|      |^^",
        "  >>/|| .--. ||\\",
        "    | | |>>| | |",
        "    | | [==] | |  >",
        "    |_|  /\\  |_|",
        "     | _/||\\_  |",
        "     |   ||   |",
        "    _/  _/\\_  \\_",
      ],
    ],
    def: [ // Armored explorer — shield, plate vest
      [
        "    [=|      |=]",
        "   []/| .--. ||\\",
        "    |=| |  | |=|",
        "    |=| [==] |=|",
        "    |_|______|_|",
        "     |   ||   |",
        "     |   ||   |",
        "    _/   /\\   \\_",
      ],
      [
        "   [==|      |==]",
        "    /|| .--. ||\\",
        "    |=| |  | |=|",
        "    |#| [==] |#|",
        "    |_|======|_|",
        "     |   ||   |",
        "     |   ||   |",
        "    _/   /\\   \\_",
      ],
    ],
    spd: [ // Swift explorer — cape, light boots, speed lines
      [
        "   ~~>|      |<~~",
        "    ~/| .--. |\\~",
        "    | | |  | | |",
        "    | | (  ) | |",
        "    |_|      |_|",
        "    ~|   ||   |~",
        "    ~|   ||   |~",
        "   ~/    /\\    \\~",
      ],
      [
        "    ~>|      |<~",
        "   ~/|| .--. ||\\~",
        "    | | |  | | |",
        "    | | (  ) | |",
        "    |_|      |_|",
        "   ~~|   ||   |~~",
        "   ~ |   ||   | ~",
        "   ~/    ~~    \\~",
      ],
    ],
  },

  // ── Builder: tool belt, hammer, wrench, work apron ─────────────────
  builder: {
    base: [
      [ // Wrench left, tool belt
        "      |      |",
        " ]==/|| [==] ||\\",
        "    |  |    |  |",
        "    |  |[--]|  |",
        "    |__|    |__|",
        "     /|      |\\",
        "     | |    | |",
        "     |_|    |_|",
      ],
      [ // Hammer right
        "      |      |",
        "    /|| [==] ||\\ ==[",
        "    |  |    |  |",
        "    |  |[##]|  |",
        "    |__|    |__|",
        "     /|      |\\",
        "     | |    | |",
        "     |_|    |_|",
      ],
      [ // Dual wrenches
        "      |      |",
        " ]-/|| [==] ||\\-[",
        "    |  |    |  |",
        "    |  |{==}|  |",
        "    |__|    |__|",
        "     /|      |\\",
        "     | |    | |",
        "     |_|    |_|",
      ],
    ],
    atk: [ // Power drill, saw blade, aggressive
      [
        "    ^^|      |^^",
        " >>>/|| [==] ||\\>>>",
        "    |  |    |  |",
        "    |  |[><]|  |",
        "    |__|^^^^|__|",
        "     /|  ^^  |\\",
        "     | |    | |",
        "     |_|    |_|",
      ],
      [
        "   ^^^|      |",
        " >>/|| [==] ||\\>>=",
        "    |  |    |  |",
        "    |  |[>>]|  |",
        "    |__|^^^^|__|",
        "     /|      |\\",
        "     | | ^^ | |",
        "     |_|    |_|",
      ],
    ],
    def: [ // Heavy armor, reinforced body
      [
        "    [=|      |=]",
        "   []/|| [==] ||\\[]",
        "    |==|    |==|",
        "    |==|[==]|==|",
        "    |__|====|__|",
        "     /|      |\\",
        "     |=|    |=|",
        "     |_|    |_|",
      ],
      [
        "   [==|      |==]",
        "    /|| [==] ||\\",
        "    |=#|    |#=|",
        "    |=#|[==]|#=|",
        "    |__|====|__|",
        "     /|  ==  |\\",
        "     | |    | |",
        "     |_|    |_|",
      ],
    ],
    spd: [ // Light gear, streamlined
      [
        "   ~~>|      |",
        "    ~/|| [==] ||\\~",
        "    |  |    |  |",
        "    |  |(  )|  |",
        "    |__|    |__|",
        "    ~/|      |\\~",
        "    ~ | |  | | ~",
        "   ~/|_|    |_|\\~",
      ],
      [
        "    ~>|      |<~",
        "   ~/|| [==] ||\\",
        "    |  |    |  |",
        "    |  |(  )|  |",
        "    |__|    |__|",
        "   ~~|  |  |  |~~",
        "   ~ | |    | | ~",
        "   ~/|_|    |_|\\~",
      ],
    ],
  },

  // ── Commander: sword, cape, military gear, armor ───────────────────
  commander: {
    base: [
      [ // Sword + cape
        " *~\\|^^    ^^|/~*",
        "   \\|  /==\\  |/>=",
        "    |  |  |  |",
        "    |__|  |__|",
        "   /==|    |==\\",
        "   |  |    |  |",
        "   |^^|    |^^|",
      ],
      [ // Battle standard
        "  ~\\|^^    ^^|/~",
        "   \\|  /==\\  |/>",
        "    |  |##|  |",
        "    |__|  |__|",
        "   /==|    |==\\",
        "   |  |    |  |",
        "   |^^|    |^^|",
      ],
      [ // Dual swords
        " >=\\|^^    ^^|/=<",
        "   \\|  /==\\  |/",
        "    |  |  |  |",
        "    |__|  |__|",
        "   /==|    |==\\",
        "   |  |    |  |",
        "   |^^|    |^^|",
      ],
    ],
    atk: [ // Dual blades, fierce, spiked pauldrons
      [
        " >>|^^^^  ^^^^|<<",
        "  >/|  /==\\  |\\>=",
        "    |  |><|  |",
        "    |__|  |__|",
        "  /===| ^^ |===\\",
        "  |  ^|    |^  |",
        "  |^^^|    |^^^|",
      ],
      [
        ">>\\|^^^^  ^^^^|/<<",
        "  \\|  /==\\  |/>=",
        "    |  |><|  |",
        "    |__|  |__|",
        "  /===|    |===\\",
        "  | ^||    ||^ |",
        "  |^^^|    |^^^|",
      ],
    ],
    def: [ // Plate armor, shield, fortress stance
      [
        " [=|^^^^^^^^|=]",
        "  [|  /==\\  |]",
        "   |==[  ]==|",
        "   |__|==|__|",
        "  /===|    |===\\",
        "  |==|      |==|",
        "  |==|      |==|",
      ],
      [
        "  [|^^^^^^^^|]",
        " [=|  /==\\  |=]",
        "   |#=|  |=#|",
        "   |__|==|__|",
        "  /==|      |==\\",
        "  |==|      |==|",
        "  |__|      |__|",
      ],
    ],
    spd: [ // Light commander, swift cape, agile
      [
        "  ~>|^^    ^^|<~",
        "   \\|  /==\\  |/",
        "    |  |  |  |",
        "    |__|  |__|",
        "  ~/==|    |==\\~",
        "  ~ |      |  ~",
        "  ~/|      |\\~",
      ],
      [
        " ~~\\|^^    ^^|/~~",
        "   \\|  /==\\  |/",
        "    |  |  |  |",
        "    |__|  |__|",
        "   ~/=|    |=\\~",
        "   ~ ||    || ~",
        "   ~/||    ||\\~",
      ],
    ],
  },

  // ── Architect: blueprints, ruler, scholarly robes ───────────────────
  architect: {
    base: [
      [ // Blueprints + quill
        "   \\|  .===.  |",
        "    |  |###|  |/~",
        "    |  |   |  |",
        "    |__|   |__|",
        "     |       |",
        "     |       |",
        "    _/       \\_",
      ],
      [ // Ruler + scroll
        "    |  .===.  |/",
        "   \\|  |###|  |",
        "    |  '---'  |",
        "    |__|   |__|",
        "     |       |",
        "     |       |",
        "    _/       \\_",
      ],
      [ // Compass + drafting
        "   \\|  .===.  |",
        "    |  |<#>|  |/~",
        "    |  |   |  |",
        "    |__|   |__|",
        "     |       |",
        "     |       |",
        "    _/       \\_",
      ],
    ],
    atk: [ // Sharp instruments, precision tools
      [
        "  >/|  .===.  |",
        "    |  |>>>|  |\\>",
        "    |  | > |  |",
        "    |__|   |__|",
        "    ^|       |^",
        "     |   ^^  |",
        "    _/       \\_",
      ],
      [
        "    |  .===.  |>>",
        "  >/|  |>#>|  |",
        "    |  |   |  |",
        "    |__|   |__|",
        "     |^      ^|",
        "     |       |",
        "    _/       \\_",
      ],
    ],
    def: [ // Reinforced robes, armored
      [
        "  [|  .===.  |]",
        "   |  |###|  |",
        "   |==[   ]==|",
        "   |__|===|__|",
        "    =|       |=",
        "     |       |",
        "    _/       \\_",
      ],
      [
        "  [|  .===.  |]",
        "   |==[###]==|",
        "   |  |   |  |",
        "   |__|===|__|",
        "   [=|       |=]",
        "     |       |",
        "    _/       \\_",
      ],
    ],
    spd: [ // Flowing robes, wind effect
      [
        "  ~\\|  .===.  |",
        "    |  |###|  |~",
        "    |  |   |  |",
        "    |__|   |__|",
        "   ~ |       | ~",
        "   ~ |       | ~",
        "   ~/         \\~",
      ],
      [
        "   ~|  .===.  |~",
        "  ~\\|  |###|  |/~",
        "    |  |   |  |",
        "    |__|   |__|",
        "    ~|       |~",
        "   ~ |       | ~",
        "   ~/         \\~",
      ],
    ],
  },

  // ── Debugger: magnifying glass, lab coat, bug net ──────────────────
  debugger: {
    base: [
      [ // Magnifying glass + lab coat
        "  {|          |}",
        "   |  .----.  |",
        "   |  | () |  |",
        "   |__|    |__|",
        "     |      |",
        "     |      |",
        "    _/      \\_",
      ],
      [ // Bug net + scope
        "  {|          |}",
        "   |  .----.  |",
        "   |  |({})|  |",
        "   |__|    |__|",
        "     |      |",
        "     |      |",
        "    _/      \\_",
      ],
      [ // Terminal output + wires
        "  {|          |}",
        "   |  .----.  |",
        "   |  |>_< |  |",
        "   |__|    |__|",
        "     |      |",
        "     |      |",
        "    _/      \\_",
      ],
    ],
    atk: [ // Bug zapper, offensive debugging
      [
        " >>{|        |}<<",
        "   |  .----.  |",
        "   |  |*><*|  |",
        "   |__|^^^^|__|",
        "    ^|      |^",
        "     |  ^^  |",
        "    _/      \\_",
      ],
      [
        "  {|^^      ^^|}",
        " >>|  .----.  |<<",
        "   |  |>><>|  |",
        "   |__|^^^^|__|",
        "    ^|      |^",
        "     |      |",
        "    _/      \\_",
      ],
    ],
    def: [ // Protective gear, shielded lab coat
      [
        "  {|          |}",
        "  [|  .----.  |]",
        "  [|  | () |  |]",
        "  [|__|    |__|]",
        "    =|      |=",
        "     |      |",
        "    _/      \\_",
      ],
      [
        " [={|        |}=]",
        "   |  .----.  |",
        "   |==| () |==|",
        "   |__|====|__|",
        "     |      |",
        "     |      |",
        "    _/      \\_",
      ],
    ],
    spd: [ // Jet boots, streamlined
      [
        "  {|          |}",
        "   |  .----.  |",
        "   |  | () |  |",
        "   |__|    |__|",
        "    ~|      |~",
        "    ~|      |~",
        "   ~/        \\~",
      ],
      [
        "  {|          |}",
        "  ~|  .----.  |~",
        "   |  | () |  |",
        "   |__|    |__|",
        "   ~|      |~",
        "   ~|   ~~ |~",
        "   ~/   ~~  \\~",
      ],
    ],
  },
};

// ── QUADRUPED TEMPLATES ───────────────────────────────────────────────
// 6-7 lines each, padded to 22 chars. Body goes to the RIGHT of head.
// NO leading whitespace — renderer right-aligns head to connect.

const QUADRUPED: Record<FighterClass, TemplatePool> = {
  // ── Explorer quadruped ─────────────────────────────────────────────
  explorer: {
    base: [
      [ // Saddlebags
        "~/=============\\~",
        "|  [bag] [bag] |",
        "|    .------.  |",
        "|    '------'  |",
        "\\______________/",
        " ||  ||    || ||",
        "_/|  |\\   _/| |\\",
      ],
      [ // Compass + pack
        "--/=============\\",
        "| [bag]  .==.  |",
        "|   .--------. |",
        "|   '--------' |",
        "\\______________/",
        " ||  ||    || ||",
        "_/|  |\\   _/| |\\",
      ],
      [ // Rope + lantern
        "~/===========\\~~",
        "| .==.  {oo} |",
        "|  .--------.  |",
        "|  '--------'  |",
        "\\______________/",
        " ||  ||    || ||",
        "_/|  |\\   _/| |\\",
      ],
    ],
    atk: [
      [ // Spear harness, aggressive
        "~/=====>>=====\\^",
        "| [>>]  [>>]  |",
        "|  .---^^^--.  |",
        "|  '--------'  |",
        "\\____^^^^_____/",
        " /|  /\\   /\\  |\\",
        "|_| |__|  |_| |_|",
      ],
      [
        "^/=====/\\=====\\^",
        "|  >>   [>>]  |",
        "|  .--^^^^--.  |",
        "|  '--------'  |",
        "\\___^^____^^__/",
        " /|  /\\   /\\  |\\",
        "|_| |__|  |_| |_|",
      ],
    ],
    def: [
      [ // Armored saddlebags
        "[=/=============\\=]",
        "|==[bag] [bag]==|",
        "|    .------.  |",
        "|    '------'  |",
        "\\==============/",
        " ||  ||    || ||",
        "_/|  |\\   _/| |\\",
      ],
      [
        "[=/============\\=]",
        "|==[###] [###]=|",
        "|   .--------.  |",
        "|   '--------'  |",
        "\\===============/",
        " ||  ||    || ||",
        "_/|  |\\   _/| |\\",
      ],
    ],
    spd: [
      [ // Light, aerodynamic
        "~/=============\\~>",
        "|       [bag]  |",
        "|    .------.  |",
        "|    '------'  |~",
        "\\______________/~",
        "~||  ||    || ||~",
        "~/|  |\\   _/| |\\~",
      ],
      [
        "~~/============\\~~",
        "|  [bag]       |",
        "|    .------.  |",
        "|    '------'  |~",
        "\\______________/~",
        "~||  ||    || ||~",
        "~/|  |\\   _/| |\\",
      ],
    ],
  },

  // ── Builder quadruped ──────────────────────────────────────────────
  builder: {
    base: [
      [ // Tool harness
        "~[======/\\=====]",
        "| [wrench] |==|",
        "|  |      | | |",
        "|__|______|_|__|",
        " ||   ||   ||",
        "_/|  _/|  _/|",
      ],
      [ // Gear rack
        "~[=====]====[==]",
        "| [gear]  |==| |",
        "|  |      |  | |",
        "|__|______|__|_|",
        " ||   ||   ||",
        "_/|  _/|  _/|",
      ],
      [ // Bolt harness
        "~[===={##}====]",
        "| [bolt]  |  | |",
        "|  |      |  | |",
        "|__|______|__|_|",
        " ||   ||   ||",
        "_/|  _/|  _/|",
      ],
    ],
    atk: [
      [ // Power tools, aggressive
        "^[======/\\=====]>",
        "| [>>==>>] |>>|",
        "|  |  ^^  | | |",
        "|__|__^^__|_|__|",
        " /|   /|   /|",
        "|_|  |_|  |_|",
      ],
      [
        "^[==>>==>>==>>==]",
        "| [drill]  |>>|",
        "|  |  ^^  |  | |",
        "|__|__^^__|__|_|",
        " /|   /|   /|",
        "|_|  |_|  |_|",
      ],
    ],
    def: [
      [ // Armored harness
        "=[======/\\=====]=",
        "|=[wrench]=|==|=",
        "|==|      |=|==|",
        "|__|======|_|__|",
        " ||   ||   ||",
        "_/|  _/|  _/|",
      ],
      [
        "=[=====[==]=====]",
        "|=[gear]==|==|=|",
        "|==|      |==|=|",
        "|__|======|__|_|",
        " ||   ||   ||",
        "_/|  _/|  _/|",
      ],
    ],
    spd: [
      [ // Lightweight harness
        "~[======/\\=====]~",
        "|       ~ |  | ~",
        "|  |      | | |",
        "|__|______|_|__|",
        "~||   ||   ||~",
        "~/|  ~/|  ~/|",
      ],
      [
        "~~[=====/\\====]~~",
        "|  [  ]   |  | ~",
        "|  |      | | |",
        "|__|______|_|__|",
        "~||   ||   ||~",
        "~/|  ~/|  ~/|",
      ],
    ],
  },

  // ── Commander quadruped ────────────────────────────────────────────
  commander: {
    base: [
      [ // War armor + banner
        "~[==============]>>",
        "|##| .----. |##|",
        "|  | |<##>| |  |",
        "|  | '----' |  |",
        "\\__|________|__/",
        " /|  /\\  /\\  |\\",
        "|_| |__||__| |_|",
      ],
      [ // Battle plate
        "~[==============]>",
        "|##| .----. |##|",
        "|  | |[**]| |  |",
        "|  | '----' |  |",
        "\\__|________|__/",
        " /|  /\\  /\\  |\\",
        "|_| |__||__| |_|",
      ],
      [ // War saddle
        "~[=============]>=",
        "|##| .----. |##|",
        "|  | |{==}| |  |",
        "|  | '----' |  |",
        "\\__|________|__/",
        " /|  /\\  /\\  |\\",
        "|_| |__||__| |_|",
      ],
    ],
    atk: [
      [ // Blade armor, spikes
        "^[==============]>>",
        "|^^| .----. |^^|",
        "|>>| |<><>| |<<|",
        "|  | '----' |  |",
        "\\^^|__^^^^__|^^/",
        " /|  /\\  /\\  |\\",
        "|^| |__||__| |^|",
      ],
      [
        "^[====>>====>>==]>>",
        "|^^| .----. |^^|",
        "|  | |>>>>| |  |",
        "|  | '----' |  |",
        "\\^^|________|^^/",
        " /|  /\\  /\\  |\\",
        "|^| |__||__| |^|",
      ],
    ],
    def: [
      [ // Heavy plate armor
        "=[==============]=",
        "|==| .----. |==|",
        "|==| |<##>| |==|",
        "|==| '----' |==|",
        "\\==|========|==/",
        " /|  /\\  /\\  |\\",
        "|=| |==||==| |=|",
      ],
      [
        "=[=============]=",
        "|##|=.----.=|##|",
        "|==| |[==]| |==|",
        "|==| '----' |==|",
        "\\==|========|==/",
        " ||  ||  ||  ||",
        "_/|  |\\  /|  |\\",
      ],
    ],
    spd: [
      [ // Swift war mount
        "~[==============]>~",
        "|  | .----. |  |~",
        "|  | |<##>| |  |",
        "|  | '----' |  |",
        "\\__|________|__/~",
        "~/|  /\\  /\\  |\\~",
        "~/_| ~~||~~| |_\\~",
      ],
      [
        "~~[============]>~~",
        "|  | .----. |  | ~",
        "|  | |{  }| |  |",
        "|  | '----' |  |",
        "\\__|________|__/~",
        "~/|  /\\  /\\  |\\~",
        "~/| |__||__| |\\~",
      ],
    ],
  },

  // ── Architect quadruped ────────────────────────────────────────────
  architect: {
    base: [
      [ // Scroll saddlebag, blueprint
        "--\\______________/",
        "|  [##]  .----. |",
        "|  ~~~~  | ## | |",
        "\\__|______|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
      [ // Drafting tools
        "--\\______________/",
        "|  {==}  .----. |",
        "|  ~~~~  |    | |",
        "\\__|______|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
      [ // Compass + ruler
        "--\\______________/",
        "|  [<>]  .----. |",
        "|  ~~~~  |<##>| |",
        "\\__|______|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
    ],
    atk: [
      [
        "^-\\______________/>",
        "|  [>>]  .----. |",
        "|  ^^^^  |>>#>| |",
        "\\__|__^^__|__|_/",
        " /|  /|   /|  /|",
        "|_| |_|  |_| |_|",
      ],
      [
        ">-\\______________/^",
        "|  [^^]  .----. |",
        "|  >>>>  | >> | |",
        "\\__|______|__|_/",
        " /|  /|   /|  /|",
        "|_| |_|  |_| |_|",
      ],
    ],
    def: [
      [
        "=-\\______________/=",
        "|==[##]==.----.=|",
        "|  ====  |=##=| |",
        "\\__|======|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
      [
        "=[\\______________/]",
        "|==[==]  .----. |",
        "|  ~~~~  |=##=| |",
        "\\__|======|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
    ],
    spd: [
      [
        "~-\\______________/~",
        "|  [##]  .----. |",
        "|  ~~~~  | ## | |",
        "\\__|______|__|_/~",
        "~||  ||   ||  ||~",
        "~/| ~/|  ~/| ~/|",
      ],
      [
        "~~\\______________/~",
        "|  [##]  .----. |~",
        "|  ~~~~  | ## | |",
        "\\__|______|__|_/~",
        "~||  ||   ||  ||~",
        "~/| ~/|  ~/| ~/|",
      ],
    ],
  },

  // ── Debugger quadruped ─────────────────────────────────────────────
  debugger: {
    base: [
      [ // Lab coat harness, magnifying glass
        "~\\______________/",
        "|  {()}  .---.  |",
        "|  ~~~~  |   |  |",
        "\\__|______|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
      [ // Bug net, scope
        "~\\______________/",
        "|  (@@)  .---.  |",
        "|  ~~~~  |   |  |",
        "\\__|______|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
      [ // Diagnostic harness
        "~\\______________/",
        "|  {<>}  .---.  |",
        "|  ~~~~  | > |  |",
        "\\__|______|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
    ],
    atk: [
      [
        "^\\___^^^_________/",
        "|  {>>}  .---.  |",
        "|  ^^^^  |>><|  |",
        "\\__|__^^__|__|_/",
        " /|  /|   /|  /|",
        "|_| |_|  |_| |_|",
      ],
      [
        "^\\______________/^",
        "| >{()}> .---.  |",
        "|  ^^^^  |><>|  |",
        "\\__|__^^__|__|_/",
        " /|  /|   /|  /|",
        "|_| |_|  |_| |_|",
      ],
    ],
    def: [
      [
        "=\\______________/=",
        "|=={()}==.---.==|",
        "|  ~~~~  |===|  |",
        "\\__|======|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
      [
        "=\\______________/=",
        "|  {()}  .---.  |",
        "|==~~~~==|   |==|",
        "\\__|======|__|_/",
        " ||  ||   ||  ||",
        "_/| _/|  _/| _/|",
      ],
    ],
    spd: [
      [
        "~\\______________/~",
        "|  {()}  .---.  |",
        "|  ~~~~  |   |  |",
        "\\__|______|__|_/~",
        "~||  ||   ||  ||~",
        "~/| ~/|  ~/| ~/|",
      ],
      [
        "~~\\______________/",
        "|  {()}  .---.  |~",
        "|  ~~~~  |   |  |",
        "\\__|______|__|_/~",
        "~||  ||   ||  ||~",
        "~/| ~/|  ~/| ~/|",
      ],
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────

function padLine(line: string): string {
  return line.padEnd(LINE_WIDTH).slice(0, LINE_WIDTH);
}

function seededIndex(hash: string, offset: number, max: number): number {
  if (max <= 0) return 0;
  const segment = hash.slice(offset % (hash.length - 8), (offset % (hash.length - 8)) + 8);
  return parseInt(segment, 16) % max;
}

function setChar(line: string, col: number, ch: string): string {
  if (col < 0 || col >= line.length) return line;
  if (line[col] !== " ") return line;
  return line.slice(0, col) + ch + line.slice(col + 1);
}

// ── Stat emphasis detection ───────────────────────────────────────────

type StatEmphasis = "base" | "atk" | "def" | "spd";

function getStatEmphasis(stats: FighterStats): { primary: StatEmphasis; secondary: StatEmphasis } {
  const ranked: { stat: StatEmphasis; value: number }[] = [
    { stat: "atk", value: stats.attack },
    { stat: "def", value: stats.defense },
    { stat: "spd", value: stats.speed },
  ].sort((a, b) => b.value - a.value);

  const primary = ranked[0].value > 60 ? ranked[0].stat : "base";
  const secondary = ranked[1].value > 60 ? ranked[1].stat : "base";

  return { primary, secondary };
}

// ── Cosmetic overlays ─────────────────────────────────────────────────

function applySecondaryAccents(lines: string[], secondary: StatEmphasis, bodyType: BodyType): string[] {
  if (secondary === "base") return lines;
  const result = lines.map((l) => padLine(l));

  // Light accents from secondary stat — only 2-3 chars, placed on edges
  const chars: Record<string, string[]> = {
    atk: ["^", ">"],
    def: ["=", "#"],
    spd: ["~", "~"],
  };
  const accents = chars[secondary];
  if (!accents) return result;

  if (bodyType === "biped") {
    // Accent on first and last body lines, left and right edges
    result[0] = setChar(result[0], 0, accents[0]);
    result[0] = setChar(result[0], LINE_WIDTH - 1, accents[1]);
    const last = result.length - 1;
    result[last] = setChar(result[last], 0, accents[0]);
    result[last] = setChar(result[last], LINE_WIDTH - 1, accents[1]);
  } else {
    // Quadruped: accent on right edge of first two lines
    result[0] = setChar(result[0], LINE_WIDTH - 1, accents[0]);
    if (result.length > 1) {
      result[1] = setChar(result[1], LINE_WIDTH - 1, accents[1]);
    }
  }

  return result;
}

function applyRage(lines: string[]): string[] {
  const result = lines.map((l) => padLine(l));
  // Alternating flame pattern on both edges
  const flames = ["~", "*", "^", "~", "*", "^", "~", "*", "^"];
  for (let i = 0; i < result.length; i++) {
    const ch = flames[i % flames.length];
    result[i] = setChar(result[i], 0, ch);
    result[i] = setChar(result[i], 1, ch === "~" ? "*" : "~");
    result[i] = setChar(result[i], LINE_WIDTH - 1, ch);
    result[i] = setChar(result[i], LINE_WIDTH - 2, ch === "~" ? "*" : "~");
  }
  return result;
}

function applyShiny(lines: string[], hash: string): string[] {
  const result = lines.map((l) => padLine(l));
  const sparkles = ["+", "*", ".", "+", "*"];
  let placed = 0;
  const target = 5;

  // Deterministic scatter using hash segments
  for (let attempt = 0; attempt < 30 && placed < target; attempt++) {
    const lineIdx = seededIndex(hash, attempt * 3, result.length);
    const colOffset = seededIndex(hash, attempt * 3 + 1, LINE_WIDTH - 4);
    const col = colOffset + 2; // avoid very edges

    if (result[lineIdx][col] === " ") {
      result[lineIdx] = setChar(result[lineIdx], col, sparkles[placed % sparkles.length]);
      placed++;
    }
  }

  return result;
}

function applyRarity(lines: string[], rarity: BuddyRarity): string[] {
  if (rarity !== "rare" && rarity !== "epic" && rarity !== "legendary") return lines;
  const result = lines.map((l) => padLine(l));

  if (rarity === "rare") {
    // Subtle corner accents
    result[0] = setChar(result[0], 0, "+");
    result[0] = setChar(result[0], LINE_WIDTH - 1, "+");
  } else if (rarity === "epic") {
    // Corner ornaments on first and last lines
    const ch = "+";
    result[0] = setChar(result[0], 0, ch);
    result[0] = setChar(result[0], LINE_WIDTH - 1, ch);
    const last = result.length - 1;
    result[last] = setChar(result[last], 0, ch);
    result[last] = setChar(result[last], LINE_WIDTH - 1, ch);
  } else {
    // Legendary: ornate corners + mid-line accents
    const last = result.length - 1;
    result[0] = setChar(result[0], 0, "*");
    result[0] = setChar(result[0], 1, "~");
    result[0] = setChar(result[0], LINE_WIDTH - 1, "*");
    result[0] = setChar(result[0], LINE_WIDTH - 2, "~");
    result[last] = setChar(result[last], 0, "*");
    result[last] = setChar(result[last], 1, "~");
    result[last] = setChar(result[last], LINE_WIDTH - 1, "*");
    result[last] = setChar(result[last], LINE_WIDTH - 2, "~");
    // Side accents on middle lines
    const mid = Math.floor(result.length / 2);
    result[mid] = setChar(result[mid], 0, "*");
    result[mid] = setChar(result[mid], LINE_WIDTH - 1, "*");
  }

  return result;
}

// ── Main generator ────────────────────────────────────────────────────

export function generateSprite(input: SpriteInput): string[] {
  const templates = input.bodyType === "biped" ? BIPED[input.class] : QUADRUPED[input.class];
  const { primary, secondary } = getStatEmphasis(input.stats);

  // Pick template pool based on dominant stat
  const pool = templates[primary];

  // Hash-select a variant from the pool
  const variantIdx = seededIndex(input.ownerHash, 0, pool.length);
  let lines = pool[variantIdx].map((l) => padLine(l));

  // Apply secondary stat accents (light overlay)
  lines = applySecondaryAccents(lines, secondary, input.bodyType);

  // Apply cosmetic overlays in order: rage, shiny, rarity
  if (input.stats.rageMode) {
    lines = applyRage(lines);
  }
  if (input.shiny) {
    lines = applyShiny(lines, input.ownerHash);
  }
  lines = applyRarity(lines, input.rarity);

  return lines;
}
