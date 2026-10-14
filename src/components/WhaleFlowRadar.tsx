"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Layers,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  Flame,
  Radio
} from 'lucide-react';
import { TokenIcon } from '@/app/page';
import { formatCryptoPrice } from '@/lib/priceFormatter';
import { CapBadge } from '@/components/dashboard/CapBadge';
import { EtfFlowTracker } from '@/components/dashboard/EtfFlowTracker';

export interface TokenFlow {
  symbol: string;
  name: string;
  inflowUsd: number;   // Số tiền nạp lên sàn (Xả) in USD
  outflowUsd: number;  // Số tiền rút về ví (Tích lũy) in USD
  binancePrice: number;
  globalAvgPrice: number;
  spreadPct?: number;
  category?: string;
  spotScore?: number;
  priceChange24h?: number;
  volume24h?: string | number;
  quoteVolumeUSD?: number;
  marketCapUSD?: number;
}

interface WhaleFlowRadarProps {
  tokens: TokenFlow[];
  onSelectToken?: (symbol: string) => void;
  lastUpdated?: number | null;
  onRefresh?: () => void;
  loading?: boolean;
}

export type RadarSortOption = 'NET_FLOW_DESC' | 'NET_FLOW_ASC' | 'VOLUME_DESC' | 'CHANGE_DESC' | 'SPOT_SCORE_DESC';

const formatPrice = (price: number) => {
  return formatCryptoPrice(price);
};

const formatMillions = (usd: number) => {
  if (usd >= 1_000_000_000) {
    return (usd / 1_000_000_000).toFixed(2) + 'B';
  }
  if (usd >= 1_000_000) {
    return (usd / 1_000_000).toFixed(1) + 'M';
  }
  if (usd >= 1_000) {
    return (usd / 1_000).toFixed(0) + 'K';
  }
  return usd.toFixed(0);
};

interface WhaleRadarCardProps {
  token: TokenFlow;
  index: number;
  onSelectToken?: (symbol: string) => void;
}

