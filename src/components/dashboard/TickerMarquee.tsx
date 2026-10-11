"use client";

import React from "react";
import { Coin, MarketOverview, RealtimePriceUpdate } from "@/types/crypto";
import { formatUSD, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Flame, Waves } from "lucide-react";

interface TickerMarqueeProps {
  coins: Coin[];
  livePrices?: Record<string, RealtimePriceUpdate>;
  overview: MarketOverview | null;
  onSelectCoin: (coin: Coin) => void;
}

export function TickerMarquee({ coins, livePrices = {}, overview, onSelectCoin }: TickerMarqueeProps) {
  const topCoins = coins.slice(0, 10);
  // Nhân đôi danh sách để tạo hiệu ứng chạy vô tận liền mạch (infinite loop)
  const marqueeItems = [...topCoins, ...topCoins];

  return (
    <div className="w-full bg-[#090d14] border-b border-slate-800/60 overflow-hidden select-none py-1.5 font-mono">
      <div className="flex items-center">
        
        {/* Fixed Tag bên trái */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border-r border-slate-800 text-[11px] text-cyan-400 shrink-0 z-10 shadow-lg">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>RADAR TICKER:</span>
        </div>

        {/* Khung cuộn Marquee */}
        <div className="overflow-hidden whitespace-nowrap w-full relative">
          <div className="animate-marquee flex items-center gap-6">
            
            {/* Fear & Greed Indicator */}
            {overview && (
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs shrink-0">
                <span className="text-slate-400 text-[10px]">TÂM LÝ:</span>
                <span className="font-bold text-amber-400">
                  {overview.fear_greed.value}
                </span>
                <span className="text-[10px] text-amber-300/80 uppercase">
                  ({overview.fear_greed.value_classification})
                </span>
              </div>
            )}

            {/* CEX Net Flow */}
            {overview && (
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs shrink-0">
                <Waves className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-400 text-[10px]">NET CEX FLOW:</span>
                <span className={`font-bold ${overview.cex_net_inflow_24h < 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {overview.cex_net_inflow_24h < 0 ? "GOM RÒNG -$340M" : "XẢ SÀN +$210M"}
                </span>
              </div>
            )}

            {/* Danh sách Coin lướt ngang */}
            {marqueeItems.map((coin, index) => {
              const sym = coin.symbol.toLowerCase();
              const liveTick = livePrices[sym];
              const currentPrice = liveTick?.price ?? coin.current_price;
              const change24h = liveTick?.change24h ?? coin.price_change_percentage_24h;
              const isUp = change24h >= 0;
              const isTickUp = liveTick?.direction === "up";
              const isTickDown = liveTick?.direction === "down";

              return (
                <button
                  key={`${coin.id}-${index}`}
                  onClick={() => onSelectCoin(coin)}
                  className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-transparent hover:border-slate-700 transition-colors text-xs shrink-0 text-left ${
                    isTickUp
                      ? "bg-emerald-500/20 text-emerald-300"
                      : isTickDown
                      ? "bg-rose-500/20 text-rose-300"
                      : "hover:bg-slate-800/80"
                  }`}
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-3.5 h-3.5 rounded-full object-contain"
                  />
                  <span className="font-bold text-slate-200">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-slate-200 font-bold">
                    {formatUSD(currentPrice)}
                  </span>
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold ${
                      isUp ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                    )}
                    {formatPercent(change24h)}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
}
