const CLASS_ICON_COLORS: Record<string, string> = {
  explorer: "#06b6d4",
  builder: "#eab308",
  commander: "#ef4444",
  architect: "#a855f7",
  debugger: "#22c55e",
};

type FighterClass = "explorer" | "builder" | "commander" | "architect" | "debugger";
type MoveType = "read" | "write" | "bash" | "agent" | "debug";

const CLASS_DATA: Record<
  FighterClass,
  {
    description: string;
    playstyle: string;
    color: string;
    bgFrom: string;
    border: string;
    toolFocus: string;
    passive: { name: string; description: string };
    accessory: string;
    strengths: MoveType[];
    weaknesses: MoveType[];
  }
> = {
  explorer: {
    description:
      "Explorers are the investigators of the codebase. They rely on heavy Read and Glob usage, scanning files and searching patterns to outmaneuver opponents.",
    playstyle: "Evasive & analytical. Debuffs enemies on dodge, rewarding a hit-and-run style.",
    color: "text-cyan-400",
    bgFrom: "from-cyan-950/30",
    border: "border-cyan-500",
    toolFocus: "Read, Grep, Glob, WebSearch",
    passive: {
      name: "Reconnaissance",
      description: "On dodge: debuff enemy defense for 2 turns",
    },
    accessory: "~?>~",

    strengths: ["read"],
    weaknesses: ["bash"],
  },
  builder: {
    description:
      "Builders shape the codebase with Write and Edit tools. They construct defenses and deliver powerful rewrite attacks.",
    playstyle: "Tanky & steady. Gains shields each turn, absorbing damage while dealing consistent output.",
    color: "text-yellow-400",
    bgFrom: "from-yellow-950/30",
    border: "border-yellow-500",
    toolFocus: "Write, Edit, NotebookEdit",
    passive: {
      name: "Code Armor",
      description: "Start of turn: gain 8% shield for 1 turn",
    },
    accessory: "/|==|\\",

    strengths: ["write"],
    weaknesses: ["read"],
  },
  commander: {
    description:
      "Commanders execute through Bash and terminal operations. They hit hard with shell commands and chain devastating combos.",
    playstyle: "Aggressive & bursty. Crits inflict damage over time, snowballing pressure.",
    color: "text-red-400",
    bgFrom: "from-red-950/30",
    border: "border-red-500",
    toolFocus: "Bash, shell commands",
    passive: {
      name: "Root Access",
      description: "On crit: inflict DoT for 2 turns",
    },
    accessory: "-=/>=-",

    strengths: ["bash"],
    weaknesses: ["write"],
  },
  architect: {
    description:
      "Architects maintain balanced tool distribution. They delegate with Agents, plan with Tasks, and design systems from above.",
    playstyle: "Strategic & scaling. Every 3rd turn gains an attack buff, rewarding long fights.",
    color: "text-purple-400",
    bgFrom: "from-purple-950/30",
    border: "border-purple-500",
    toolFocus: "Agent, Tasks, Plans, Skills",
    passive: {
      name: "Master Plan",
      description: "Every 3rd turn: +12 attack buff for 2 turns",
    },
    accessory: "|[##]|",

    strengths: ["agent"],
    weaknesses: ["agent"],
  },
  debugger: {
    description:
      "Debuggers thrive in chaos. A high error rate paired with strong recovery means they turn mistakes into strength.",
    playstyle: "Resilient & sustaining. Heals on every hit received, outlasting opponents in attrition.",
    color: "text-green-400",
    bgFrom: "from-green-950/30",
    border: "border-green-500",
    toolFocus: "Error recovery, iterative fixes",
    passive: {
      name: "Error Recovery",
      description: "On hit received: heal 8% HP",
    },
    accessory: "~{!!}~",

    strengths: ["debug"],
    weaknesses: ["debug"],
  },
};

