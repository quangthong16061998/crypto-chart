"use client";

import React, { useMemo } from "react";
import { Coin, WhaleTransaction } from "@/types/crypto";
import { formatUSD, formatPercent, formatTimeAgo, shortenAddress } from "@/lib/utils";
import { LivePriceCell } from "./LivePriceCell";
import { calculateSpotMetric } from "@/lib/spotEngine";
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Target, 
  ArrowRight, 
  Waves, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  Layers,
  Flame,
  ShieldCheck
} from "lucide-react";

interface CoinDetailDialogProps {
  coin: Coin | null;
  livePrice?: number;
  liveDirection?: "up" | "down" | "same";
  transactions?: WhaleTransaction[];
  onClose: () => void;
}

export function CoinDetailDialog({
  coin,
  livePrice,
  liveDirection = "same",
  transactions = [],
  onClose,
}: CoinDetailDialogProps) {
  if (!coin) return null;

  const currentLivePrice = livePrice ?? coin.current_price;
  
  // Tính toán chỉ số phân tích chuyên sâu
  const analysis = useMemo(() => {
    return coin.spotAnalysis ?? calculateSpotMetric(coin, currentLivePrice);
  }, [coin, currentLivePrice]);

  const isBuy = analysis.recommendationType === "STRONG_BUY" || analysis.recommendationType === "ACCUMULATE";
  const isAvoid = analysis.recommendationType === "AVOID_OVERBOUGHT" || analysis.recommendationType === "AVOID_DUMP_RISK";

  // Lọc các giao dịch cá mập của riêng đồng coin này
  const coinTxs = useMemo(() => {
    return transactions.filter(
      (tx) => tx.symbol.toLowerCase() === coin.symbol.toLowerCase()
    ).slice(0, 3);
  }, [transactions, coin.symbol]);

  const sumFlow = analysis.whaleFlow24h.inflowUSD + analysis.whaleFlow24h.outflowUSD;
  const outflowPercent = sumFlow > 0 ? Math.round((analysis.whaleFlow24h.outflowUSD / sumFlow) * 100) : 60;
  const inflowPercent = 100 - outflowPercent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0a0e16] border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header bar */}
        <div
          className={`h-1.5 ${
            isBuy
              ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
              : isAvoid
              ? "bg-gradient-to-r from-rose-500 via-red-500 to-amber-500"
              : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
          }`}
        />

        {/* Modal Top */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-12 h-12 rounded-full ring-2 ring-cyan-500/30 p-1 bg-slate-900 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  {coin.name}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {coin.symbol.toUpperCase()}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                  #{coin.market_cap_rank}
                </span>
                {coin.symbol.toLowerCase() === "near" && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500 text-black font-black uppercase">
                    NEAR ECOSYSTEM
                  </span>
                )}
              </div>

              {/* Price & Badge */}
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <div className="text-lg font-black text-white">
                  <LivePriceCell price={currentLivePrice} direction={liveDirection} showIcon />
                </div>
                <div
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-black border flex items-center gap-1.5 ${
                    isBuy
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(0,255,157,0.2)]"
                      : isAvoid
                      ? "bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(255,51,102,0.2)]"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analysis.badgeLabel}</span>
                  <span>({analysis.spotScore}/100)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
          
          {/* 1. WHALE FLOW TRACKER (24H) */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                DÒNG TIỀN CÁ MẬP 24H (WHALE FLOW TRACKER)
              </span>
              <span className="text-[11px] text-slate-400">
                {analysis.whaleFlow24h.largeTxCount} Giao dịch lớn (&gt;$100K)
              </span>
            </div>

            {/* Inflow vs Outflow Dual Progress */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-semibold">
                <span className="text-emerald-400">
                  Rút ví lạnh (Outflow): {outflowPercent}% (${(analysis.whaleFlow24h.outflowUSD / 1e6).toFixed(1)}M)
                </span>
                <span className="text-rose-400">
                  Nạp sàn xả (Inflow): {inflowPercent}% (${(analysis.whaleFlow24h.inflowUSD / 1e6).toFixed(1)}M)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${outflowPercent}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-red-600"
                  style={{ width: `${inflowPercent}%` }}
                />
              </div>
            </div>

            {/* Giao dịch gần nhất của token này */}
            {coinTxs.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Giao dịch cá mập gần đây:</div>
                {coinTxs.map((tx) => (
                  <div key={tx.id} className="p-2 rounded bg-black/40 border border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      {tx.from_owner} ➔ {tx.to_owner}
                    </span>
                    <span className="font-bold text-cyan-400">
                      {formatUSD(tx.amount_usd)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. AUDIT CHECKLIST (TẠI SAO NÊN / KHÔNG NÊN MUA) */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              CHECKLIST TIÊU CHÍ QUYẾT ĐỊNH (AUDIT MATRIX)
            </h3>

            <div className="space-y-2">
              {analysis.checklist.map((item, idx) => {
                const isPass = item.status === "pass";
                const isFail = item.status === "fail";

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                      isPass
                        ? "bg-emerald-950/15 border-emerald-500/30 text-emerald-300"
                        : isFail
                        ? "bg-rose-950/15 border-rose-500/30 text-rose-300"
                        : "bg-slate-900/40 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {isFail && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {!isPass && !isFail && <Compass className="w-4 h-4 text-cyan-400" />}
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-white text-[11px] mb-0.5">
                        {item.label}
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. KẾ HOẠCH GIAO DỊCH (TRADING ACTION PLAN) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/80 to-purple-950/30 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                KHUYẾN NGHỊ HÀNH ĐỘNG CHI TIẾT (TRADING PLAN)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-bold">
                Tỷ lệ R:R: {analysis.tradingPlan.riskRewardRatio}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Vùng Mua Dự Kiến</div>
                <div className="text-xs font-black text-white mt-1">
                  {analysis.tradingPlan.entryZone}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
                <div className="text-[10px] text-rose-400 uppercase">Cắt Lỗ (Stop-Loss)</div>
                <div className="text-xs font-black text-rose-400 mt-1">
                  {formatUSD(analysis.tradingPlan.stopLoss)} (-7%)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400 uppercase">Target 1 (+12%)</div>
                <div className="text-xs font-black text-emerald-400 mt-1">
                  {formatUSD(analysis.tradingPlan.takeProfit1)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                <div className="text-[10px] text-cyan-400 uppercase">Target 2 (+25%)</div>
                <div className="text-xs font-black text-cyan-300 mt-1">
                  {formatUSD(analysis.tradingPlan.takeProfit2)}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              <strong>Tóm tắt nhận định:</strong> {analysis.summary}
            </p>
          </div>

          {/* 4. DIRECT LINKS */}
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={`https://www.binance.com/en/trade/${coin.symbol.toUpperCase()}_USDT`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[160px] py-2 px-3 rounded-xl bg-yellow-950/40 hover:bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 font-bold flex items-center justify-center gap-1.5 transition-all text-xs"
            >
              <span>Giao dịch trên Binance</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://www.coingecko.com/en/coins/${coin.id}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center gap-1.5 transition-all text-xs"
            >
              <span>CoinGecko</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
