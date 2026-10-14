"use client";

import React from "react";
import { MarketOverview } from "@/types/crypto";
import { formatUSD, formatPercent } from "@/lib/utils";
import { 
  BarChart3, 
  ArrowDownRight, 
  ArrowUpRight, 
  Waves, 
  AlertTriangle, 
  Compass, 
  ShieldAlert,
  Coins
} from "lucide-react";

interface HeroMetricsProps {
  overview: MarketOverview | null;
}

function HeroMetricsComponent({ overview }: HeroMetricsProps) {
  if (!overview) return null;

  const totalInflow = overview.cex_total_inflow_24h || 1840000000;
  const totalOutflow = overview.cex_total_outflow_24h || 2180000000;
  const sumFlow = totalInflow + totalOutflow;
  const outflowRatio = Math.round((totalOutflow / sumFlow) * 100);
  const inflowRatio = 100 - outflowRatio;
  const isNetAccumulation = overview.cex_net_inflow_24h <= 0; // Rút nhiều hơn nạp

  // Màu sắc theo thang điểm Fear & Greed
  const getFngColor = (val: number) => {
    if (val >= 75) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (val >= 55) return "text-cyan-400 border-cyan-500/40 bg-cyan-500/10";
    if (val >= 45) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: Vốn Hóa & Khối Lượng 24H */}
      <div className="cyber-card rounded-xl p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            VỐN HÓA & KHỐI LƯỢNG
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            BTC DOM: {overview.btc_dominance}%
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
            {formatUSD(overview.total_market_cap_usd, true)}
          </div>
          <div
            className={`flex items-center text-xs font-mono font-bold ${
              overview.market_cap_change_percentage_24h_usd >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {overview.market_cap_change_percentage_24h_usd >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {formatPercent(overview.market_cap_change_percentage_24h_usd)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className="text-slate-400">Volume 24h:</span>
          <span className="text-slate-200 font-semibold">
            {formatUSD(overview.total_volume_24h_usd, true)}
          </span>
        </div>
      </div>

      {/* CARD 2: DÒNG TIỀN SÀN CEX (NET FLOW) */}
      <div className="cyber-card rounded-xl p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span className="flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-emerald-400" />
            DÒNG TIỀN CEX (24H)
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold ${
              isNetAccumulation
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {isNetAccumulation ? "GOM RÒNG" : "XẢ RÒNG"}
          </span>
        </div>

        <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white mb-2">
          {isNetAccumulation ? "-" : "+"}
          {formatUSD(Math.abs(overview.cex_net_inflow_24h), true)}
        </div>

        {/* Thanh tỷ lệ Rút ví (Gom) vs Nạp sàn (Xả) */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="text-emerald-400">Rút ví (Outflow): {outflowRatio}%</span>
            <span className="text-rose-400">Nạp sàn (Inflow): {inflowRatio}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${outflowRatio}%` }}
              title={`Rút ví: ${formatUSD(totalOutflow, true)}`}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-red-600"
              style={{ width: `${inflowRatio}%` }}
              title={`Nạp sàn: ${formatUSD(totalInflow, true)}`}
            />
          </div>
        </div>
      </div>

      {/* CARD 3: RADAR CÁ MẬP (WHALE ACTIVITY) */}
      <div className="cyber-card rounded-xl p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            HOẠT ĐỘNG CÁ MẬP
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-mono">
            &gt;$500K / TX
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
            {overview.whale_tx_count_24h.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">TXs</span>
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400">
            {formatUSD(overview.total_whale_volume_24h, true)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className="text-slate-400">TX lớn nhất:</span>
          <span className="text-amber-300 font-semibold font-mono">
            $150.0M (USDT)
          </span>
        </div>
      </div>

      {/* CARD 4: TÍN HIỆU CẢNH BÁO & FEAR/GREED */}
      <div className="cyber-card rounded-xl p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            CẢNH BÁO & TÂM LÝ
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono">
            {overview.active_alerts_count} Tín hiệu
          </span>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
              {overview.fear_greed.value}
              <span className="text-xs font-medium text-slate-400 ml-1">/ 100</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300">
              {overview.fear_greed.value_classification}
            </div>
          </div>
          
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border font-mono font-black text-sm shadow-inner ${getFngColor(
              overview.fear_greed.value
            )}`}
          >
            {overview.fear_greed.value}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className="text-slate-400">Tỷ lệ Pump/Dump:</span>
          <span className="text-emerald-400 font-semibold font-mono">
            68% Bullish
          </span>
        </div>
      </div>

    </div>
  );
}

export const HeroMetrics = React.memo(HeroMetricsComponent);

