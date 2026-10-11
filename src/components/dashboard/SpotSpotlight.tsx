"use client";

import React, { useMemo } from "react";
import { Coin, RealtimePriceUpdate } from "@/types/crypto";
import { formatUSD, formatPercent } from "@/lib/utils";
import { LivePriceCell } from "./LivePriceCell";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  Target, 
  Zap,
  Flame,
  ArrowUpRight
} from "lucide-react";

interface SpotSpotlightProps {
  coins: Coin[];
  livePrices?: Record<string, RealtimePriceUpdate>;
  onSelectCoin: (coin: Coin) => void;
}

export function SpotSpotlight({ coins, livePrices = {}, onSelectCoin }: SpotSpotlightProps) {
  // Lọc Top Spot Buys (Spot Score cao nhất >= 75)
  const topBuys = useMemo(() => {
    return [...coins]
      .filter((c) => {
        const score = c.spotAnalysis?.spotScore ?? 50;
        return score >= 75;
      })
      .sort((a, b) => (b.spotAnalysis?.spotScore ?? 0) - (a.spotAnalysis?.spotScore ?? 0))
      .slice(0, 3);
  }, [coins]);

  // Lọc Top Avoid / High Risk (Spot Score <= 40 hoặc rủi ro xả)
  const topAvoids = useMemo(() => {
    return [...coins]
      .filter((c) => {
        const score = c.spotAnalysis?.spotScore ?? 50;
        const type = c.spotAnalysis?.recommendationType;
        return score <= 42 || type === "AVOID_DUMP_RISK" || type === "AVOID_OVERBOUGHT";
      })
      .sort((a, b) => (a.spotAnalysis?.spotScore ?? 0) - (b.spotAnalysis?.spotScore ?? 0))
      .slice(0, 3);
  }, [coins]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono">
      
      {/* CỘT TRÁI: TOP SPOT BUYS TODAY */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091211]/90 border border-emerald-500/35 shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                TOP SPOT BUYS TODAY
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  XÁC SUẤT CAO
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cá mập rút ví lạnh + RSI 40-58 tích lũy vững chắc
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400/90 font-bold hidden sm:inline-block">
            ● Realtime Spot Engine
          </span>
        </div>

        {/* Danh sách Top Buys */}
        <div className="space-y-3">
          {topBuys.map((coin) => {
            const sym = coin.symbol.toLowerCase();
            const liveTick = livePrices[sym];
            const currentPrice = liveTick?.price ?? coin.current_price;
            const direction = liveTick?.direction ?? "same";
            const analysis = coin.spotAnalysis;
            const isNear = sym === "near";

            return (
              <div
                key={coin.id}
                onClick={() => onSelectCoin(coin)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isNear
                    ? "bg-[#0b1b17] border-emerald-400/60 shadow-[0_0_15px_rgba(0,255,157,0.15)] hover:border-emerald-300"
                    : "bg-[#0c1613]/85 border-emerald-900/40 hover:border-emerald-500/50 hover:bg-[#0e1c18]"
                }`}
              >
                {isNear && (
                  <div className="absolute -top-2 right-3 px-2 py-0.2 rounded-full bg-cyan-500 text-black text-[9px] font-black uppercase tracking-wider">
                    ★ NEAR ECOSYSTEM TOP PICK
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  {/* Coin Info */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full p-0.5 bg-slate-900 border border-emerald-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs hover:text-emerald-300 transition-colors">
                          {coin.name}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-bold">
                          {coin.symbol.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Price with Flash effect */}
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <LivePriceCell price={currentPrice} direction={direction} />
                        <span
                          className={`text-[10px] font-bold ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          ({formatPercent(coin.price_change_percentage_24h)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Spot Score & Target */}
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{analysis?.spotScore ?? 90}/100 Score</span>
                    </div>
                    {analysis?.tradingPlan?.takeProfit1 && (
                      <div className="text-[10px] text-cyan-300 font-semibold mt-0.5 flex items-center justify-end gap-0.5">
                        <Target className="w-2.5 h-2.5" />
                        <span>Target: {formatUSD(analysis.tradingPlan.takeProfit1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reason Rationale */}
                <div className="mt-2 pt-2 border-t border-emerald-900/30 text-[11px] text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold shrink-0">Lý do:</span>
                  <span className="truncate sm:whitespace-normal">{coin.spot_recommendation?.reason || analysis?.summary}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CỘT PHẢI: AVOID / HIGH RISK TODAY */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#140a0e]/90 border border-rose-500/35 shadow-[0_0_30px_rgba(255,51,102,0.1)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                AVOID / HIGH RISK TODAY
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  CẢNH BÁO NÉ
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cá mập nạp sàn CEX xả hàng hoặc RSI &gt; 72 dính FOMO
              </p>
            </div>
          </div>
          <span className="text-[10px] text-rose-400/90 font-bold hidden sm:inline-block">
            ● High Dump Risk
          </span>
        </div>

        {/* Danh sách Top Avoids */}
        <div className="space-y-3">
          {topAvoids.map((coin) => {
            const sym = coin.symbol.toLowerCase();
            const liveTick = livePrices[sym];
            const currentPrice = liveTick?.price ?? coin.current_price;
            const direction = liveTick?.direction ?? "same";
            const analysis = coin.spotAnalysis;

            return (
              <div
                key={coin.id}
                onClick={() => onSelectCoin(coin)}
                className="p-3.5 rounded-xl bg-[#160c12]/85 border border-rose-900/40 hover:border-rose-500/50 hover:bg-[#1a0e16] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Coin Info */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full p-0.5 bg-slate-900 border border-rose-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs hover:text-rose-300 transition-colors">
                          {coin.name}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 font-bold">
                          {coin.symbol.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <LivePriceCell price={currentPrice} direction={direction} />
                        <span
                          className={`text-[10px] font-bold ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          ({formatPercent(coin.price_change_percentage_24h)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Warning */}
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-rose-400 font-bold flex items-center justify-end gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>{analysis?.spotScore ?? 25}/100 Score</span>
                    </div>
                    {coin.rsi_14 && (
                      <div className="text-[10px] text-amber-300 font-semibold mt-0.5">
                        RSI(14): {coin.rsi_14.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reason Rationale */}
                <div className="mt-2 pt-2 border-t border-rose-900/30 text-[11px] text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold shrink-0">Cảnh báo:</span>
                  <span className="truncate sm:whitespace-normal">{coin.spot_recommendation?.reason || analysis?.summary}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
