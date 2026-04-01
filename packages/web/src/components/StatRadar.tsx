"use client";

import type { FighterStats, FighterClass } from "@buddymon/shared";

const CLASS_COLORS: Record<FighterClass, string> = {
  explorer: "#06b6d4",
  builder: "#eab308",
  commander: "#ef4444",
  architect: "#a855f7",
  debugger: "#22c55e",
};

interface Props {
  stats: FighterStats;
  fighterClass: FighterClass;
  size?: number;
}

export function StatRadar({ stats, fighterClass, size = 200 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.4;
  const color = CLASS_COLORS[fighterClass];

  const axes = [
    { label: "HP", value: stats.hp / 300 },
    { label: "ATK", value: stats.attack / 100 },
    { label: "DEF", value: stats.defense / 100 },
    { label: "SPD", value: stats.speed / 100 },
    { label: "CRT", value: stats.critChance / 30 },
  ];

  const angleStep = (2 * Math.PI) / axes.length;
  const startAngle = -Math.PI / 2; // Start from top

  function getPoint(index: number, scale: number): [number, number] {
    const angle = startAngle + index * angleStep;
    return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale];
  }

  // Background rings
  const rings = [0.25, 0.5, 0.75, 1.0];
  const ringPaths = rings.map((scale) => {
    const points = axes.map((_, i) => getPoint(i, scale));
    return points.map((p) => `${p[0]},${p[1]}`).join(" ");
  });

  // Value polygon
  const valuePoints = axes.map((axis, i) => getPoint(i, axis.value));
  const valuePath = valuePoints.map((p) => `${p[0]},${p[1]}`).join(" ");

  // Axis lines
  const axisLines = axes.map((_, i) => ({
    x1: cx,
    y1: cy,
    x2: getPoint(i, 1)[0],
    y2: getPoint(i, 1)[1],
  }));

  // Labels
  const labels = axes.map((axis, i) => {
    const [x, y] = getPoint(i, 1.25);
    return { ...axis, x, y };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background rings */}
      {ringPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#2a2a4a"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          {...line}
          stroke="#2a2a4a"
          strokeWidth="1"
        />
      ))}

      {/* Value polygon */}
      <polygon
        points={valuePath}
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="2"
      />

      {/* Value points */}
      {valuePoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}

      {/* Labels */}
      {labels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#888"
          fontSize="10"
          fontFamily="'Press Start 2P', monospace"
        >
          {label.label}
        </text>
      ))}
    </svg>
  );
}
