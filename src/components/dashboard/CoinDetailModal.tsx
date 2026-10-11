"use client";

import React from "react";
import { Coin } from "@/types/crypto";
import { formatUSD, formatPercent, formatTokenAmount } from "@/lib/utils";
import { SparklineChart } from "./SparklineChart";
import { 
  X, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Flame, 
  Compass, 
  Coins,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  Zap
} from "lucide-react";

interface CoinDetailModalProps {
  coin: Coin | null;
  onClose: () => void;
}

export function CoinDetailModal({ coin, onClose }: CoinDetailModalProps) {
  if (!coin) return null;

  const isUp = coin.price_change_percentage_24h >= 0;
  const low = coin.low_24h || coin.current_price * 0.96;
  const high = coin.high_24h || coin.current_price * 1.04;
  const range = high - low;
  const pricePosPercent = range > 0 ? Math.min(100, Math.max(0, ((coin.current_price - low) / range) * 100)) : 50;

  const rec = coin.spot_recommendation;
  const isBuy = rec?.status === "STRONG_BUY" || rec?.status === "ACCUMULATE";
  const isAvoid = rec?.status === "AVOID_OVERBOUGHT" || rec?.status === "AVOID_DUMP_RISK";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0c1017] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header bar */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500" />

        {/* Modal Top */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-12 h-12 rounded-full ring-2 ring-cyan-500/30 p-1 bg-slate-900"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {coin.name}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {coin.symbol.toUpperCase()}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                  #{coin.market_cap_rank}
                </span>
                {coin.symbol.toLowerCase() === "near" && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500 text-black font-black uppercase">
                    NEAR ECOSYSTEM
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Phân loại: <span className="text-slate-200">{coin.category}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Price Overview */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-mono text-slate-400">GIÁ HIỆN TẠI (USD)</div>
              <div className="text-3xl font-black font-mono text-white mt-1">
                {formatUSD(coin.current_price)}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-right">
                <div className="text-xs font-mono text-slate-400">BIẾN ĐỘNG 24H</div>
                <div
                  className={`flex items-center justify-end text-base font-black font-mono mt-1 ${
                    isUp ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {formatPercent(coin.price_change_percentage_24h)}
                </div>
              </div>

              {coin.price_change_percentage_7d_in_currency !== undefined && (
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">BIẾN ĐỘNG 7D</div>
                  <div
                    className={`text-base font-black font-mono mt-1 ${
                      coin.price_change_percentage_7d_in_currency >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {formatPercent(coin.price_change_percentage_7d_in_currency)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI SPOT RECOMMENDATION CARD */}
          {rec && (
            <div
              className={`p-4 rounded-xl border font-mono text-xs ${
                isBuy
                  ? "bg-emerald-950/25 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(0,255,157,0.1)]"
                  : isAvoid
                  ? "bg-rose-950/25 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(255,51,102,0.1)]"
                  : "bg-slate-900/60 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isBuy ? "text-emerald-400" : isAvoid ? "text-rose-400" : "text-cyan-400"}`} />
                  <span className="font-black text-sm text-white">
                    AI SPOT RECOMMENDATION
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      isBuy
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : isAvoid
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    {rec.badgeLabel}
                  </span>
                  <span className="font-bold text-white">
                    {rec.confidenceScore}% Độ tin cậy
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-[11px]">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">CHỈ SỐ RSI (14):</span>
                  <div className="font-bold text-white text-xs mt-0.5">
                    {coin.rsi_14 ? coin.rsi_14.toFixed(1) : "50.0"}
                  </div>
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">NET CEX FLOW:</span>
                  <div className={`font-bold text-xs mt-0.5 ${coin.whale_net_inflow_usd && coin.whale_net_inflow_usd < 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {coin.whale_net_inflow_usd && coin.whale_net_inflow_usd < 0
                      ? `Rút ví -$${(Math.abs(coin.whale_net_inflow_usd) / 1e6).toFixed(1)}M`
                      : `Nạp sàn +$${((coin.whale_net_inflow_usd || 0) / 1e6).toFixed(1)}M`}
                  </div>
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">TARGET NGẮN HẠN:</span>
                  <div className="font-bold text-cyan-300 text-xs mt-0.5">
                    {rec.targetPriceShortTerm ? formatUSD(rec.targetPriceShortTerm) : "N/A"}
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed pt-1">
                <strong>Phân tích Quant:</strong> {rec.reason}
              </p>
            </div>
          )}

          {/* 24h Low / High Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Đáy 24h: <strong className="text-white">{formatUSD(low)}</strong></span>
              <span>Đỉnh 24h: <strong className="text-white">{formatUSD(high)}</strong></span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400"
                style={{ width: `${pricePosPercent}%` }}
              />
            </div>
          </div>

          {/* Sparkline 7 Days */}
          {coin.sparkline_in_7d?.price && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  XU HƯỚNG 7 NGÀY QUA
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Sparkline Realtime
                </span>
              </div>
              <div className="w-full flex justify-center py-2">
                <SparklineChart
                  data={coin.sparkline_in_7d.price}
                  width={480}
                  height={80}
                  isPositive={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0}
                />
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">VỐN HÓA THỊ TRƯỜNG</div>
              <div className="text-slate-200 font-bold mt-1">
                {formatUSD(coin.market_cap, true)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">VOLUME GIAO DỊCH 24H</div>
              <div className="text-slate-200 font-bold mt-1">
                {formatUSD(coin.total_volume, true)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">ĐIỂM CÁ MẬP (0-100)</div>
              <div className="text-cyan-400 font-black mt-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 animate-spin" />
                {coin.whale_activity_score || 85} / 100
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">CUNG LƯU HÀNH</div>
              <div className="text-slate-200 font-bold mt-1">
                {coin.circulating_supply
                  ? formatTokenAmount(coin.circulating_supply, coin.symbol)
                  : "N/A"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">ĐỈNH MỌI THỜI ĐẠI (ATH)</div>
              <div className="text-slate-200 font-bold mt-1">
                {coin.ath ? formatUSD(coin.ath) : "N/A"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
              <div className="text-slate-400 text-[11px]">CÁCH ĐỈNH ATH</div>
              <div className="text-rose-400 font-bold mt-1">
                {coin.ath_change_percentage ? `${coin.ath_change_percentage.toFixed(1)}%` : "N/A"}
              </div>
            </div>
          </div>

          {/* Direct Explorer / External links */}
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={`https://www.coingecko.com/en/coins/${coin.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>Xem trên CoinGecko</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={`https://www.binance.com/en/trade/${coin.symbol.toUpperCase()}_USDT`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-950/40 hover:bg-yellow-900/40 border border-yellow-700/50 text-xs font-mono text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              <span>Giao dịch trên Binance</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {coin.symbol.toLowerCase() === "near" && (
              <a
                href="https://nearblocks.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/50 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <span>NearBlocks Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
