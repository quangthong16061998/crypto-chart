"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Activity,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCw,
  Wallet,
  ArrowRightLeft,
  Info,
  Maximize2,
  ExternalLink,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useMultiExchangePrices, ExchangePrices } from '@/hooks/useMultiExchangePrices';
import { WhaleFlowRadar, TokenFlow } from '@/components/WhaleFlowRadar';
import { TOP_100_COINS } from '@/config/top100Coins';
import { formatCryptoPrice, getDecimalsForPrice } from '@/lib/priceFormatter';
import { getTokenLogoUrl } from '@/config/tokenLogos';
import { MarketFilters, ExchangeFilter, SignalFilter, SortOption } from '@/components/dashboard/MarketFilters';
import { CoinTable } from '@/components/dashboard/CoinTable';
import { getCapTierAudit } from '@/lib/capTierEngine';
import { CapTierModalSection } from '@/components/dashboard/CapTierModalSection';
import { CapBadge } from '@/components/dashboard/CapBadge';

// High-fidelity crypto logos with official CDN avatar support and crisp vector SVG fallback
export const TokenIcon = ({ symbol, className = "w-7 h-7" }: { symbol: string; className?: string }) => {
  const [imgError, setImgError] = useState(false);
  const logoUrl = getTokenLogoUrl(symbol);

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={symbol}
        className={`${className} rounded-full object-contain bg-slate-900/80 p-0.5 border border-slate-700/60 shrink-0 inline-block`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  const s = symbol.toUpperCase();
  switch (s) {
    case 'BTC':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path d="M22.5 14.1c.3-2.1-1.3-3.3-3.5-4.1l.7-2.9-1.8-.4-.7 2.8c-.5-.1-.9-.2-1.4-.3l.7-2.9-1.8-.4-.7 2.9c-.4-.1-.8-.2-1.2-.3l-2.4-.6-.5 1.9s1.3.3 1.3.3c.7.2.9.7.8 1.1l-.8 3.3c.1 0 .1 0 .2.1l-.2-.1-1.2 4.7c-.1.2-.3.6-.8.5 0 0-1.3-.3-1.3-.3l-.9 2.1 2.3.6c.4.1.9.2 1.3.3l-.7 3 1.8.4.7-2.9c.5.1.9.2 1.4.3l-.7 2.9 1.8.4.7-2.9c2.4.5 4.2.3 5-1.9.6-1.8 0-2.8-1.3-3.5 1-.2 1.7-1 1.9-2.5zm-3.4 5.2c-.4 1.8-3.3.8-4.2.6l.8-3.1c.9.2 3.8.7 3.4 2.5zm.4-5.3c-.4 1.6-2.8.8-3.6.6l.7-2.8c.8.2 3.3.6 2.9 2.2z" fill="#FFF" />
        </svg>
      );
    case 'ETH':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#FFF">
            <path d="M16 4l-.2.8v15.3l.2.2 7.1-4.2L16 4z" fillOpacity=".6" />
            <path d="M16 4L8.9 16.1l7.1 4.2V4z" />
            <path d="M16 21.6l-.1.2v6.2l.1.3 7.1-9.9-7.1 3.2z" fillOpacity=".6" />
            <path d="M16 28.3v-6.7l-7.1-3.2 7.1 9.9z" />
            <path d="M16 20.3l7.1-4.2-7.1-3.2v7.4z" fillOpacity=".2" />
            <path d="M8.9 16.1l7.1 4.2v-7.4l-7.1 3.2z" fillOpacity=".6" />
          </g>
        </svg>
      );
    case 'SOL':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#141414" />
          <defs>
            <linearGradient id="solG1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
          <path d="M8 21.2a1 1 0 01.7-.3h14.6a.5.5 0 01.4.8l-2.4 2.4a1 1 0 01-.7.3H6a.5.5 0 01-.4-.8l2.4-2.4zm0-9.6a1 1 0 01.7-.3h14.6a.5.5 0 01.4.8l-2.4 2.4a1 1 0 01-.7.3H6a.5.5 0 01-.4-.8l2.4-2.4zm16-4.8a1 1 0 00-.7-.3H8.7a.5.5 0 00-.4.8l2.4 2.4a1 1 0 00.7.3h14.6a.5.5 0 00.4-.8l-2.4-2.4z" fill="url(#solG1)" />
        </svg>
      );
    case 'NEAR':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#000000" />
          <path d="M9.5 22.8c0 .2.2.4.4.2l7.7-11.4c.1-.2.4-.1.4.1v9.6c0 .3.2.5.5.5h1.2c.3 0 .5-.2.5-.5V8.5c0-.2-.2-.4-.4-.2L12.1 19.7c-.1.2-.4.1-.4-.1V10c0-.3-.2-.5-.5-.5h-1.2c-.3 0-.5.2-.5.5v12.8z" fill="#00EC97" />
        </svg>
      );
    case 'BNB':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
          <path d="M16 6.5l3.5 3.5-3.5 3.5-3.5-3.5L16 6.5zm-5 5l3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5zm10 0l3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5zM16 16.5l3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5zm-5 5l3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5zm10 0l3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5z" fill="#FFF" />
        </svg>
      );
    case 'XRP':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#23292F" />
          <path d="M23.5 8h2.3l-5.6 5.5-2.2-2.2L23.5 8zm-15 0h2.3l4.5 4.5-2.2 2.2L7.5 9.2V8zm12.7 16h2.3l-5.6-5.5-2.2 2.2 5.5 3.3zm-12.7 0h2.3l4.5-4.5-2.2-2.2-4.6 4.6V24z" fill="#FFF" />
        </svg>
      );
    case 'DOGE':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#C2A633" />
          <path d="M12 9h5c3.9 0 7 3.1 7 7s-3.1 7-7 7h-5V9zm4 11.5h1c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5h-1v9z" fill="#FFF" />
          <path d="M11 15h9v2h-9z" fill="#C2A633" />
        </svg>
      );
    case 'ADA':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#0033AD" />
          <circle cx="16" cy="16" r="4" fill="#FFF" />
          <circle cx="16" cy="8" r="1.5" fill="#FFF" />
          <circle cx="16" cy="24" r="1.5" fill="#FFF" />
          <circle cx="8" cy="16" r="1.5" fill="#FFF" />
          <circle cx="24" cy="16" r="1.5" fill="#FFF" />
        </svg>
      );
    case 'AVAX':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#E84142" />
          <path d="M16 7l8 14h-4.5l-3.5-6.5L12.5 21H8l8-14z" fill="#FFF" />
        </svg>
      );
    case 'SUI':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#2A82E4" />
          <path d="M16 6c-3 4-7 10-7 14 0 3.9 3.1 7 7 7s7-3.1 7-7c0-4-4-10-7-14z" fill="#FFF" />
        </svg>
      );
    case 'LINK':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#375BD2" />
          <path d="M16 7l7.5 4.3v8.7L16 24.3l-7.5-4.3v-8.7L16 7zm4.5 5.2L16 9.6l-4.5 2.6v5.2L16 20l4.5-2.6v-5.2z" fill="#FFF" />
        </svg>
      );
    case 'PEPE':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#4B9B3C" />
          <circle cx="12" cy="13" r="3" fill="#FFF" />
          <circle cx="20" cy="13" r="3" fill="#FFF" />
          <circle cx="12" cy="13" r="1.5" fill="#000" />
          <circle cx="20" cy="13" r="1.5" fill="#000" />
          <path d="M10 20c2 2 8 2 12 0" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'ARB':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#28A0F0" />
          <path d="M16 6.5l8.5 14.5-3 1.8L16 13.5l-5.5 9.3-3-1.8L16 6.5z" fill="#FFF" />
          <path d="M12.5 19.5L16 13.5l3.5 6h-7z" fill="#28A0F0" />
          <path d="M16 25.5l-4-2.3 1.5-2.5L16 22.2l2.5-1.5 1.5 2.5-4 2.3z" fill="#FFF" />
        </svg>
      );
    case 'APT':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#1C1E22" />
          <path d="M22 10.5H10L8 14h16l-2-3.5zm-1 5.5H11l-2 3.5h14l-2-3.5zm-1 5.5H12l-2 3.5h12l-2-3.5z" fill="#2ED8A7" />
          <circle cx="16" cy="7.5" r="1.5" fill="#2ED8A7" />
        </svg>
      );
    case 'OP':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF0420" />
          <circle cx="12" cy="16" r="4.5" stroke="#FFF" strokeWidth="2.5" fill="none" />
          <path d="M19 11.5h3.2c2.2 0 3.8 1.5 3.8 3.8s-1.6 3.8-3.8 3.8H21v3.4h-2V11.5zm2 5.6h1.2c1 0 1.8-.7 1.8-1.8s-.8-1.8-1.8-1.8H21v3.6z" fill="#FFF" />
        </svg>
      );
    case 'RAY':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#1A1C30" />
          <path d="M16 7l8 14H8l8-14z" stroke="#37B7FF" strokeWidth="2" fill="none" />
          <circle cx="16" cy="16" r="3.5" fill="#C035FF" />
          <path d="M16 11l4 7h-8l4-7z" fill="#28D294" />
        </svg>
      );
    case 'ENS':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#5298FF" />
          <path d="M16 8l7 4.5v7L16 24l-7-4.5v-7L16 8z" fill="#FFF" fillOpacity=".3" />
          <path d="M16 10l5 3.2v5.6L16 22l-5-3.2v-5.6L16 10z" fill="#FFF" />
          <path d="M16 13l2.5 1.6v3.2L16 19.4l-2.5-1.6v-3.2L16 13z" fill="#5298FF" />
        </svg>
      );
    case 'XPL':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="16" fill="#0D111A" />
          <path d="M9 9l14 14M23 9L9 23" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3" fill="#A855F7" />
        </svg>
      );
    default:
      return (
        <div className={`${className} rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-[10px] text-cyan-300 border border-slate-600/60 shadow-sm shrink-0`}>
          {symbol.slice(0, 3)}
        </div>
      );
  }
};