const TYPE_CHART: Record<MoveType, Record<FighterClass, number>> = {
  read: { explorer: 1.0, builder: 1.5, commander: 0.75, architect: 1.0, debugger: 1.0 },
  write: { explorer: 0.75, builder: 1.0, commander: 1.5, architect: 1.0, debugger: 1.0 },
  bash: { explorer: 1.5, builder: 0.75, commander: 1.0, architect: 1.0, debugger: 1.0 },
  agent: { explorer: 1.0, builder: 1.0, commander: 1.0, architect: 1.5, debugger: 0.75 },
  debug: { explorer: 1.0, builder: 1.0, commander: 1.0, architect: 0.75, debugger: 1.5 },
};

const MOVE_DATA: Record<MoveType, { name: string; power: number; accuracy: number; effect?: string }[]> = {
  read: [
    { name: "Deep Scan", power: 60, accuracy: 95 },
    { name: "Pattern Match", power: 80, accuracy: 85 },
    { name: "Glob Storm", power: 50, accuracy: 100, effect: "DEF -10" },
    { name: "Source Dive", power: 100, accuracy: 70 },
  ],
  write: [
    { name: "Hot Patch", power: 70, accuracy: 90 },
    { name: "Refactor Storm", power: 90, accuracy: 80 },
    { name: "Code Wall", power: 40, accuracy: 100, effect: "Shield 25%" },
    { name: "Force Push", power: 110, accuracy: 65 },
  ],
  bash: [
    { name: "Shell Shock", power: 75, accuracy: 90 },
    { name: "Pipe Bomb", power: 95, accuracy: 75 },
    { name: "Kill -9", power: 120, accuracy: 60 },
    { name: "Cron Job", power: 40, accuracy: 100, effect: "DoT 15×3" },
  ],
  agent: [
    { name: "Delegate", power: 65, accuracy: 90 },
    { name: "Grand Plan", power: 50, accuracy: 100, effect: "ATK +15" },
    { name: "Task Swarm", power: 85, accuracy: 80 },
    { name: "Skill Invoke", power: 100, accuracy: 70 },
  ],
  debug: [
    { name: "Stack Trace", power: 70, accuracy: 90 },
    { name: "Breakpoint", power: 45, accuracy: 100, effect: "Heal 20%" },
    { name: "Rubber Duck", power: 55, accuracy: 95, effect: "SPD -15" },
    { name: "Hotfix", power: 90, accuracy: 75 },
  ],
};

const SIGNATURE_MOVE_DATA: Record<FighterClass, { name: string; power: number; accuracy: number; effect?: string; description: string }> = {
  explorer:  { name: "Core Dump",        power: 130, accuracy: 75, effect: "DEF -15",    description: "Exposes the opponent's entire memory. Nowhere to hide." },
  builder:   { name: "Rewrite History",   power: 130, accuracy: 75, effect: "Shield 30%", description: "Rewrites the timeline. What damage?" },
  commander: { name: "sudo rm -rf",       power: 150, accuracy: 60,                        description: "Deletes everything. No confirmation. No mercy." },
  architect: { name: "Orchestrate",       power: 120, accuracy: 80, effect: "ATK +20",    description: "Every agent fires at once. The system bends to your will." },
  debugger:  { name: "git bisect",        power: 110, accuracy: 90, effect: "DoT 20×3",   description: "Finds the exact commit that broke everything. Relentless." },
};

const CLASSES: FighterClass[] = ["explorer", "builder", "commander", "architect", "debugger"];
const MOVE_TYPES: MoveType[] = ["read", "write", "bash", "agent", "debug"];

const MULT_STYLE: Record<string, string> = {
  "1.5": "text-green-400 font-bold",
  "0.75": "text-red-400",
  "1": "text-gray-500",
};

