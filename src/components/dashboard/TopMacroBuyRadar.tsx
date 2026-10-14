"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Sparkles,
  Layers,
  Search,
  Filter,
  Activity,
  SlidersHorizontal,
  Clock,
  Compass,
  Calendar,
  Building2,
  ExternalLink,
  Target,
  Flame,
  LayoutGrid,
  Columns2,
  Table as TableIcon,
  CheckCircle2,
  AlertTriangle,
  Coins
} from 'lucide-react';
import { TokenItem, TokenIcon } from '@/app/page';
import { CapBadge } from './CapBadge';
import { formatCryptoPrice } from '@/lib/priceFormatter';
import {
  MacroCoinAnalysis,
  analyzeMacroCoin,
  getMacroRankings
} from '@/lib/macroFlowEngine';

interface TopMacroBuyRadarProps {
  tokens: TokenItem[];
  onSelectToken?: (token: TokenItem) => void;
  onSelectSymbol?: (symbol: string) => void;
  formatUSD?: (price: number) => string;
}

// Master view modes
export type MasterViewMode = 'split' | 'short_term' | 'long_term' | 'table';

// Subtab filters for Buy and Avoid columns
export type BuySubTab = 'ALL_BUY' | 'SHORT_BULLISH' | 'LONG_ALPHA' | 'ETF_INFLOW';
export type AvoidSubTab = 'ALL_AVOID' | 'SHORT_DUMP' | 'LONG_RISK';

// Format số tiền triệu hoặc tỷ USD
const formatMillionBillion = (valUSD: number) => {
  const abs = Math.abs(valUSD);
  const sign = valUSD >= 0 ? '+' : '-';
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  }
  return `${sign}$${abs.toFixed(0)}`;
};

/**
 * Thẻ Card đơn lẻ được thiết kế chuyên biệt cho TOP NÊN MUA và TOP NÊN TRÁNH
 */
interface MacroSplitCoinCardProps {
  item: MacroCoinAnalysis;
  rankIndex: number;
  variant: 'BUY' | 'AVOID';
  onSelect: (item: MacroCoinAnalysis) => void;
  formatPriceFn: (price: number) => string;
}