export interface TokenItem {
  id: string;
  symbol: string;
  name: string;
  category: string;
  basePrice: number;
  priceChange24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  rsi: number;
  whaleInflowUSD: number;
  whaleOutflowUSD: number;
  netWhaleFlow: number;
  spotScore: number;
  status: 'BUY_SPOT' | 'AVOID';
  statusLabel: string;
  confidence: number;
  reasons: string[];
  risks: string[];
  entryTarget: string;
  stopLoss: string;
  takeProfit: string;
  binancePrice?: number;
  okxPrice?: number;
  coinbasePrice?: number;
  dexPrice?: number;
  globalAvgPrice?: number;
  spreadPct?: number;
}

const LIVE_WHALE_ALERTS = [
  { id: 1, type: 'OUTFLOW', text: '5,400 BTC ($472M) rút từ Binance -> Ví lạnh ẩn danh', time: '1 phút trước', coin: 'BTC' },
  { id: 2, type: 'INFLOW', text: '18,500,000 ARB ($13.7M) nạp từ ví cá mập -> OKX (Cảnh báo xả)', time: '3 phút trước', coin: 'ARB' },
  { id: 3, type: 'OUTFLOW', text: '8,200,000 NEAR ($56.1M) rút từ Coinbase -> Ví Staking NEAR', time: '6 phút trước', coin: 'NEAR' },
  { id: 4, type: 'INFLOW', text: '2,400,000 RAY ($13.5M) nạp lên Bybit (Nguy cơ chốt lời)', time: '9 phút trước', coin: 'RAY' },
  { id: 5, type: 'OUTFLOW', text: '42,000 ETH ($131M) rút khỏi Kraken -> Lido / Cold Storage', time: '11 phút trước', coin: 'ETH' },
  { id: 6, type: 'INFLOW', text: '14,000,000 XPL ($19.8M) vừa nạp lên KuCoin (Áp lực bán mạnh)', time: '14 phút trước', coin: 'XPL' }
];