export default function ClassesPage() {
  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-white">FIGHTER CLASSES</h1>
        <p className="text-[10px] text-gray-400">
          Your class is determined by how you use Claude Code. Each class has unique strengths, a passive ability, and type matchups.
        </p>
      </div>

      {/* Class cards */}
      <div className="space-y-6">
        {CLASSES.map((cls) => {
          const data = CLASS_DATA[cls];
          return (
            <div
              key={cls}
              className={`pixel-border rounded-lg p-6 bg-gradient-to-b ${data.bgFrom} to-[var(--bg-card)] ${data.border}`}
            >
              <div className="flex items-start gap-6">
                {/* Class icon */}
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20">
                  <pre
                    style={{
                      color: CLASS_ICON_COLORS[cls],
                      fontFamily: "'Courier New', 'Consolas', monospace",
                      fontSize: "20px",
                      lineHeight: 1.2,
                      margin: 0,
                      whiteSpace: "pre",
                      textShadow: `0 0 8px ${CLASS_ICON_COLORS[cls]}`,
                    }}
                  >
                    {data.accessory}
                  </pre>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h2 className={`text-sm font-bold ${data.color}`}>
                      {cls.toUpperCase()}
                    </h2>
                    <p className="text-[9px] text-gray-300 mt-1">
                      {data.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Playstyle */}
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase">Playstyle</p>
                      <p className="text-[9px] text-gray-300">{data.playstyle}</p>
                    </div>

                    {/* Tool focus */}
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase">Tool Focus</p>
                      <p className="text-[9px] text-gray-300">{data.toolFocus}</p>
                    </div>
                  </div>

                  {/* Passive */}
                  <div className="bg-black/20 rounded px-3 py-2">
                    <p className="text-[8px] text-gray-500 uppercase">Passive Ability</p>
                    <p className="text-[10px] text-purple-400 font-bold mt-1">
                      {data.passive.name}
                    </p>
                    <p className="text-[8px] text-gray-400">
                      {data.passive.description}
                    </p>
                  </div>

                  {/* Signature Move */}
                  <div className="bg-black/20 rounded px-3 py-2 border-l-2 border-yellow-600">
                    <p className="text-[8px] text-gray-500 uppercase">Signature Move <span className="text-yellow-500">Lv.25</span></p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-yellow-400 font-bold">
                        {SIGNATURE_MOVE_DATA[cls].name}
                      </p>
                      <span className="text-[8px] text-gray-500">
                        PWR:{SIGNATURE_MOVE_DATA[cls].power} ACC:{SIGNATURE_MOVE_DATA[cls].accuracy}
                        {SIGNATURE_MOVE_DATA[cls].effect && ` ${SIGNATURE_MOVE_DATA[cls].effect}`}
                      </span>
                    </div>
                    <p className="text-[8px] text-gray-400 italic">
                      {SIGNATURE_MOVE_DATA[cls].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Move types & catalog */}
      <div className="pixel-border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-card)]">
        <h2 className="text-sm font-bold text-white mb-1">ATTACK TYPES</h2>
        <p className="text-[8px] text-gray-500 mb-4">
          Every move belongs to one of five types. Your first move is always your class type (STAB: 1.25x bonus).
        </p>

        <div className="space-y-4">
          {MOVE_TYPES.map((type) => {
            const typeColors: Record<MoveType, string> = {
              read: "text-cyan-400",
              write: "text-yellow-400",
              bash: "text-red-400",
              agent: "text-purple-400",
              debug: "text-green-400",
            };
            const typeBorders: Record<MoveType, string> = {
              read: "border-cyan-800",
              write: "border-yellow-800",
              bash: "border-red-800",
              agent: "border-purple-800",
              debug: "border-green-800",
            };
            const stabClass: Record<MoveType, string> = {
              read: "EXPLORER",
              write: "BUILDER",
              bash: "COMMANDER",
              agent: "ARCHITECT",
              debug: "DEBUGGER",
            };
            const typeDesc: Record<MoveType, string> = {
              read: "Information gathering attacks. Scan, search, and analyze to find weak points.",
              write: "Code manipulation attacks. Edit, overwrite, and rewrite to deal damage.",
              bash: "Terminal execution attacks. Shell commands that hit fast and hard.",
              agent: "Delegation attacks. Summon sub-agents and orchestrate complex strikes.",
              debug: "Error exploitation attacks. Trace, catch, and fix — turning bugs into weapons.",
            };

            return (
              <div key={type} className={`border-l-2 ${typeBorders[type]} pl-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold ${typeColors[type]}`}>
                    {type.toUpperCase()}
                  </span>
                  <span className="text-[8px] text-gray-600">
                    STAB for {stabClass[type]}
                  </span>
                </div>
                <p className="text-[8px] text-gray-400 mb-2">{typeDesc[type]}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {MOVE_DATA[type].map((move) => (
                    <div
                      key={move.name}
                      className="bg-black/20 rounded px-2 py-1 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[9px] text-white font-bold">{move.name}</span>
                        {move.effect && (
                          <span className="text-[7px] text-purple-400 ml-1">{move.effect}</span>
                        )}
                      </div>
                      <span className="text-[8px] text-gray-500">
                        PWR:{move.power} ACC:{move.accuracy}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Type effectiveness chart */}
      <div className="pixel-border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-card)]">
        <h2 className="text-sm font-bold text-white mb-1">TYPE EFFECTIVENESS</h2>
        <p className="text-[8px] text-gray-500 mb-4">
          Move type vs. defender class. <span className="text-green-400">1.5x</span> = super effective, <span className="text-red-400">0.75x</span> = resisted.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead>
              <tr>
                <th className="text-left text-gray-500 pb-2 pr-4">ATK \ DEF</th>
                {CLASSES.map((cls) => (
                  <th
                    key={cls}
                    className={`pb-2 px-2 text-center ${CLASS_DATA[cls].color}`}
                  >
                    {cls.toUpperCase().slice(0, 4)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOVE_TYPES.map((type) => (
                <tr key={type} className="border-t border-[var(--border-subtle)]">
                  <td className="py-2 pr-4 text-gray-300 font-bold">
                    {type.toUpperCase()}
                  </td>
                  {CLASSES.map((cls) => {
                    const mult = TYPE_CHART[type][cls];
                    const style = MULT_STYLE[String(mult)] ?? "text-gray-500";
                    return (
                      <td key={cls} className={`py-2 px-2 text-center ${style}`}>
                        {mult}x
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How class is determined */}
      <div className="pixel-border border-[var(--border-subtle)] rounded-lg p-6 bg-[var(--bg-card)]">
        <h2 className="text-sm font-bold text-white mb-2">HOW IS YOUR CLASS DETERMINED?</h2>
        <div className="space-y-2 text-[9px] text-gray-300">
          <p>
            Your class is computed from your Claude Code tool usage distribution in <span className="text-gray-100">~/.claude/</span> session data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <div className="bg-black/20 rounded px-3 py-2">
              <span className="text-cyan-400 font-bold">EXPLORER</span>
              <span className="text-gray-400"> &mdash; Heavy Read/Grep/Glob usage</span>
            </div>
            <div className="bg-black/20 rounded px-3 py-2">
              <span className="text-yellow-400 font-bold">BUILDER</span>
              <span className="text-gray-400"> &mdash; Heavy Write/Edit usage</span>
            </div>
            <div className="bg-black/20 rounded px-3 py-2">
              <span className="text-red-400 font-bold">COMMANDER</span>
              <span className="text-gray-400"> &mdash; Heavy Bash/Agent usage</span>
            </div>
            <div className="bg-black/20 rounded px-3 py-2">
              <span className="text-purple-400 font-bold">ARCHITECT</span>
              <span className="text-gray-400"> &mdash; Balanced tool distribution</span>
            </div>
            <div className="bg-black/20 rounded px-3 py-2 md:col-span-2">
              <span className="text-green-400 font-bold">DEBUGGER</span>
              <span className="text-gray-400"> &mdash; High error rate + recovery patterns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
