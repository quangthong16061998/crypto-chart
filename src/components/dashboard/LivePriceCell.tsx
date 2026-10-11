"use client";

import React from "react";
import { formatUSD } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LivePriceCellProps {
  price: number;
  direction?: "up" | "down" | "same";
  className?: string;
  showIcon?: boolean;
}

export function LivePriceCell({
  price,
  direction = "same",
  className = "",
  showIcon = false,
}: LivePriceCellProps) {
  const isUp = direction === "up";
  const isDown = direction === "down";

  return (
    <div
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition-all duration-300 font-mono font-bold ${
        isUp
          ? "bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/60 shadow-[0_0_12px_rgba(0,255,157,0.35)] scale-105"
          : isDown
          ? "bg-rose-500/25 text-rose-300 ring-1 ring-rose-400/60 shadow-[0_0_12px_rgba(255,51,102,0.35)] scale-105"
          : "text-white"
      } ${className}`}
    >
      {showIcon && isUp && <TrendingUp className="w-3 h-3 text-emerald-400 animate-bounce" />}
      {showIcon && isDown && <TrendingDown className="w-3 h-3 text-rose-400 animate-bounce" />}
      <span>{formatUSD(price)}</span>
    </div>
  );
}