export default function App() {
  const [tokens, setTokens] = useState<TokenItem[]>(TOP_100_COINS);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeFilter>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<SignalFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('SPOT_SCORE');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [tableScope, setTableScope] = useState<number>(25); // 10 | 25 | 50 | 100
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [priceFlashMap, setPriceFlashMap] = useState<Record<string, 'up' | 'down'>>({});
  const [autoLiveFeed, setAutoLiveFeed] = useState(true);

  // Hook kết nối API Đa Nguồn (Multi-Exchange Aggregator Engine)
  const { prices: multiPrices, loading: multiLoading, lastUpdated, refreshPrices } = useMultiExchangePrices();

  // Đồng bộ hoá giá từ Đa Sàn vào tokens state
  useEffect(() => {
    if (!multiPrices || Object.keys(multiPrices).length === 0) return;

    setTokens((prev) =>
      prev.map((token) => {
        const key = token.symbol.toLowerCase();
        const p = multiPrices[key];
        if (!p) return token;

        const net = +(token.whaleOutflowUSD - token.whaleInflowUSD).toFixed(1);
        const isAccumulating = net >= 0;

        return {
          ...token,
          basePrice: p.globalAvg || token.basePrice,
          binancePrice: p.binance || token.basePrice,
          okxPrice: p.okx,
          coinbasePrice: p.coinbase,
          dexPrice: p.dexAvg,
          globalAvgPrice: p.globalAvg,
          spreadPct: p.spreadPct,
          priceChange24h: p.change24h !== 0 ? p.change24h : token.priceChange24h,
          status: isAccumulating ? 'BUY_SPOT' : 'AVOID',
          statusLabel: isAccumulating
            ? (token.spotScore >= 85 ? 'TOP SPOT MUA NGAY' : 'TÍCH LŨY SPOT')
            : (token.rsi > 70 ? 'CẢNH BÁO QUÁ MUA' : 'CẢNH BÁO NÉ SPOT'),
        };
      })
    );
  }, [multiPrices]);

  // Giữ cho modal tự động cập nhật token mới nhất khi giá nhảy
  useEffect(() => {
    if (selectedToken) {
      const refreshed = tokens.find((t) => t.id === selectedToken.id);
      if (refreshed) {
        setSelectedToken(refreshed);
      }
    }
  }, [tokens, selectedToken?.id]);

  useEffect(() => {
    if (!autoLiveFeed) return;

    // Simulate high-frequency tick updates with green/red flash effects
    const interval = setInterval(() => {
      setTokens((prev) => {
        const count = Math.floor(Math.random() * 3) + 2;
        const indicesToUpdate = new Set<number>();
        while (indicesToUpdate.size < count) {
          indicesToUpdate.add(Math.floor(Math.random() * prev.length));
        }

        const newFlashes: Record<string, 'up' | 'down'> = {};
        const nextTokens = prev.map((token, idx) => {
          if (!indicesToUpdate.has(idx)) return token;

          const pct = (Math.random() * 0.7 - 0.35) / 100;
          const decimals = getDecimalsForPrice(token.basePrice);
          const newPrice = Math.max(0.00000001, token.basePrice * (1 + pct));
          const direction: 'up' | 'down' = newPrice >= token.basePrice ? 'up' : 'down';
          newFlashes[token.symbol] = direction;

          const deltaFlow = (Math.random() * 1.8 - 0.9);
          const newOutflow = Math.max(0.1, +(token.whaleOutflowUSD + (direction === 'up' ? Math.abs(deltaFlow) : -Math.abs(deltaFlow) * 0.5)).toFixed(1));
          const newInflow = Math.max(0.1, +(token.whaleInflowUSD + (direction === 'down' ? Math.abs(deltaFlow) : -Math.abs(deltaFlow) * 0.5)).toFixed(1));
          const newNet = +(newOutflow - newInflow).toFixed(1);

          const sym = token.symbol.toLowerCase();
          const isHighArbitrage = ['ray', 'xpl', 'arb', 'op', 'ens', 'pepe', 'wif', 'bonk', 'floki', 'jup', 'sui', 'apt', 'pendle', 'fet', 'render'].includes(sym);
          const okxRatio = isHighArbitrage ? 1.0018 : 1.0002;
          const coinbaseRatio = isHighArbitrage ? 1.0028 : 1.0006;
          const dexRatio = isHighArbitrage ? 0.9955 : 0.9992;

          const newBinance = token.binancePrice ? Number((token.binancePrice * (1 + pct)).toFixed(decimals)) : newPrice;
          const newOkx = Number((newBinance * okxRatio).toFixed(decimals));
          const newCoinbase = Number((newBinance * coinbaseRatio).toFixed(decimals));
          const newDex = Number((newBinance * dexRatio).toFixed(decimals));
          const newGlobal = Number(newPrice.toFixed(decimals));

          const minEx = Math.min(newBinance, newOkx, newCoinbase, newDex);
          const maxEx = Math.max(newBinance, newOkx, newCoinbase, newDex);
          const newSpread = minEx > 0 ? +(((maxEx - minEx) / minEx) * 100).toFixed(2) : (token.spreadPct ?? 0.14);

          return {
            ...token,
            basePrice: newPrice,
            binancePrice: newBinance,
            okxPrice: newOkx,
            coinbasePrice: newCoinbase,
            dexPrice: newDex,
            globalAvgPrice: newGlobal,
            spreadPct: newSpread,
            whaleOutflowUSD: newOutflow,
            whaleInflowUSD: newInflow,
            netWhaleFlow: newNet,
            spotScore: Math.min(99, Math.max(5, Math.round(token.spotScore + (direction === 'up' ? 0.3 : -0.3))))
          };
        });

        setPriceFlashMap((prevFlashes) => ({ ...prevFlashes, ...newFlashes }));

        setTimeout(() => {
          setPriceFlashMap({});
        }, 850);

        return nextTokens;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [autoLiveFeed]);

  // TOP 10 SPOT BUYS TODAY - Xếp hạng 10 đồng có Spot Score cao nhất
  const topBuys = useMemo(() => {
    return [...tokens]
      .filter((t) => t.status === 'BUY_SPOT')
      .sort((a, b) => b.spotScore - a.spotScore);
  }, [tokens]);

  // AVOID / HIGH RISK TODAY - Xếp hạng 10 đồng có rủi ro xả / quá mua cao nhất
  const topAvoids = useMemo(() => {
    return [...tokens]
      .filter((t) => t.status === 'AVOID')
      .sort((a, b) => a.spotScore - b.spotScore);
  }, [tokens]);

  const buyCount = useMemo(() => tokens.filter((t) => t.status === 'BUY_SPOT').length, [tokens]);
  const avoidCount = useMemo(() => tokens.filter((t) => t.status === 'AVOID').length, [tokens]);
  const highSpreadCount = useMemo(() => tokens.filter((t) => (t.spreadPct ?? 0.12) >= 0.35).length, [tokens]);

  // Lọc bảng Screener đa chiều
  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      // Filter theo Tín hiệu Spot (Tầng 2)
      if (selectedSignal === 'BUY_SPOT' && t.status !== 'BUY_SPOT') return false;
      if (selectedSignal === 'AVOID_DUMP' && t.status !== 'AVOID') return false;
      if (selectedSignal === 'HIGH_SPREAD' && (t.spreadPct ?? 0.12) < 0.35) return false;

      // Filter theo Hệ sinh thái (Tầng 3)
      if (selectedCategory !== 'ALL' && !t.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let diff = 0;
      if (sortBy === 'SPOT_SCORE') {
        diff = b.spotScore - a.spotScore;
      } else if (sortBy === 'NET_FLOW') {
        diff = b.netWhaleFlow - a.netWhaleFlow;
      } else if (sortBy === 'PRICE_CHANGE') {
        diff = b.priceChange24h - a.priceChange24h;
      } else if (sortBy === 'SPREAD') {
        diff = (b.spreadPct ?? 0.12) - (a.spreadPct ?? 0.12);
      }
      return sortDirection === 'desc' ? diff : -diff;
    });
  }, [tokens, selectedSignal, selectedCategory, searchQuery, sortBy, sortDirection]);

  // Phân trang cho bảng
  const totalPages = Math.max(1, Math.ceil(filteredTokens.length / tableScope));
  const paginatedTokens = useMemo(() => {
    const start = (currentPage - 1) * tableScope;
    return filteredTokens.slice(start, start + tableScope);
  }, [filteredTokens, currentPage, tableScope]);

  // Reset page về 1 khi đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSignal, selectedExchange, selectedCategory, searchQuery, tableScope]);

  // Chuyển đổi danh sách tokens sang format TokenFlow của WhaleFlowRadar
  const tokenFlowList: TokenFlow[] = useMemo(() => {
    return tokens.map((t) => ({
      symbol: t.symbol,
      name: t.name,
      inflowUsd: t.whaleInflowUSD * 1_000_000,
      outflowUsd: t.whaleOutflowUSD * 1_000_000,
      binancePrice: t.binancePrice || t.basePrice,
      globalAvgPrice: t.globalAvgPrice || t.basePrice,
      spreadPct: t.spreadPct,
      category: t.category,
      spotScore: t.spotScore,
    }));
  }, [tokens]);

  // Aggregate Whale Market Pressure Stats
  const aggregateFlow = useMemo(() => {
    const totalInflow = tokens.reduce((acc, c) => acc + c.whaleInflowUSD, 0);
    const totalOutflow = tokens.reduce((acc, c) => acc + c.whaleOutflowUSD, 0);
    const net = totalOutflow - totalInflow;
    const totalVol = totalInflow + totalOutflow;
    const outflowRatio = Math.round((totalOutflow / totalVol) * 100);
    const inflowRatio = 100 - outflowRatio;
    return { totalInflow, totalOutflow, net, outflowRatio, inflowRatio };
  }, [tokens]);

  const formatUSD = (val: number) => {
    return formatCryptoPrice(val);
  };

  const handleSelectTokenSymbol = useCallback((symbol: string) => {
    const found = tokens.find((t) => t.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      setSelectedToken(found);
    }
  }, [tokens]);

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Cyberpunk Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="border-b border-slate-800/80 bg-[#090D18]/90 backdrop-blur-xl sticky top-0 z-40">
          {/* Top Marquee Alert Banner */}
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-emerald-950/40 border-b border-slate-800/60 py-1.5 px-4 overflow-hidden text-xs">
            <div className="w-full max-w-[1780px] mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="tracking-wider uppercase text-[11px]">WHALE PULSE LIVE FEED</span>
              </div>
              <div className="flex-1 overflow-hidden whitespace-nowrap">
                <div className="inline-flex gap-8 animate-marquee">
                  {LIVE_WHALE_ALERTS.map((alert) => (
                    <div key={alert.id} className="inline-flex items-center gap-2 text-slate-300">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        alert.type === 'OUTFLOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {alert.type === 'OUTFLOW' ? 'RÚT VÍ TÍCH LŨY' : 'NẠP SÀN CẢNH BÁO'}
                      </span>
                      <span>{alert.text}</span>
                      <span className="text-slate-500 text-[10px]">({alert.time})</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshPrices()}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-colors"
                  title="Cập nhật lại giá đa sàn ngay lập tức"
                >
                  <RefreshCw className={`w-3 h-3 ${multiLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  Đa Sàn
                </button>
                <button
                  onClick={() => setAutoLiveFeed(!autoLiveFeed)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                    autoLiveFeed ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' : 'border-slate-700 text-slate-400'
                  }`}
                  title="Bật/Tắt cập nhật Realtime liên tục"
                >
                  <Activity className={`w-3 h-3 ${autoLiveFeed ? 'animate-pulse text-cyan-400' : ''}`} />
                  {autoLiveFeed ? 'Live 60fps' : 'Tạm dừng'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Navigation Bar */}
          <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0B0F1D] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    WHALEPULSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 font-extrabold">RADAR</span>
                  </h1>
                  <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 tracking-wider">
                    TOP 100 CRYPTO 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Radar Dòng Tiền Cá Mập On-Chain & Đối Soát Giá Đa Sàn (Top 100 Đồng Coin Mạnh Nhất)
                </p>
              </div>
            </div>

            {/* Quick Status Bar on Desktop */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Độ phủ:</span>
                <span className="text-cyan-400 font-bold">100 Đồng Coin Lớn Nhất</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Tỷ lệ thị trường:</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {aggregateFlow.outflowRatio}% Gom
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-rose-400 font-bold flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" /> {aggregateFlow.inflowRatio}% Xả
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400">Net Whale Flow:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  +${aggregateFlow.net.toFixed(1)}M USD (Tích lũy ròng)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Status Bar on Mobile (Sáng đẹp, đầy đủ thông tin dòng tiền) */}
          <div className="flex md:hidden items-center justify-between gap-1.5 px-4 pb-2.5 pt-1 text-[11px] overflow-x-auto scrollbar-none border-t border-slate-800/40">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold text-cyan-300">100 Coin</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-bold shrink-0">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" /> {aggregateFlow.outflowRatio}% Gom
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 font-bold shrink-0">
              <ArrowDownRight className="w-3 h-3 text-rose-400" /> {aggregateFlow.inflowRatio}% Xả
            </div>
            <div className="px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 font-mono font-bold text-emerald-400 shrink-0">
              +${aggregateFlow.net.toFixed(0)}M Net
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
          {/* TOP 10 SPOT BUYS TODAY vs TOP 10 AVOID / HIGH RISK TODAY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* COLUMN 1: TOP 10 SPOT BUYS TODAY */}
            <div className="relative rounded-2xl bg-gradient-to-b from-emerald-950/20 via-slate-900/60 to-slate-950 border border-emerald-500/30 p-4 sm:p-5 shadow-xl shadow-emerald-950/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-emerald-500/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                      TOP SPOT BUYS TODAY
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        TOP 10 ĐỒNG
                      </span>
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-emerald-400/80">Xếp hạng 10 đồng gom hàng mạnh nhất, RSI đệm tăng trưởng</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60 self-start sm:self-auto shrink-0">
                  XÁC SUẤT TĂNG CAO
                </span>
              </div>

              {/* 10 Top Buys Cards List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {topBuys.slice(0, 10).map((coin, index) => {
                  const flash = priceFlashMap[coin.symbol];
                  return (
                    <div
                      key={coin.id}
                      onClick={() => setSelectedToken(coin)}
                      className="group cursor-pointer rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-emerald-900/40 hover:border-emerald-500/60 p-3 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/40 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center border ${
                            index < 3
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                          }`}>
                            #{index + 1}
                          </span>
                          <TokenIcon symbol={coin.symbol} className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs sm:text-sm">
                              {coin.name}
                            </span>
                            <span className="text-xs font-mono text-slate-400">({coin.symbol})</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {coin.category}
                            </span>
                            <CapBadge symbol={coin.symbol} />
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-emerald-400 font-mono font-medium">
                              Rút ví: +${coin.whaleOutflowUSD}M
                            </span>
                            <span>•</span>
                            <span>RSI: {coin.rsi}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-mono font-bold text-xs sm:text-sm transition-all duration-300 ${
                          flash === 'up'
                            ? 'text-emerald-300 bg-emerald-500/20 px-1.5 rounded'
                            : flash === 'down'
                            ? 'text-rose-300 bg-rose-500/20 px-1.5 rounded'
                            : 'text-slate-100'
                        }`}>
                          {formatUSD(coin.basePrice)}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
                            +{coin.priceChange24h}%
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                            Score {coin.spotScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: TOP 10 AVOID / HIGH RISK TODAY */}
            <div className="relative rounded-2xl bg-gradient-to-b from-rose-950/20 via-slate-900/60 to-slate-950 border border-rose-500/30 p-4 sm:p-5 shadow-xl shadow-rose-950/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-rose-500/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                      AVOID / HIGH RISK TODAY
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                        TOP 10 ĐỒNG
                      </span>
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-rose-400/80">Cảnh báo xả lên sàn CEX, mở khóa unlock, quá mua FOMO</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800/60 self-start sm:self-auto shrink-0">
                  RỦI RO ĐU ĐỈNH CAO
                </span>
              </div>

              {/* 10 Avoid Cards List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {topAvoids.slice(0, 10).map((coin, index) => {
                  const flash = priceFlashMap[coin.symbol];
                  return (
                    <div
                      key={coin.id}
                      onClick={() => setSelectedToken(coin)}
                      className="group cursor-pointer rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-rose-900/40 hover:border-rose-500/60 p-3 transition-all duration-200 hover:shadow-lg hover:shadow-rose-950/40 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-950 text-rose-300 font-bold text-[10px] flex items-center justify-center border border-rose-600/50">
                            #{index + 1}
                          </span>
                          <TokenIcon symbol={coin.symbol} className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-rose-300 transition-colors text-xs sm:text-sm">
                              {coin.name}
                            </span>
                            <span className="text-xs font-mono text-slate-400">({coin.symbol})</span>
                            <span className="bg-rose-500/20 text-rose-400 text-[9px] px-1.5 py-0.2 rounded border border-rose-500/30 font-bold">
                              {coin.statusLabel.slice(0, 16)}
                            </span>
                            <CapBadge symbol={coin.symbol} />
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-rose-400 font-mono font-medium">
                              Nạp xả: -${coin.whaleInflowUSD}M
                            </span>
                            <span>•</span>
                            <span className={coin.rsi > 70 ? 'text-amber-400 font-bold' : ''}>
                              RSI: {coin.rsi}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-mono font-bold text-xs sm:text-sm transition-all duration-300 ${
                          flash === 'up'
                            ? 'text-emerald-300 bg-emerald-500/20 px-1.5 rounded'
                            : flash === 'down'
                            ? 'text-rose-300 bg-rose-500/20 px-1.5 rounded'
                            : 'text-slate-100'
                        }`}>
                          {formatUSD(coin.basePrice)}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className={`text-[11px] font-semibold flex items-center ${
                            coin.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {coin.priceChange24h >= 0 ? `+${coin.priceChange24h}%` : `${coin.priceChange24h}%`}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                            Score {coin.spotScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DEDICATED WHALE FLOW RADAR WITH TOP 100 COINS CAPABILITY */}
          <WhaleFlowRadar
            tokens={tokenFlowList}
            onSelectToken={handleSelectTokenSymbol}
          />

          {/* BỘ LỌC ĐA CHIỀU (ADVANCED MULTI-DIMENSION FILTER BAR) */}
          <MarketFilters
            selectedExchange={selectedExchange}
            setSelectedExchange={setSelectedExchange}
            selectedSignal={selectedSignal}
            setSelectedSignal={setSelectedSignal}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            tableScope={tableScope}
            setTableScope={setTableScope}
            totalCount={tokens.length}
            filteredCount={filteredTokens.length}
            buyCount={buyCount}
            avoidCount={avoidCount}
            highSpreadCount={highSpreadCount}
          />

                      {/* MA TRẬN ĐỐI CHIẾU GIÁ ĐA SÀN (MULTI-EXCHANGE PRICING MATRIX TABLE) */}
          <CoinTable
            tokens={paginatedTokens}
            selectedExchange={selectedExchange}
            priceFlashMap={priceFlashMap}
            onSelectToken={setSelectedToken}
            formatUSD={formatUSD}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTokens.length}
            tableScope={tableScope}
          />
        </main>

        {/* MODAL AUDIT CHI TIẾT ĐÀO SÂU */}
        {selectedToken && (() => {
          const livePrice = selectedToken.globalAvgPrice || selectedToken.basePrice || selectedToken.binancePrice || 1;
          const isBuy = selectedToken.status === 'BUY_SPOT';
          const decimals = getDecimalsForPrice(livePrice);

          // Đối soát giá 5 nền tảng Realtime chuẩn (Binance, OKX, Coinbase, DEX & VWAP)
          const modalBinancePrice = selectedToken.binancePrice || livePrice;
          const modalOkxPrice = selectedToken.okxPrice || Number((livePrice * 1.0002).toFixed(decimals));
          const modalCoinbasePrice = selectedToken.coinbasePrice || Number((livePrice * 1.0006).toFixed(decimals));
          const modalDexPrice = selectedToken.dexPrice || Number((livePrice * 0.9992).toFixed(decimals));
          const modalGlobalPrice = selectedToken.globalAvgPrice || livePrice;

          const minEx = Math.min(modalBinancePrice, modalOkxPrice, modalCoinbasePrice, modalDexPrice, modalGlobalPrice);
          const maxEx = Math.max(modalBinancePrice, modalOkxPrice, modalCoinbasePrice, modalDexPrice, modalGlobalPrice);
          const modalSpreadPct = minEx > 0 ? +(((maxEx - minEx) / minEx) * 100).toFixed(2) : (selectedToken.spreadPct ?? 0.12);

          // Dynamic Trading Plan targets based on live market price
          const dynamicEntryTarget = isBuy
            ? `${formatUSD(livePrice * 0.985)} - ${formatUSD(livePrice * 1.008)}`
            : `CHỜ VÙNG HỖ TRỢ (${formatUSD(livePrice * 0.90)})`;

          const dynamicStopLoss = isBuy
            ? `${formatUSD(livePrice * 0.935)} (-6.5%)`
            : 'N/A (Đang rủi ro cao)';

          const dynamicTakeProfit = isBuy
            ? `${formatUSD(livePrice * 1.15)} - ${formatUSD(livePrice * 1.28)} (+15% ~ +28%)`
            : 'N/A (Đứng ngoài)';

          // Tính toán kiểm tra phân khúc Vốn Hóa & Độ sâu thanh khoản
          const capAudit = getCapTierAudit({
            symbol: selectedToken.symbol,
            name: selectedToken.name,
            basePrice: livePrice,
            globalAvgPrice: modalGlobalPrice,
          });

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
              <div
                className="relative w-full max-w-2xl bg-[#0B0F1D] border border-slate-700/80 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Close Button */}
                <button
                  onClick={() => setSelectedToken(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                  <TokenIcon symbol={selectedToken.symbol} className="w-12 h-12" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-white">{selectedToken.name}</h3>
                      <span className="text-sm font-mono text-slate-400 font-bold">({selectedToken.symbol})</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-bold border ${
                        selectedToken.status === 'BUY_SPOT'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {selectedToken.statusLabel}
                      </span>
                      <CapBadge symbol={selectedToken.symbol} showDetails={true} />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-1 flex-wrap">
                      <span>Giá bình quân: <strong className="text-white text-sm">{formatUSD(modalGlobalPrice)}</strong></span>
                      <span>24h Change: <strong className={selectedToken.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {selectedToken.priceChange24h >= 0 ? `+${selectedToken.priceChange24h}%` : `${selectedToken.priceChange24h}%`}
                      </strong></span>
                      <span>Độ tin cậy: <strong className="text-cyan-400">{selectedToken.confidence}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* BẢNG ĐỐI SOÁT GIÁ ĐA SÀN & CHÊNH LỆCH SPREAD */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" /> Bảng Đối Soát Giá Đa Sàn (Binance, Coinbase, DEX & VWAP)
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Spread: <strong className="text-cyan-400">{modalSpreadPct}%</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Binance CEX</span>
                      <span className="font-bold text-white text-xs sm:text-sm">{formatUSD(modalBinancePrice)}</span>
                      <span className="text-[9px] text-emerald-400 block mt-0.5">Khớp lệnh nhanh nhất</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">OKX / Bybit</span>
                      <span className="font-bold text-slate-200 text-xs sm:text-sm">{formatUSD(modalOkxPrice)}</span>
                      <span className="text-[9px] text-indigo-400 block mt-0.5">Thị trường Châu Á</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Coinbase Pro</span>
                      <span className="font-bold text-slate-200 text-xs sm:text-sm">{formatUSD(modalCoinbasePrice)}</span>
                      <span className="text-[9px] text-blue-400 block mt-0.5">Thanh khoản US</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">DEX Bể On-chain</span>
                      <span className="font-bold text-slate-200 text-xs sm:text-sm">{formatUSD(modalDexPrice)}</span>
                      <span className="text-[9px] text-cyan-400 block mt-0.5">Raydium / Uniswap</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-500/30 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-cyan-400 block uppercase font-bold">Bình Quân Toàn Cầu</span>
                      <span className="font-bold text-cyan-300 text-xs sm:text-sm">{formatUSD(modalGlobalPrice)}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">CoinGecko VWAP</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    *Đối soát chéo đa sàn loại bỏ độ lệch giá đơn lẻ, giúp xác định chuẩn xác vùng giá gom/xả và hạn chế trượt giá (Slippage).
                  </p>
                </div>

                {/* PHÂN TÍCH PHÂN KHÚC VỐN HÓA & ĐỘ SÂU THANH KHOẢN (CAP AUDIT) */}
                <CapTierModalSection audit={capAudit} tokenSymbol={selectedToken.symbol} />

                {/* DUAL-SIDED AUDIT COMPARISON METER IN MODAL */}
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5">
                      <ArrowDownRight className="w-4 h-4" /> NẠP SÀN CẢNH BÁO XẢ: ${selectedToken.whaleInflowUSD}M
                    </span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      RÚT VÍ TÍCH LŨY: ${selectedToken.whaleOutflowUSD}M <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Meter visual */}
                  {(() => {
                    const total = selectedToken.whaleInflowUSD + selectedToken.whaleOutflowUSD;
                    const inPct = total > 0 ? Math.round((selectedToken.whaleInflowUSD / total) * 100) : 50;
                    const outPct = 100 - inPct;
                    return (
                      <div className="h-5 w-full bg-slate-950 rounded-full flex overflow-hidden border border-slate-700 p-0.5">
                        <div
                          style={{ width: `${inPct}%` }}
                          className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-l-full flex items-center justify-start pl-2 text-[10px] font-bold text-white"
                        >
                          {inPct}%
                        </div>
                        <div className="w-0.5 h-full bg-white" />
                        <div
                          style={{ width: `${outPct}%` }}
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-r-full flex items-center justify-end pr-2 text-[10px] font-bold text-slate-950"
                        >
                          {outPct}%
                        </div>
                      </div>
                    );
                  })()}

                  <div className="text-[11px] text-slate-400 text-center font-mono">
                    Chênh lệch dòng tiền: <strong className={selectedToken.netWhaleFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {selectedToken.netWhaleFlow >= 0 ? `+${selectedToken.netWhaleFlow}M USD Rút ví tích lũy` : `${selectedToken.netWhaleFlow}M USD Nạp lên sàn chuẩn bị xả`}
                    </strong>
                  </div>
                </div>

                {/* WHY BUY OR AVOID - Detailed Checkpoints */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Phân tích lý do & Dữ liệu On-chain
                  </h4>
                  <div className="space-y-2">
                    {selectedToken.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
                      >
                        {selectedToken.status === 'BUY_SPOT' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trading Plan Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 text-[10px] block uppercase">Vùng Mua Khuyến Nghị</span>
                    <span className="font-bold text-cyan-300 text-sm">{dynamicEntryTarget}</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 text-[10px] block uppercase">Dừng Lỗ (Stop-Loss)</span>
                    <span className="font-bold text-rose-400 text-sm">{dynamicStopLoss}</span>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-slate-400 text-[10px] block uppercase">Mục Tiêu Chốt Lời</span>
                    <span className="font-bold text-emerald-400 text-sm">{dynamicTakeProfit}</span>
                  </div>
                </div>

                {/* Modal Footer actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-500">Đối soát chéo: Binance Stream, CoinGecko & On-chain Whale Data</span>
                  <button
                    onClick={() => setSelectedToken(null)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
                  >
                    Đóng chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* FOOTER */}
        <footer className="border-t border-slate-800/80 bg-[#070A12] py-5 px-4 text-center text-xs text-slate-500">
          <div className="w-full max-w-[1780px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>WhalePulse Crypto Radar v2.7 • Đối soát chéo Top 100 Đồng Coin Lớn Nhất Thị Trường</span>
            </div>
            <p className="text-slate-600">
              *Tuyên bố miễn trừ: Thông tin on-chain mang tính chất tham khảo kỹ thuật, không phải lời khuyên đầu tư tài chính.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
