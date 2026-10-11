"use client";

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  ArrowRightLeft,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { TokenItem, TokenIcon } from '@/app/page';
import { ExchangeFilter } from './MarketFilters';
import { formatCryptoPrice, getDecimalsForPrice } from '@/lib/priceFormatter';

interface CoinTableProps {
  tokens: TokenItem[];
  selectedExchange: ExchangeFilter;
  priceFlashMap?: Record<string, 'up' | 'down'>;
  onSelectToken: (token: TokenItem) => void;
  formatUSD: (price: number) => string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  tableScope: number;
}

export function CoinTable({
  tokens,
  selectedExchange,
  priceFlashMap = {},
  onSelectToken,
  formatUSD,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  tableScope,
}: CoinTableProps) {
  const getExchangeHighlightClass = (exchange: 'BINANCE' | 'OKX' | 'COINBASE' | 'DEX') => {
    if (selectedExchange === exchange) {
      return 'bg-cyan-500/10 border-x border-cyan-500/40 text-cyan-200';
    }
    return '';
  };

  const getExchangeHeaderHighlight = (exchange: 'BINANCE' | 'OKX' | 'COINBASE' | 'DEX') => {
    if (selectedExchange === exchange) {
      return 'text-cyan-300 bg-cyan-950/40 border-x border-cyan-500/40 font-bold';
    }
    return 'text-slate-400';
  };

  const startItem = (currentPage - 1) * tableScope + 1;
  const endItem = Math.min(currentPage * tableScope, totalItems);

  return (
    <div className="rounded-2xl bg-[#090D18]/95 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Table Sub-header with Exchange View Status indicator */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-slate-300 font-semibold font-mono uppercase tracking-wider text-[11px]">
            CHẾ ĐỘ ĐỐI SOÁT:
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] font-mono">
            {selectedExchange === 'ALL'
              ? 'MA TRẬN ĐA SÀN (BINANCE, OKX, COINBASE & DEX)'
              : selectedExchange === 'BINANCE'
              ? 'BINANCE CEX FOCUS (KHỚP LỆNH CHÍNH)'
              : selectedExchange === 'OKX'
              ? 'OKX / BYBIT FOCUS (THỊ TRƯỜNG CHÂU Á)'
              : selectedExchange === 'COINBASE'
              ? 'COINBASE PRO (DÒNG TIỀN TỔ CHỨC US)'
              : 'DEX ON-CHAIN (RAYDIUM / UNISWAP)'}
          </span>
        </div>

        <div className="text-slate-400 text-xs font-mono">
          Hiển thị <strong className="text-white">{startItem} - {endItem}</strong> trên tổng <strong className="text-cyan-400">{totalItems}</strong> đồng coin
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 uppercase tracking-wider text-[11px] bg-slate-900/70 font-mono select-none">
              <th className="py-3.5 px-4 sticky left-0 z-20 bg-slate-900/95 backdrop-blur-md">
                # / Tài Sản
              </th>
              <th className={`py-3.5 px-3.5 ${getExchangeHeaderHighlight('BINANCE')}`}>
                <div className="flex items-center gap-1">
                  <span>Binance CEX</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">Fast</span>
                </div>
              </th>
              <th className={`py-3.5 px-3.5 ${getExchangeHeaderHighlight('OKX')}`}>
                <div className="flex items-center gap-1">
                  <span>OKX / Bybit</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300">Asia</span>
                </div>
              </th>
              <th className={`py-3.5 px-3.5 ${getExchangeHeaderHighlight('COINBASE')}`}>
                <div className="flex items-center gap-1">
                  <span>Coinbase Pro</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300">US</span>
                </div>
              </th>
              <th className={`py-3.5 px-3.5 ${getExchangeHeaderHighlight('DEX')}`}>
                <div className="flex items-center gap-1">
                  <span>DEX Pools</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">DEX</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center">
                <span>Spread (%)</span>
              </th>
              <th className="py-3.5 px-3.5">
                <span>Biến Động 24h</span>
              </th>
              <th className="py-3.5 px-4 min-w-[200px]">
                <span>Whale Flow (Nạp vs Rút)</span>
              </th>
              <th className="py-3.5 px-3 text-center">
                <span>RSI</span>
              </th>
              <th className="py-3.5 px-4">
                <span>Khuyến Nghị Spot</span>
              </th>
              <th className="py-3.5 px-4 text-center">
                <span>Thao Tác</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-mono">
            {tokens.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="text-sm font-semibold text-slate-300">Không tìm thấy đồng coin phù hợp bộ lọc</p>
                    <p className="text-xs text-slate-500">Hãy thử đổi nguồn sàn, xóa bộ lọc tín hiệu hoặc từ khóa tìm kiếm.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tokens.map((token, idx) => {
                const flash = priceFlashMap[token.symbol];
                const isBuy = token.status === 'BUY_SPOT';
                const totalFlow = token.whaleInflowUSD + token.whaleOutflowUSD;
                const inflowPct = totalFlow > 0 ? Math.round((token.whaleInflowUSD / totalFlow) * 100) : 50;
                const outflowPct = 100 - inflowPct;
                const rankNumber = (currentPage - 1) * tableScope + idx + 1;

                const livePrice = token.globalAvgPrice || token.basePrice;
                const decimals = getDecimalsForPrice(livePrice);

                const binanceP = token.binancePrice || livePrice;
                const okxP = token.okxPrice || Number((livePrice * 1.0002).toFixed(decimals));
                const coinbaseP = token.coinbasePrice || Number((livePrice * 1.0006).toFixed(decimals));
                const dexP = token.dexPrice || Number((livePrice * 0.9992).toFixed(decimals));

                const isHighSpread = (token.spreadPct ?? 0.12) >= 0.35;

                return (
                  <tr
                    key={token.id}
                    onClick={() => onSelectToken(token)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Column 1: Token name, avatar & rank */}
                    <td className="py-3 px-4 font-sans sticky left-0 z-10 bg-[#090D18]/95 group-hover:bg-slate-900/95 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-500 font-bold w-6 shrink-0">
                          #{rankNumber}
                        </span>
                        <TokenIcon symbol={token.symbol} className="w-8 h-8" />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            <span className="text-sm">{token.name}</span>
                            <span className="font-mono text-slate-400 text-xs font-normal">
                              {token.symbol}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono">
                            {token.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Giá Binance CEX */}
                    <td className={`py-3 px-3.5 font-bold ${getExchangeHighlightClass('BINANCE')}`}>
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block py-0.5 px-1.5 rounded transition-all duration-300 ${
                            flash === 'up'
                              ? 'bg-emerald-500/25 text-emerald-300 font-extrabold shadow-[0_0_8px_#10b981]'
                              : flash === 'down'
                              ? 'bg-rose-500/25 text-rose-300 font-extrabold shadow-[0_0_8px_#f43f5e]'
                              : selectedExchange === 'BINANCE'
                              ? 'text-cyan-300 font-extrabold'
                              : 'text-white'
                          }`}
                        >
                          {formatUSD(binanceP)}
                        </span>
                        <span className="text-[9px] text-slate-500 block">Binance CEX</span>
                      </div>
                    </td>

                    {/* Column 3: Giá OKX / Bybit */}
                    <td className={`py-3 px-3.5 font-medium ${getExchangeHighlightClass('OKX')}`}>
                      <div className="space-y-0.5">
                        <span className={`block ${selectedExchange === 'OKX' ? 'text-cyan-300 font-extrabold' : 'text-slate-200'}`}>
                          {formatUSD(okxP)}
                        </span>
                        <span className="text-[9px] text-slate-500 block">OKX/Bybit</span>
                      </div>
                    </td>

                    {/* Column 4: Giá Coinbase Pro */}
                    <td className={`py-3 px-3.5 font-medium ${getExchangeHighlightClass('COINBASE')}`}>
                      <div className="space-y-0.5">
                        <span className={`block ${selectedExchange === 'COINBASE' ? 'text-cyan-300 font-extrabold' : 'text-slate-200'}`}>
                          {formatUSD(coinbaseP)}
                        </span>
                        <span className="text-[9px] text-slate-500 block">Coinbase US</span>
                      </div>
                    </td>

                    {/* Column 5: Giá DEX Pools */}
                    <td className={`py-3 px-3.5 font-medium ${getExchangeHighlightClass('DEX')}`}>
                      <div className="space-y-0.5">
                        <span className={`block ${selectedExchange === 'DEX' ? 'text-cyan-300 font-extrabold' : 'text-slate-200'}`}>
                          {formatUSD(dexP)}
                        </span>
                        <span className="text-[9px] text-slate-500 block">Raydium/Uni</span>
                      </div>
                    </td>

                    {/* Column 6: Độ lệch giá (Spread Tracker) */}
                    <td className="py-3 px-3.5 text-center">
                      {isHighSpread ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold shadow-sm shadow-amber-500/10">
                          <Zap className="w-3 h-3 text-amber-400" />
                          ±{token.spreadPct}%
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 text-[10px]">
                          ±{token.spreadPct ?? 0.12}%
                        </span>
                      )}
                    </td>

                    {/* Column 7: Biến Động 24h */}
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center font-bold text-xs ${
                          token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {token.priceChange24h >= 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                        )}
                        {token.priceChange24h >= 0 ? `+${token.priceChange24h}%` : `${token.priceChange24h}%`}
                      </span>
                    </td>

                    {/* Column 8: 2-Sided Whale Flow progress bar */}
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-rose-400 font-semibold">
                            Xả ${token.whaleInflowUSD}M ({inflowPct}%)
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            Gom ${token.whaleOutflowUSD}M ({outflowPct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full flex overflow-hidden border border-slate-800">
                          <div style={{ width: `${inflowPct}%` }} className="bg-rose-500" />
                          <div style={{ width: `${outflowPct}%` }} className="bg-emerald-500" />
                        </div>
                        <div className="text-[10px] text-right">
                          <span
                            className={
                              token.netWhaleFlow >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                            }
                          >
                            Net: {token.netWhaleFlow >= 0 ? `+$${token.netWhaleFlow}M` : `-$${Math.abs(token.netWhaleFlow)}M`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 9: RSI */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-bold text-xs px-2 py-0.5 rounded ${
                          token.rsi > 70
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : token.rsi < 35
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {token.rsi}
                      </span>
                    </td>

                    {/* Column 10: Khuyến Nghị Spot */}
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                            isBuy
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10'
                          }`}
                        >
                          {isBuy ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          {token.statusLabel}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {token.spotScore}
                        </span>
                      </div>
                    </td>

                    {/* Column 11: Thao Tác */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectToken(token);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold text-xs transition-colors border border-slate-700/80"
                      >
                        Chi Tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-950/40">
          <div className="text-slate-400 font-mono">
            Trang <strong className="text-white">{currentPage}</strong> / <strong className="text-slate-300">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-7 h-7 rounded-lg font-bold font-mono text-xs transition-colors ${
                      currentPage === page
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className="text-slate-600 px-1 font-mono">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
