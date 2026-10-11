"use client";

import React from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Layers,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';

export type ExchangeFilter = 'ALL' | 'BINANCE' | 'OKX' | 'COINBASE' | 'DEX';
export type SignalFilter = 'ALL' | 'BUY_SPOT' | 'AVOID_DUMP' | 'HIGH_SPREAD';
export type SortOption = 'SPOT_SCORE' | 'NET_FLOW' | 'PRICE_CHANGE' | 'SPREAD';

export interface MarketFiltersProps {
  selectedExchange: ExchangeFilter;
  setSelectedExchange: (val: ExchangeFilter) => void;
  selectedSignal: SignalFilter;
  setSelectedSignal: (val: SignalFilter) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (val: 'asc' | 'desc') => void;
  tableScope: number;
  setTableScope: (val: number) => void;
  totalCount: number;
  filteredCount: number;
  buyCount: number;
  avoidCount: number;
  highSpreadCount: number;
}

export function MarketFilters({
  selectedExchange,
  setSelectedExchange,
  selectedSignal,
  setSelectedSignal,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  tableScope,
  setTableScope,
  totalCount,
  filteredCount,
  buyCount,
  avoidCount,
  highSpreadCount,
}: MarketFiltersProps) {
  const handleToggleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const exchangeOptions: { id: ExchangeFilter; label: string; badge: string; desc: string }[] = [
    { id: 'ALL', label: 'Tất Cả Sàn', badge: 'MATRIX', desc: 'Đối chiếu Spread 4 sàn song song' },
    { id: 'BINANCE', label: 'Binance Focus', badge: 'CEX', desc: 'Thanh khoản khớp lệnh nhanh nhất' },
    { id: 'OKX', label: 'OKX / Bybit', badge: 'ASIA', desc: 'Dòng tiền phái sinh & spot Châu Á' },
    { id: 'COINBASE', label: 'Coinbase Pro', badge: 'US FLOW', desc: 'Dòng tiền tổ chức & quỹ phương Tây' },
    { id: 'DEX', label: 'DEX Pools', badge: 'ON-CHAIN', desc: 'Giá bể thanh khoản thực Raydium/Uniswap' },
  ];

  const categories = ['ALL', 'Layer 1', 'Layer 2', 'DeFi', 'AI', 'Meme', 'Infra'];

  return (
    <div className="bg-[#090D18]/95 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* TẦNG 1: SEARCH & NGUỒN SÀN HIỂN THỊ */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 pb-3 border-b border-slate-800/80">
        {/* Search input with live counter */}
        <div className="relative w-full xl:w-80">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo Symbol, Tên (BTC, NEAR, ARB, SUI...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-800 pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Nguồn sàn Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-bold shrink-0 flex items-center gap-1.5 mr-1 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Nguồn Sàn:
          </span>
          {exchangeOptions.map((item) => {
            const isActive = selectedExchange === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedExchange(item.id)}
                title={item.desc}
                className={`group px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-cyan-500/30 text-cyan-200'
                      : 'bg-slate-800 text-slate-500 group-hover:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TẦNG 2: BỘ LỌC TÍN HIỆU SPOT (SIGNAL FILTER PILLS) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-bold shrink-0 mr-1 uppercase tracking-wider">
            Tín Hiệu Spot:
          </span>

          {/* Tất cả */}
          <button
            onClick={() => setSelectedSignal('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              selectedSignal === 'ALL'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>Toàn Bộ</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/80 text-slate-300 font-mono">
              {totalCount}
            </span>
          </button>

          {/* Khuyên Mua Spot */}
          <button
            onClick={() => setSelectedSignal('BUY_SPOT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              selectedSignal === 'BUY_SPOT'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-emerald-300 hover:border-emerald-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Khuyên Mua Spot</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 font-mono border border-emerald-800/40">
              {buyCount}
            </span>
          </button>

          {/* Cảnh Báo Né / Xả */}
          <button
            onClick={() => setSelectedSignal('AVOID_DUMP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              selectedSignal === 'AVOID_DUMP'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-rose-300 hover:border-rose-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Cảnh Báo Né / Xả</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 font-mono border border-rose-800/40">
              {avoidCount}
            </span>
          </button>

          {/* Chênh Lệch Giá Cao (Arbitrage Spread > 0.35%) */}
          <button
            onClick={() => setSelectedSignal('HIGH_SPREAD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
              selectedSignal === 'HIGH_SPREAD'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-amber-300 hover:border-amber-900/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Chênh Lệch Giá Cao</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 font-mono border border-amber-800/40">
              {highSpreadCount}
            </span>
          </button>
        </div>

        {/* Scope Selector: 10 | 25 | 50 | 100 */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
          <span className="text-slate-500 px-2 text-[11px] font-bold">Hiển thị:</span>
          {[10, 25, 50, 100].map((num) => (
            <button
              key={num}
              onClick={() => setTableScope(num)}
              className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs transition-colors ${
                tableScope === num
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* TẦNG 3: ECOSYSTEM & QUICK SORT 1-CLICK */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-xs">
        {/* Hệ sinh thái Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-slate-500 font-bold shrink-0 mr-1 flex items-center gap-1 text-[11px]">
            <Layers className="w-3 h-3 text-cyan-400" /> Hệ:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        {/* 1-Click Quick Sort Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-slate-500 font-bold shrink-0 mr-1 flex items-center gap-1 text-[11px]">
            <ArrowUpDown className="w-3 h-3 text-cyan-400" /> Sắp xếp:
          </span>
          {[
            { id: 'SPOT_SCORE' as SortOption, label: 'Điểm Spot Score' },
            { id: 'NET_FLOW' as SortOption, label: 'Net Whale Flow' },
            { id: 'PRICE_CHANGE' as SortOption, label: 'Biến Động 24h' },
            { id: 'SPREAD' as SortOption, label: 'Độ Lệch Spread' },
          ].map((item) => {
            const isCurrent = sortBy === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleToggleSort(item.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border flex items-center gap-1 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{item.label}</span>
                {isCurrent && (
                  sortDirection === 'desc' ? (
                    <ArrowDown className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <ArrowUp className="w-3 h-3 text-cyan-400" />
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
