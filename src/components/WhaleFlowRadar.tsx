"use client";

import React, { useState, useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, ArrowRightLeft, Layers, Search, Filter, ChevronDown } from 'lucide-react';
import { TokenIcon } from '@/app/page';
import { formatCryptoPrice } from '@/lib/priceFormatter';

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
}

interface WhaleFlowRadarProps {
  tokens: TokenFlow[];
  onSelectToken?: (symbol: string) => void;
}

export function WhaleFlowRadar({ tokens, onSelectToken }: WhaleFlowRadarProps) {
  const [displayLimit, setDisplayLimit] = useState<number>(10); // 10 | 25 | 50 | 100
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [flowFilter, setFlowFilter] = useState<'ALL' | 'ACCUMULATING' | 'DUMPING'>('ALL');
  const [radarSearch, setRadarSearch] = useState<string>('');

  const formatPrice = (price: number) => {
    return formatCryptoPrice(price);
  };

  const formatMillions = (usd: number) => {
    if (usd >= 1_000_000) {
      return (usd / 1_000_000).toFixed(1);
    }
    return (usd / 1_000).toFixed(0) + 'K';
  };

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
    return tokens.filter((t) => {
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
    });
  }, [tokens, radarSearch, selectedCategory, flowFilter]);

  const displayedList = useMemo(() => {
    return filteredTokens.slice(0, displayLimit);
  }, [filteredTokens, displayLimit]);

  return (
    <div className="bg-[#0B0F1E]/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header with Title and Flow Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-white">
              BIỂU ĐỒ SO SÁNH 2 BÊN: NẠP SÀN (XẢ) VS RÚT VÍ (TÍCH LŨY)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
              TOP 100 COIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi dòng tiền cá mập On-chain của Top 100 đồng coin mạnh nhất thị trường • Đối soát giá CEX & DEX
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Nạp Sàn (Áp lực Xả)
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Rút Ví (Cá Mập Gom)
          </span>
        </div>
      </div>

      {/* Control Bar: Limit Selector [Top 10 / 25 / 50 / 100], Search, Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        {/* Scope limit selector buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Phạm vi xem:</span>
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
              flowFilter === 'ACCUMULATING' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chỉ xem Gom
          </button>
          <button
            onClick={() => setFlowFilter('DUMPING')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              flowFilter === 'DUMPING' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chỉ xem Xả
          </button>
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

      {/* Grid of Tokens with Dual-Sided Visual Bar */}
      <div className="space-y-3">
        {displayedList.map((token, index) => {
          const totalFlow = (token.inflowUsd + token.outflowUsd) || 1;
          const inflowPct = Math.round((token.inflowUsd / totalFlow) * 100);
          const outflowPct = 100 - inflowPct;
          const netFlow = token.outflowUsd - token.inflowUsd; // Dương = Tốt (Gom), Âm = Xấu (Xả)
          const isAccumulating = netFlow >= 0;

          return (
            <div
              key={token.symbol}
              onClick={() => onSelectToken?.(token.symbol)}
              className="bg-slate-900/60 hover:bg-slate-800/70 p-3.5 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-bold w-5">
                      #{index + 1}
                    </span>
                    <TokenIcon symbol={token.symbol} className="w-6 h-6" />
                    <span className="font-extrabold text-white text-sm uppercase group-hover:text-cyan-300 transition-colors">
                      {token.symbol}
                    </span>
                    <span className="text-xs text-slate-400">({token.name})</span>
                  </div>

                  {/* Multi-Exchange Price Comparison Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60">
                      Binance: <strong className="text-white">{formatPrice(token.binancePrice)}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-cyan-500/30">
                      Bình quân: <strong className="text-cyan-200">{formatPrice(token.globalAvgPrice)}</strong>
                    </span>
                    {token.spreadPct !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Spread {token.spreadPct}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Net Whale Flow Outcome */}
                <div className="text-right shrink-0">
                  {isAccumulating ? (
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      Đang gom ròng: +${formatMillions(netFlow)}M
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-800/50 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                      Đang xả ròng: -${formatMillions(Math.abs(netFlow))}M
                    </span>
                  )}
                </div>
              </div>

              {/* Biểu đồ phân bổ 2 bên (Dual-sided Split Bar) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    Nạp CEX: ${formatMillions(token.inflowUsd)}M ({inflowPct}%)
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    Rút ví gom: ${formatMillions(token.outflowUsd)}M ({outflowPct}%)
                  </span>
                </div>
                <div className="w-full h-3.5 bg-slate-950 rounded-full flex overflow-hidden p-0.5 border border-slate-800 relative">
                  {/* Left: Inflow (Xả - Đỏ Rose) */}
                  <div
                    style={{ width: `${inflowPct}%` }}
                    className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-l-full transition-all duration-500 relative flex items-center justify-start pl-2"
                  >
                    {inflowPct > 20 && (
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
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-r-full transition-all duration-500 relative flex items-center justify-end pr-2"
                  >
                    {outflowPct > 20 && (
                      <span className="text-[9px] font-bold text-slate-950 font-mono drop-shadow">
                        {outflowPct}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