const WhaleRadarCard = React.memo(function WhaleRadarCard({
  token,
  index,
  onSelectToken,
}: WhaleRadarCardProps) {
  const totalFlow = (token.inflowUsd + token.outflowUsd) || 1;
  const inflowPct = Math.round((token.inflowUsd / totalFlow) * 100);
  const outflowPct = 100 - inflowPct;
  const netFlow = token.outflowUsd - token.inflowUsd;
  const isAccumulating = netFlow >= 0;
  const change = token.priceChange24h ?? 0;

  return (
    <div
      onClick={() => onSelectToken?.(token.symbol)}
      className="bg-slate-900/60 hover:bg-slate-800/80 p-3.5 rounded-xl border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg gpu-layer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 font-bold w-5">
            #{index + 1}
          </span>
          
          {/* Token Icon */}
          <TokenIcon symbol={token.symbol} className="w-6 h-6" />

          {/* Token Symbol, Name & CapBadge */}
          <span className="font-extrabold text-white text-sm uppercase group-hover:text-cyan-300 transition-colors">
            {token.symbol}
          </span>
          <span className="text-xs text-slate-400">({token.name})</span>

          {/* CapBadge chuẩn xác */}
          <CapBadge
            symbol={token.symbol}
            marketCapUSD={token.marketCapUSD}
            basePrice={token.binancePrice}
          />

          {/* Price 24h Change Badge */}
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
              change >= 0
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>

          {/* Multi-Exchange Price Comparison Badges */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60">
              Binance: <strong className="text-white">{formatPrice(token.binancePrice)}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-cyan-500/30">
              Bình quân: <strong className="text-cyan-200">{formatPrice(token.globalAvgPrice)}</strong>
            </span>
            {token.quoteVolumeUSD && (
              <span className="px-1.5 py-0.5 rounded bg-slate-800/70 text-slate-400 text-[10px]">
                Vol: ${formatMillions(token.quoteVolumeUSD)}
              </span>
            )}
          </div>
        </div>

        {/* Net Whale Flow Outcome Badge */}
        <div className="text-right shrink-0">
          {isAccumulating ? (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-700/60 flex items-center gap-1 shadow-sm shadow-emerald-950">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Đang gom ròng: +${formatMillions(netFlow)}
            </span>
          ) : (
            <span className="text-xs font-bold text-rose-300 bg-rose-950/70 px-2.5 py-1 rounded-md border border-rose-700/60 flex items-center gap-1 shadow-sm shadow-rose-950">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Đang xả ròng: -${formatMillions(Math.abs(netFlow))}
            </span>
          )}
        </div>
      </div>

      {/* Biểu đồ phân bổ 2 bên (Dual-sided Split Bar) */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span className="text-rose-400 font-bold flex items-center gap-1">
            Nạp CEX: ${formatMillions(token.inflowUsd)} ({inflowPct}%)
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            Rút ví gom: ${formatMillions(token.outflowUsd)} ({outflowPct}%)
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-slate-800 relative">
          {/* Left: Inflow (Xả - Đỏ Rose) */}
          <div
            style={{ width: `${inflowPct}%` }}
            className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 h-full rounded-l-full transition-all duration-500 relative flex items-center justify-start pl-2"
          >
            {inflowPct > 18 && (
              <span className="text-[9px] font-bold text-white font-mono drop-shadow">
                {inflowPct}%
              </span>
            )}
          </div>

          {/* Glowing center divider line */}
          <div className="w-1 h-full bg-white z-10 shadow-[0_0_8px_#ffffff]" />

          {/* Right: Outflow (Gom - Xanh Emerald) */}
          <div
            style={{ width: `${outflowPct}%` }}
            className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 h-full rounded-r-full transition-all duration-500 relative flex items-center justify-end pr-2"
          >
            {outflowPct > 18 && (
              <span className="text-[9px] font-bold text-slate-950 font-mono drop-shadow">
                {outflowPct}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

function WhaleFlowRadarComponent({
  tokens,
  onSelectToken,
  lastUpdated,
  onRefresh,
  loading = false,
}: WhaleFlowRadarProps) {
  const [displayLimit, setDisplayLimit] = useState<number>(10); // 10 | 25 | 50 | 100
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [flowFilter, setFlowFilter] = useState<'ALL' | 'ACCUMULATING' | 'DUMPING'>('ALL');
  const [radarSearch, setRadarSearch] = useState<string>('');
  const [radarSort, setRadarSort] = useState<RadarSortOption>('NET_FLOW_DESC');

  // Tính toán thống kê tổng quan thị trường On-chain 24h
  const marketAggregate = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let accCount = 0;
    let dumpCount = 0;

    tokens.forEach((t) => {
      totalInflow += t.inflowUsd;
      totalOutflow += t.outflowUsd;
      if (t.outflowUsd >= t.inflowUsd) accCount++;
      else dumpCount++;
    });

    const totalVolume = totalInflow + totalOutflow || 1;
    const outflowRatio = Math.round((totalOutflow / totalVolume) * 100);
    const inflowRatio = 100 - outflowRatio;
    const netTotal = totalOutflow - totalInflow;

    return {
      totalInflow,
      totalOutflow,
      outflowRatio,
      inflowRatio,
      netTotal,
      accCount,
      dumpCount,
    };
  }, [tokens]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tokens.forEach((t) => {
      if (t.category) {
        cats.add(t.category.split('/')[0].trim());
      }
    });
    return ['ALL', ...Array.from(cats)];
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    return tokens
      .filter((t) => {
        // Search filter
        const matchSearch =
          t.symbol.toLowerCase().includes(radarSearch.toLowerCase()) ||
          t.name.toLowerCase().includes(radarSearch.toLowerCase());
        if (!matchSearch) return false;

        // Category filter
        if (selectedCategory !== 'ALL') {
          const cat = t.category?.toLowerCase() || '';
          if (!cat.includes(selectedCategory.toLowerCase())) return false;
        }

        // Flow filter
        const net = t.outflowUsd - t.inflowUsd;
        if (flowFilter === 'ACCUMULATING' && net < 0) return false;
        if (flowFilter === 'DUMPING' && net >= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const netA = a.outflowUsd - a.inflowUsd;
        const netB = b.outflowUsd - b.inflowUsd;

        if (radarSort === 'NET_FLOW_DESC') {
          return netB - netA; // Gom nhiều nhất trước
        }
        if (radarSort === 'NET_FLOW_ASC') {
          return netA - netB; // Xả nhiều nhất trước
        }
        if (radarSort === 'VOLUME_DESC') {
          const volA = a.quoteVolumeUSD || (a.inflowUsd + a.outflowUsd);
          const volB = b.quoteVolumeUSD || (b.inflowUsd + b.outflowUsd);
          return volB - volA;
        }
        if (radarSort === 'CHANGE_DESC') {
          return (b.priceChange24h || 0) - (a.priceChange24h || 0);
        }
        if (radarSort === 'SPOT_SCORE_DESC') {
          return (b.spotScore || 0) - (a.spotScore || 0);
        }
        return 0;
      });
  }, [tokens, radarSearch, selectedCategory, flowFilter, radarSort]);

  const displayedList = useMemo(() => {
    return filteredTokens.slice(0, displayLimit);
  }, [filteredTokens, displayLimit]);

  // Format thời gian cập nhật realtime
  const formattedUpdateTime = useMemo(() => {
    if (!lastUpdated) return 'Vừa cập nhật';
    const date = new Date(lastUpdated);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [lastUpdated]);

  // Xử lý khi người dùng bấm vào một coin trong bảng ETF Flow
  const handleSelectEtfToken = useCallback((symbol: string) => {
    setRadarSearch(symbol);
    onSelectToken?.(symbol);
  }, [onSelectToken]);

  return (
    <div className="bg-[#0B0F1E]/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4 content-visibility-auto">
      {/* 1. Header with Title, Live Badge, Time and Flow Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ArrowRightLeft className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
              BIỂU ĐỒ SO SÁNH 2 BÊN: NẠP SÀN (XẢ) VS RÚT VÍ (TÍCH LŨY)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
              TOP 100 COIN
            </span>

            {/* LIVE REALTIME BADGE */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold shadow-sm shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              REALTIME BINANCE & ON-CHAIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đối soát trực tiếp dữ liệu nạp sàn CEX (Inflow) vs rút về ví lạnh (Outflow) • Cập nhật tự động từng chu kỳ khớp lệnh
          </p>
        </div>

        {/* Action Controls: Refresh & Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          {/* Timestamp & Refresh Button */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-mono text-[11px]">
            <span className="text-slate-400">Đồng bộ:</span>
            <span className="text-cyan-300 font-bold">{formattedUpdateTime}</span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                title="Làm mới dữ liệu Realtime ngay lập tức"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Nạp Sàn (Áp lực Xả)
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Rút Ví (Cá Mập Gom)
          </span>
        </div>
      </div>

      {/* 2. DÒNG TIỀN VÀO ETF HÔM NAY (INSTITUTIONAL SPOT ETF & MULTI-EXCHANGE DATA) */}
      <EtfFlowTracker onSelectToken={handleSelectEtfToken} />

      {/* 3. Macro Market Summary Banner (Tổng quan áp lực thị trường toàn diện) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-gradient-to-r from-slate-950/90 via-[#0C1222] to-slate-950/90 border border-slate-800 text-xs">
        {/* Box 1: Tổng Nạp Sàn */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Tổng Nạp CEX (Áp Lực Xả)</div>
            <div className="text-base font-extrabold text-rose-300 font-mono">
              ${formatMillions(marketAggregate.totalInflow)} ({marketAggregate.inflowRatio}%)
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {marketAggregate.dumpCount} đồng coin chịu áp lực xả
            </div>
          </div>
        </div>

        {/* Box 2: Tổng Rút Ví */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Tổng Rút Ví Lạnh (Tích Lũy)</div>
            <div className="text-base font-extrabold text-emerald-300 font-mono">
              ${formatMillions(marketAggregate.totalOutflow)} ({marketAggregate.outflowRatio}%)
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {marketAggregate.accCount} đồng coin được cá mập gom
            </div>
          </div>
        </div>

        {/* Box 3: Dòng Tiền Ròng Toàn Thị Trường */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-900/30">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Net Whale Flow Toàn Sàn</div>
            <div className={`text-base font-extrabold font-mono ${marketAggregate.netTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {marketAggregate.netTotal >= 0 ? '+' : '-'}${formatMillions(Math.abs(marketAggregate.netTotal))}
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              {marketAggregate.netTotal >= 0 ? (
                <span className="text-emerald-300 font-bold">Thị trường nghiêng về TÍCH LŨY</span>
              ) : (
                <span className="text-rose-300 font-bold">Thị trường nghiêng về BÁN THÁO</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Control Bar: Scope Selector, Sort Selector, Filter, Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        {/* Scope limit selector buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Hiển thị:</span>
          {[10, 25, 50, 100].map((num) => (
            <button
              key={num}
              onClick={() => setDisplayLimit(num)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                displayLimit === num
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              Top {num}
            </button>
          ))}
        </div>

        {/* Flow Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFlowFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              flowFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({tokens.length})
          </button>
          <button
            onClick={() => setFlowFilter('ACCUMULATING')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              flowFilter === 'ACCUMULATING'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chỉ xem Gom ({marketAggregate.accCount})
          </button>
          <button
            onClick={() => setFlowFilter('DUMPING')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              flowFilter === 'DUMPING'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chỉ xem Xả ({marketAggregate.dumpCount})
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium hidden md:inline">Sắp xếp:</span>
          <select
            value={radarSort}
            onChange={(e) => setRadarSort(e.target.value as RadarSortOption)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="NET_FLOW_DESC">Gom ròng cao nhất</option>
            <option value="NET_FLOW_ASC">Xả ròng cao nhất</option>
            <option value="VOLUME_DESC">Volume 24h lớn nhất</option>
            <option value="CHANGE_DESC">Biến động 24h cao nhất</option>
            <option value="SPOT_SCORE_DESC">Điểm Spot Scorer</option>
          </select>
        </div>

        {/* Quick Search inside Radar */}
        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm coin trong radar..."
            value={radarSearch}
            onChange={(e) => setRadarSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 4. Grid of Tokens with Dual-Sided Visual Bar */}
      <div className="space-y-3">
        {displayedList.map((token, index) => (
          <WhaleRadarCard
            key={token.symbol}
            token={token}
            index={index}
            onSelectToken={onSelectToken}
          />
        ))}
      </div>

      {/* Footer / Load More Action */}
      {filteredTokens.length > displayLimit && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setDisplayLimit((prev) => Math.min(100, prev + 25))}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 hover:border-cyan-500/50 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Xem thêm 25 đồng tiếp theo (Đang hiển thị {displayLimit} / {filteredTokens.length} coin)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export const WhaleFlowRadar = React.memo(WhaleFlowRadarComponent);