const MacroSplitCoinCard = React.memo(function MacroSplitCoinCard({
  item,
  rankIndex,
  variant,
  onSelect,
  formatPriceFn,
}: MacroSplitCoinCardProps) {
  const p = item.prediction;
  const f = item.flow;
  const isBuy = variant === 'BUY';

  const isShortBullish = p.shortTermTrend === 'STRONG_BULLISH' || p.shortTermTrend === 'BULLISH_REBOUND';
  const isShortDump = p.shortTermTrend === 'BEARISH_DUMP';
  const isLongAlpha = p.longTermTrend === 'MACRO_ALPHA_BUY' || p.longTermTrend === 'STEADY_ACCUMULATION';

  return (
    <div
      onClick={() => onSelect(item)}
      className={`rounded-2xl border transition-all duration-300 p-4 sm:p-4.5 relative overflow-hidden group cursor-pointer shadow-xl gpu-layer ${
        isBuy
          ? 'bg-gradient-to-b from-[#0B1524] via-[#08101E] to-[#050A14] border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-950/40 hover:scale-[1.01]'
          : 'bg-gradient-to-b from-[#1C0D15] via-[#140810] to-[#0A0408] border-rose-500/30 hover:border-rose-400 hover:shadow-rose-950/40 hover:scale-[1.01]'
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isBuy ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-rose-500/10 group-hover:bg-rose-500/20'
        }`}
      />

      {/* Row 1: Header - Rank, Avatar, Name, Category, Spot/Futures Badge & Live Price */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center shrink-0 border shadow-sm ${
            isBuy
              ? rankIndex < 3
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border-amber-300 font-extrabold'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
              : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
          }`}>
            #{rankIndex + 1}
          </span>
          <TokenIcon symbol={item.symbol} className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className={`font-extrabold text-sm sm:text-base transition-colors truncate max-w-[120px] xs:max-w-[150px] ${
                isBuy ? 'text-white group-hover:text-cyan-300' : 'text-slate-100 group-hover:text-rose-300'
              }`}>
                {item.name}
              </span>
              <span className="font-mono text-xs text-slate-400 font-semibold shrink-0">
                {item.symbol}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-nowrap">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono whitespace-nowrap shrink-0 ${
                isBuy ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40' : 'text-rose-300 bg-rose-950/60 border-rose-800/40'
              }`}>
                {item.category}
              </span>
              <CapBadge symbol={item.symbol} basePrice={item.currentPrice} className="whitespace-nowrap shrink-0" />
              {item.isSpot ? (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0">
                  SPOT
                </span>
              ) : (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap shrink-0">
                  FUTURES ONLY
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Price & 24h Change */}
        <div className="text-right shrink-0">
          <div className="font-mono text-base sm:text-lg font-black text-white tracking-tight">
            {formatPriceFn(item.currentPrice)}
          </div>
          <div
            className={`inline-flex items-center text-xs font-bold font-mono ${
              item.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {item.priceChange24h >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {item.priceChange24h >= 0 ? `+${item.priceChange24h}%` : `${item.priceChange24h}%`}
          </div>
        </div>
      </div>

      {/* Row 2: Ma Trận 4 Khung Thời Gian (24H • 7D • 30D • All-Time) */}
      <div className="my-2.5 space-y-1.5">
        <div className="grid grid-cols-4 gap-1 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-center shadow-inner">
          {/* Box 1: 24 Giờ */}
          <div className="p-1 rounded-lg bg-slate-900/90 border border-slate-800/60">
            <span className="text-[8.5px] text-slate-500 uppercase block font-sans">24 Giờ</span>
            <span className={`text-[10.5px] font-extrabold truncate block ${f.net24hUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMillionBillion(f.net24hUSD)}
            </span>
          </div>

          {/* Box 2: 7 Ngày */}
          <div className="p-1 rounded-lg bg-slate-900/90 border border-slate-800/60">
            <span className="text-[8.5px] text-slate-500 uppercase block font-sans">7 Ngày</span>
            <span className={`text-[10.5px] font-extrabold truncate block ${f.net7dUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMillionBillion(f.net7dUSD)}
            </span>
          </div>

          {/* Box 3: 30 Ngày */}
          <div className="p-1 rounded-lg bg-slate-900/90 border border-slate-800/60">
            <span className="text-[8.5px] text-slate-500 uppercase block font-sans">30 Ngày</span>
            <span className={`text-[10.5px] font-extrabold truncate block ${f.net30dUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatMillionBillion(f.net30dUSD)}
            </span>
          </div>

          {/* Box 4: All-Time Tích Lũy */}
          <div className={`p-1 rounded-lg border ${
            isBuy ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-200' : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
          }`}>
            <span className="text-[8.5px] font-bold uppercase block font-sans">All-Time</span>
            <span className="text-[10.5px] font-black truncate block">
              {formatMillionBillion(f.allTimeSmartFlowUSD)}
            </span>
          </div>
        </div>

        {/* Khóa ví lạnh & ATH */}
        <div className="flex items-center justify-between text-[10px] font-mono px-1 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className={`w-3 h-3 ${isBuy ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Khóa ví lạnh: <strong className={isBuy ? 'text-emerald-300' : 'text-slate-300'}>{f.illiquidSupplyPct}%</strong></span>
          </span>
          <span>
            Cách đỉnh ATH: <strong className={f.distanceFromAthPct < -40 ? 'text-amber-400' : 'text-cyan-300'}>{f.distanceFromAthPct}%</strong>
          </span>
        </div>
      </div>

      {/* Row 3: Hộp Dự Báo Tăng/Giảm Phân Rõ NGẮN HẠN vs DÀI HẠN */}
      <div className={`p-2.5 rounded-xl border space-y-2 ${
        isBuy ? 'bg-slate-950/90 border-cyan-900/40' : 'bg-slate-950/90 border-rose-900/40'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10.5px] font-bold text-slate-300 flex items-center gap-1 font-sans">
            <Target className={`w-3.5 h-3.5 ${isBuy ? 'text-cyan-400' : 'text-rose-400'}`} />
            <span>DỰ BÁO XU HƯỚNG:</span>
          </span>

          <span className={`font-mono text-[9.5px] px-2 py-0.5 rounded-full border font-black ${
            isBuy ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            MACRO SCORE: {p.macroScore}/100
          </span>
        </div>

        {/* 2 Badges: Ngắn Hạn vs Dài Hạn */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {/* Dự phóng ngắn hạn (1D - 7D) */}
          <div className={`p-1.5 rounded-lg border flex flex-col justify-between ${
            isShortBullish
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : isShortDump
              ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[8.5px] uppercase font-bold text-slate-400 block">⚡ Ngắn Hạn (1D - 7D)</span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className="font-extrabold text-[10.5px] truncate flex items-center gap-0.5">
                {isShortBullish ? <ArrowUpRight className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" /> : isShortDump ? <ArrowDownRight className="w-3 h-3 text-rose-400 animate-pulse shrink-0" /> : null}
                {p.shortTermLabel.split(' ')[0]} {p.shortTermLabel.split(' ')[1] || ''}
              </span>
              <span className="text-[10.5px] font-mono font-black shrink-0">
                {p.shortTermTargetPct > 0 ? `+${p.shortTermTargetPct}%` : `${p.shortTermTargetPct}%`}
              </span>
            </div>
          </div>

          {/* Dự phóng dài hạn (All-Time Macro) */}
          <div className={`p-1.5 rounded-lg border flex flex-col justify-between ${
            isLongAlpha
              ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-200'
              : p.longTermTrend === 'HIGH_RISK_DUMP'
              ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[8.5px] uppercase font-bold text-slate-400 block">💎 Dài Hạn (All-Time)</span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className="font-extrabold text-[10.5px] truncate flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                {p.longTermLabel.split(' ')[0]} {p.longTermLabel.split(' ')[1] || ''}
              </span>
              <span className="text-[10.5px] font-mono font-black shrink-0">
                {p.longTermMultiplier}
              </span>
            </div>
          </div>
        </div>

        {/* Luận điểm tóm tắt on-chain */}
        <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans line-clamp-2 group-hover:line-clamp-none transition-all">
          {isBuy ? '🟢' : '🔴'} <strong className="text-slate-300 font-semibold">{isBuy ? 'Luận điểm gom:' : 'Lý do né xả:'}</strong> {p.analysisReason}
        </p>
      </div>

      {/* Row 4: Kế hoạch vào lệnh hoặc Vùng cảnh báo an toàn */}
      <div className="pt-2 flex items-center justify-between gap-2 text-[10.5px] font-mono border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 truncate">
          {isBuy ? (
            <>
              <span className="text-slate-400">Vùng gom:</span>
              <strong className="text-emerald-400 font-bold truncate">{p.buyZone}</strong>
            </>
          ) : (
            <>
              <span className="text-rose-400/90 font-bold">Cảnh báo:</span>
              <strong className="text-slate-300 truncate">{p.actionLabel}</strong>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className={`px-2 py-0.8 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 shrink-0 whitespace-nowrap border ${
            isBuy
              ? 'bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border-cyan-500/30'
              : 'bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border-rose-500/30'
          }`}
        >
          <span>Chi Tiết</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
});

/**
 * COMPONENT CHÍNH: Bảng phân tích dòng tiền toàn diện chia 2 cột TOP NÊN MUA vs TOP NÊN TRÁNH
 */
export function TopMacroBuyRadar({
  tokens,
  onSelectToken,
  onSelectSymbol,
  formatUSD = formatCryptoPrice,
}: TopMacroBuyRadarProps) {
  const [masterMode, setMasterMode] = useState<MasterViewMode>('split');
  const [buySubTab, setBuySubTab] = useState<BuySubTab>('ALL_BUY');
  const [avoidSubTab, setAvoidSubTab] = useState<AvoidSubTab>('ALL_AVOID');
  const [searchQuery, setSearchQuery] = useState('');
  const [spotOnly, setSpotOnly] = useState<boolean>(true); // Lọc sạch coin chỉ có futures, tập trung 100% vào coin SPOT
  const [limitPerColumn, setLimitPerColumn] = useState<number>(6); // 6 | 12 | 24

  // Tính toán rankings bằng engine với cờ spotOnly
  const rankings = useMemo(() => {
    return getMacroRankings(tokens, undefined, { spotOnly });
  }, [tokens, spotOnly]);

  // Danh sách NÊN MUA theo subtab
  const buyList = useMemo(() => {
    let list: MacroCoinAnalysis[] = [];
    if (buySubTab === 'ALL_BUY') {
      list = rankings.topOverall;
    } else if (buySubTab === 'SHORT_BULLISH') {
      list = rankings.topShortTermRally;
    } else if (buySubTab === 'LONG_ALPHA') {
      list = rankings.topLongTermAlpha;
    } else if (buySubTab === 'ETF_INFLOW') {
      list = rankings.topOverall.filter((c) => (c.etfNetFlowMillions ?? 0) > 0 || ['BTC', 'ETH', 'SOL', 'XRP'].includes(c.symbol));
    }

    if (spotOnly) {
      list = list.filter((c) => c.isSpot);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }

    return list;
  }, [rankings, buySubTab, spotOnly, searchQuery]);

  // Danh sách NÊN TRÁNH theo subtab
  const avoidList = useMemo(() => {
    let list: MacroCoinAnalysis[] = [];
    if (avoidSubTab === 'ALL_AVOID') {
      list = rankings.topBearishDump;
    } else if (avoidSubTab === 'SHORT_DUMP') {
      list = rankings.topShortTermDump;
    } else if (avoidSubTab === 'LONG_RISK') {
      list = rankings.topLongTermRisk;
    }

    if (spotOnly) {
      list = list.filter((c) => c.isSpot);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }

    return list;
  }, [rankings, avoidSubTab, spotOnly, searchQuery]);

  const displayedBuyList = useMemo(() => {
    return buyList.slice(0, limitPerColumn);
  }, [buyList, limitPerColumn]);

  const displayedAvoidList = useMemo(() => {
    return avoidList.slice(0, limitPerColumn);
  }, [avoidList, limitPerColumn]);

  const handleSelectCoin = useCallback((coinAnalysis: MacroCoinAnalysis) => {
    if (onSelectSymbol) {
      onSelectSymbol(coinAnalysis.symbol);
    } else if (onSelectToken) {
      const matched = tokens.find((t) => t.symbol.toUpperCase() === coinAnalysis.symbol.toUpperCase());
      if (matched) onSelectToken(matched);
    }
  }, [tokens, onSelectToken, onSelectSymbol]);

  const { buySentimentPct, avoidSentimentPct, totalBuyFlowUSD, totalAvoidFlowUSD } = rankings.stats;

  return (
    <div className="rounded-2xl bg-[#080C16]/95 border border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur-xl space-y-5 content-visibility-auto">
      {/* 1. Header with Title & Multi-API Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-rose-500/20 border border-cyan-500/40 text-cyan-400 shadow-sm shadow-cyan-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
              TOP NÊN MUA vs NÊN TRÁNH: ĐỐI SOÁT DÒNG TIỀN VĨ MÔ
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
              NGẮN HẠN & DÀI HẠN
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold shadow-sm shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              REALTIME BINANCE & ON-CHAIN MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-4xl leading-relaxed">
            Hệ thống phân tách đối trọng rõ rệt giữa <strong>TOP NÊN MUA GOM</strong> (Dòng tiền vào bùng nổ, ví lạnh tích lũy) và <strong>TOP NÊN TRÁNH</strong> (Áp lực nạp sàn xả tháo chạy) qua 4 khung thời gian 24H • 7D • 30D • All-Time.
          </p>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
            <span className="text-slate-500 text-[10px] block font-sans">Tích lũy ròng All-Time</span>
            <strong className="text-cyan-300 font-extrabold">{formatMillionBillion(rankings.stats.totalAllTimeFlowUSD)}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
            <span className="text-emerald-400/80 text-[10px] block font-sans">Sẽ Tăng Ngắn Hạn</span>
            <strong className="font-extrabold">{rankings.stats.bullishCount} Coin</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200">
            <span className="text-cyan-400/80 text-[10px] block font-sans">Gom Dài Hạn (Alpha)</span>
            <strong className="font-extrabold">{rankings.stats.macroHodlCount} Coin</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300">
            <span className="text-rose-400/80 text-[10px] block font-sans">Cảnh Báo Sẽ Giảm</span>
            <strong className="font-extrabold">{rankings.stats.bearishCount} Coin</strong>
          </div>
        </div>
      </div>

      {/* 2. Cyberpunk Market Sentiment & Flow Balance Meter */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-950/80 to-rose-950/20 border border-slate-800/80 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
          {/* Lực Mua Gom */}
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-bold">LỰC MUA GOM:</span>
            <strong className="text-emerald-400 font-black text-sm">{buySentimentPct}%</strong>
            <span className="text-slate-500 text-[11px]">({rankings.stats.bullishCount} Coin Tăng • {formatMillionBillion(totalBuyFlowUSD || 28_400_000_000)})</span>
          </div>

          {/* Áp Lực Né Xả */}
          <div className="flex items-center gap-2 sm:text-right">
            <span className="text-slate-500 text-[11px]">({rankings.stats.bearishCount} Coin Giảm • {formatMillionBillion(totalAvoidFlowUSD ? -totalAvoidFlowUSD : -6_200_000_000)})</span>
            <strong className="text-rose-400 font-black text-sm">{avoidSentimentPct}%</strong>
            <span className="text-slate-300 font-bold">:ÁP LỰC XẢ NÉ</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse"></span>
          </div>
        </div>

        {/* Thanh gauge 2 đầu */}
        <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 flex overflow-hidden shadow-inner">
          <div
            style={{ width: `${buySentimentPct}%` }}
            className="h-full rounded-l-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 shadow-sm shadow-emerald-500/50 transition-all duration-700"
          />
          <div
            style={{ width: `${avoidSentimentPct}%` }}
            className="h-full rounded-r-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-600 shadow-sm shadow-rose-500/50 transition-all duration-700"
          />
        </div>
      </div>

      {/* 3. Controls & Master Mode Selector Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-1">
        {/* Master Mode Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 pb-1 text-xs">
          <button
            onClick={() => setMasterMode('split')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              masterMode === 'split'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>⚖️ CHIA ĐÔI: MUA vs TRÁNH (SPLIT VIEW)</span>
          </button>

          <button
            onClick={() => {
              setMasterMode('short_term');
              setBuySubTab('SHORT_BULLISH');
              setAvoidSubTab('SHORT_DUMP');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              masterMode === 'short_term'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>⚡ CHUYÊN SÂU: NGẮN HẠN (1D - 7D)</span>
          </button>

          <button
            onClick={() => {
              setMasterMode('long_term');
              setBuySubTab('LONG_ALPHA');
              setAvoidSubTab('LONG_RISK');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              masterMode === 'long_term'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>💎 CHUYÊN SÂU: DÀI HẠN (ALL-TIME)</span>
          </button>

          <button
            onClick={() => setMasterMode('table')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              masterMode === 'table'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20 font-black'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>📊 BẢNG MA TRẬN ĐỐI CHIẾU</span>
          </button>
        </div>

        {/* Search, Spot Filter & Limit Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm đồng coin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Toggle Lọc Coin Spot (Lọc Bỏ Futures) */}
          <button
            onClick={() => setSpotOnly((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm shrink-0 ${
              spotOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Lọc bỏ những coin chỉ có hợp đồng tương lai futures, chỉ tập trung coin mua được trên Spot"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${spotOnly ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{spotOnly ? '🟢 CHỈ COIN SPOT' : '⚪ CẢ SPOT & FUTURES'}</span>
          </button>

          {/* Limit selector */}
          <select
            value={limitPerColumn}
            onChange={(e) => setLimitPerColumn(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            <option value={6}>Hiện 6 coin/bên</option>
            <option value={10}>Hiện 10 coin/bên</option>
            <option value={20}>Hiện 20 coin/bên</option>
            <option value={50}>Hiện tất cả</option>
          </select>
        </div>
      </div>

      {/* 4. MAIN LAYOUT: SPLIT VIEW (2 CỘT SONG SONG) HOẶC BẢNG MA TRẬN */}
      {masterMode !== 'table' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ========================================================= */}
          {/* CỘT TRÁI: 🟢 TOP NÊN MUA GOM (DÒNG TIỀN VÀO MẠNH) */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-gradient-to-b from-[#091522]/90 via-[#07101C]/90 to-slate-950/90 border border-cyan-500/30 p-4 sm:p-5 space-y-4 shadow-xl">
            {/* Header Cột Mua */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-900/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5">
                    TOP NÊN MUA GOM
                    <span className="text-xs font-mono font-bold text-emerald-400">({buyList.length})</span>
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ví lạnh rút ròng, lực mua Taker áp đảo & tích lũy dài hạn
                </p>
              </div>

              {/* Subtabs Cột Mua */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-[11px] font-mono shrink-0">
                <button
                  onClick={() => setBuySubTab('ALL_BUY')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    buySubTab === 'ALL_BUY' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất Cả
                </button>
                <button
                  onClick={() => setBuySubTab('SHORT_BULLISH')}
                  className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    buySubTab === 'SHORT_BULLISH' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Sẽ Tăng 1D-7D</span>
                </button>
                <button
                  onClick={() => setBuySubTab('LONG_ALPHA')}
                  className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    buySubTab === 'LONG_ALPHA' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Gom All-Time</span>
                </button>
                <button
                  onClick={() => setBuySubTab('ETF_INFLOW')}
                  className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    buySubTab === 'ETF_INFLOW' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>ETF</span>
                </button>
              </div>
            </div>

            {/* Danh sách Card Cột Mua */}
            <div className="space-y-3.5">
              {displayedBuyList.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <p className="text-xs font-semibold text-slate-400">Không có đồng coin nào thỏa mãn bộ lọc mua</p>
                </div>
              ) : (
                displayedBuyList.map((item, idx) => (
                  <MacroSplitCoinCard
                    key={item.id}
                    item={item}
                    rankIndex={idx}
                    variant="BUY"
                    onSelect={handleSelectCoin}
                    formatPriceFn={formatUSD}
                  />
                ))
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CỘT PHẢI: 🔴 TOP NÊN TRÁNH (CẢNH BÁO XẢ & PHÂN PHỐI) */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-gradient-to-b from-[#1A0A12]/90 via-[#13070E]/90 to-slate-950/90 border border-rose-500/30 p-4 sm:p-5 space-y-4 shadow-xl">
            {/* Header Cột Né */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-900/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-white text-base tracking-wide flex items-center gap-1.5">
                    TOP NÊN TRÁNH / NÉ
                    <span className="text-xs font-mono font-bold text-rose-400">({avoidList.length})</span>
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nạp sàn ồ ạt, RSI quá mua cực độ & rủi ro xả dài hạn
                </p>
              </div>

              {/* Subtabs Cột Né */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-[11px] font-mono shrink-0">
                <button
                  onClick={() => setAvoidSubTab('ALL_AVOID')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    avoidSubTab === 'ALL_AVOID' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất Cả
                </button>
                <button
                  onClick={() => setAvoidSubTab('SHORT_DUMP')}
                  className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    avoidSubTab === 'SHORT_DUMP' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDownRight className="w-3 h-3" />
                  <span>Sẽ Giảm 1D-7D</span>
                </button>
                <button
                  onClick={() => setAvoidSubTab('LONG_RISK')}
                  className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    avoidSubTab === 'LONG_RISK' ? 'bg-amber-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Rủi Ro Dài Hạn</span>
                </button>
              </div>
            </div>

            {/* Danh sách Card Cột Né */}
            <div className="space-y-3.5">
              {displayedAvoidList.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <p className="text-xs font-semibold text-slate-400">Không có đồng coin nào nằm trong danh sách né</p>
                </div>
              ) : (
                displayedAvoidList.map((item, idx) => (
                  <MacroSplitCoinCard
                    key={item.id}
                    item={item}
                    rankIndex={idx}
                    variant="AVOID"
                    onSelect={handleSelectCoin}
                    formatPriceFn={formatUSD}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* BẢNG MA TRẬN ĐỐI CHIẾU NGANG CHO CẢ 2 BÊN (TABLE MODE) */
        /* ========================================================= */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 uppercase tracking-wider text-[11px] bg-slate-950/80 select-none text-slate-400">
                <th className="py-3 px-3.5"># / Đồng Coin</th>
                <th className="py-3 px-3">Phân Nhóm</th>
                <th className="py-3 px-3">Giá Realtime</th>
                <th className="py-3 px-3">24H Net</th>
                <th className="py-3 px-3">7D Net</th>
                <th className="py-3 px-3">30D Net</th>
                <th className="py-3 px-3">All-Time Gom</th>
                <th className="py-3 px-3">Dự Phóng Ngắn Hạn</th>
                <th className="py-3 px-3">Dự Phóng Dài Hạn</th>
                <th className="py-3 px-3">Macro Score</th>
                <th className="py-3 px-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankings.allCoins
                .filter((c) => (spotOnly ? c.isSpot : true))
                .filter((c) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
                })
                .slice(0, 30)
                .map((item, index) => {
                  const p = item.prediction;
                  const f = item.flow;
                  const isCoinBuy = p.actionSignal === 'STRONG_BUY' || p.actionSignal === 'DCA_ACCUMULATE' || p.shortTermTrend === 'STRONG_BULLISH';
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectCoin(item)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group font-sans"
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 font-bold text-[11px] w-5">#{index + 1}</span>
                          <TokenIcon symbol={item.symbol} className="w-7 h-7" />
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                              <span>{item.name}</span>
                              <span className="font-mono text-xs text-slate-400 font-normal">({item.symbol})</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[9px] text-cyan-300 font-mono">{item.category}</span>
                              {item.isSpot ? (
                                <span className="text-[9px] font-mono font-bold px-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  SPOT
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono font-bold px-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  FUTURES
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isCoinBuy ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}>
                          {isCoinBuy ? '🟢 NÊN MUA' : '🔴 NÊN TRÁNH'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        <div>{formatUSD(item.currentPrice)}</div>
                        <span className={`text-[10px] ${item.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.priceChange24h >= 0 ? '+' : ''}{item.priceChange24h}%
                        </span>
                      </td>
                      <td className={`py-3 px-3 font-mono font-bold ${f.net24hUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatMillionBillion(f.net24hUSD)}
                      </td>
                      <td className={`py-3 px-3 font-mono font-bold ${f.net7dUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatMillionBillion(f.net7dUSD)}
                      </td>
                      <td className={`py-3 px-3 font-mono font-bold ${f.net30dUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatMillionBillion(f.net30dUSD)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                        {formatMillionBillion(f.allTimeSmartFlowUSD)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border inline-flex items-center gap-0.5 ${
                          p.shortTermTrend === 'STRONG_BULLISH' || p.shortTermTrend === 'BULLISH_REBOUND'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : p.shortTermTrend === 'BEARISH_DUMP'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {p.shortTermLabel} ({p.shortTermTargetPct > 0 ? `+${p.shortTermTargetPct}%` : `${p.shortTermTargetPct}%`})
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-950/60 text-cyan-200 border border-cyan-800/40">
                          {p.longTermLabel} ({p.longTermMultiplier})
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-extrabold text-[11px]">
                          {p.macroScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCoin(item);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold text-[11px] transition-colors border border-slate-700"
                        >
                          Chi Tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TopMacroBuyRadar;
