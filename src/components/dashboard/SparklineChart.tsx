"use client";

import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
}

/**
 * Component vẽ biểu đồ Sparkline SVG nhẹ, tối ưu render không gây lag
 */
export function SparklineChart({
  data,
  width = 120,
  height = 36,
  isPositive = true,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-[10px] text-slate-600"
        style={{ width, height }}
      >
        --
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const padding = 2;
  const usableHeight = height - padding * 2;
  const usableWidth = width - padding * 2;

  // Tính toán tọa độ các điểm SVG
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const strokeColor = isPositive ? "#00ff9d" : "#ff3366";
  const fillColor = isPositive ? "rgba(0, 255, 157, 0.15)" : "rgba(255, 51, 102, 0.15)";
  const gradientId = `sparkline-grad-${Math.random().toString(36).substring(2, 9)}`;

  // Area fill path
  const firstX = padding;
  const lastX = padding + usableWidth;
  const areaD = `${pathD} L ${lastX},${height} L ${firstX},${height} Z`;

  return (
    <div className="relative inline-block" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
