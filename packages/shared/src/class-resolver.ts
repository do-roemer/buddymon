import type { FighterClass, MoveType, RawAggregate } from "./types.js";
import { getToolGroup } from "./constants.js";

export interface ToolGroupDistribution {
  read: number;
  write: number;
  bash: number;
  agent: number;
  debug: number;
}

export function computeToolGroupDistribution(
  toolTotals: Record<string, number>,
): ToolGroupDistribution {
  const dist: ToolGroupDistribution = {
    read: 0,
    write: 0,
    bash: 0,
    agent: 0,
    debug: 0,
  };

  for (const [tool, count] of Object.entries(toolTotals)) {
    const group = getToolGroup(tool);
    dist[group] += count;
  }

  return dist;
}

export function resolveClass(aggregate: RawAggregate): FighterClass {
  const { totalToolCalls, totalToolErrors, outcomeScores } = aggregate;

  // Check for Debugger override: high error rate + good recovery
  if (totalToolCalls > 0) {
    const errorRate = totalToolErrors / totalToolCalls;
    const avgOutcome =
      outcomeScores.length > 0
        ? outcomeScores.reduce((a, b) => a + b, 0) / outcomeScores.length
        : 0;
    if (errorRate > 0.1 && avgOutcome >= 2.0) {
      return "debugger";
    }
  }

  // Standard classification by dominant tool group
  const dist = computeToolGroupDistribution(aggregate.toolTotals);

  const groups: [MoveType, number][] = [
    ["read", dist.read],
    ["write", dist.write],
    ["bash", dist.bash],
    ["agent", dist.agent],
  ];

  groups.sort((a, b) => b[1] - a[1]);
  const dominant = groups[0][0];

  const classMap: Record<string, FighterClass> = {
    read: "explorer",
    write: "builder",
    bash: "commander",
    agent: "architect",
  };

  return classMap[dominant] ?? "explorer";
}
