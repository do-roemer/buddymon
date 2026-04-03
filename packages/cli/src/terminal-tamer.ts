import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const CONFIG_DIR = path.join(os.homedir(), ".config", "buddymon");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

interface BuddymonConfig {
  terminalTamer?: string;
  customSprite?: string[];
  bodyType?: string;
}

function readConfig(): BuddymonConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeConfig(config: BuddymonConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function getCustomSprite(): string[] | undefined {
  return readConfig().customSprite;
}

export function saveCustomSprite(sprite: string[]): void {
  const config = readConfig();
  config.customSprite = sprite;
  writeConfig(config);
}

export function getBodyType(): string | undefined {
  return readConfig().bodyType;
}

export function saveBodyType(bodyType: string): void {
  const config = readConfig();
  config.bodyType = bodyType;
  writeConfig(config);
}

export function getTerminalTamer(override?: string): string {
  if (override) {
    const config = readConfig();
    config.terminalTamer = override;
    writeConfig(config);
    return override;
  }

  const config = readConfig();
  if (config.terminalTamer) return config.terminalTamer;

  console.error("  Error: No Terminal Tamer name set.");
  console.error("  Run with --tamer \"Your Name\" to set it.");
  process.exit(1);
}
