"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Layers,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Building2,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { getTokenLogoUrl } from '@/config/tokenLogos';
import { formatCryptoPrice } from '@/lib/priceFormatter';

export interface EtfFundBreakdown {
  ticker: string;
  issuer: string;
  name: string;
  flowUsdMillions: number;
}

export interface EtfFlowItem {
  symbol: string;
  name: string;
  netFlowMillions: number;
  netFlowFormatted: string;
  direction: 'inflow' | 'outflow' | 'neutral';
  statusText: string;
  etfStatus: 'APPROVED' | 'TRUST_ETP' | 'PENDING_SEC' | 'NO_ETF';
  custodian: string;
  primaryIssuers: string[];
  fundBreakdown?: EtfFundBreakdown[];
  binancePrice?: number;
  coinbasePrice?: number;
  okxPrice?: number;
  spreadPct?: number;
  priceChange24h?: number;
  volume24hUsd?: number;
  highlightedInImage: boolean;
}

export interface EtfFlowApiResponse {
  success: boolean;
  timestamp: number;
  dateStr: string;
  summary: {
    totalNetInflowUSD: number;
    totalNetInflowMillions: number;
    totalNetInflowVNDBillions: number;
    totalInflowMillions: number;
    totalOutflowMillions: number;
    inflowCount: number;
    outflowCount: number;
    neutralCount: number;
    sentiment: 'BULLISH_INFLOW' | 'MODERATE_INFLOW' | 'OUTFLOW_PRESSURE';
  };
  items: EtfFlowItem[];
  sources: string[];
}

interface EtfFlowTrackerProps {
  onSelectToken?: (symbol: string) => void;
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * Biểu tượng Quốc kỳ Mỹ chuẩn SVG (Đảm bảo luôn hiển thị đẹp trên mọi hệ điều hành Windows, không bị biến thành chữ 'US')
 */
function UsFlagIcon({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={`${className} inline-block rounded-[2px] shadow-sm shrink-0`} fill="none">
      <path fill="#bd3d44" d="M0 0h640v480H0z"/>
      <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
      <path fill="#192f5d" d="M0 0h256v258.5H0z"/>
      <g fill="#fff">
        <circle cx="32" cy="26" r="4.5" />
        <circle cx="74" cy="26" r="4.5" />
        <circle cx="116" cy="26" r="4.5" />
        <circle cx="158" cy="26" r="4.5" />
        <circle cx="200" cy="26" r="4.5" />
        <circle cx="242" cy="26" r="4.5" />
        <circle cx="53" cy="52" r="4.5" />
        <circle cx="95" cy="52" r="4.5" />
        <circle cx="137" cy="52" r="4.5" />
        <circle cx="179" cy="52" r="4.5" />
        <circle cx="221" cy="52" r="4.5" />
        <circle cx="32" cy="78" r="4.5" />
        <circle cx="74" cy="78" r="4.5" />
        <circle cx="116" cy="78" r="4.5" />
        <circle cx="158" cy="78" r="4.5" />
        <circle cx="200" cy="78" r="4.5" />
        <circle cx="242" cy="78" r="4.5" />
        <circle cx="53" cy="104" r="4.5" />
        <circle cx="95" cy="104" r="4.5" />
        <circle cx="137" cy="104" r="4.5" />
        <circle cx="179" cy="104" r="4.5" />
        <circle cx="221" cy="104" r="4.5" />
        <circle cx="32" cy="130" r="4.5" />
        <circle cx="74" cy="130" r="4.5" />
        <circle cx="116" cy="130" r="4.5" />
        <circle cx="158" cy="130" r="4.5" />
        <circle cx="200" cy="130" r="4.5" />
        <circle cx="242" cy="130" r="4.5" />
        <circle cx="53" cy="156" r="4.5" />
        <circle cx="95" cy="156" r="4.5" />
        <circle cx="137" cy="156" r="4.5" />
        <circle cx="179" cy="156" r="4.5" />
        <circle cx="221" cy="156" r="4.5" />
        <circle cx="32" cy="182" r="4.5" />
        <circle cx="74" cy="182" r="4.5" />
        <circle cx="116" cy="182" r="4.5" />
        <circle cx="158" cy="182" r="4.5" />
        <circle cx="200" cy="182" r="4.5" />
        <circle cx="242" cy="182" r="4.5" />
        <circle cx="53" cy="208" r="4.5" />
        <circle cx="95" cy="208" r="4.5" />
        <circle cx="137" cy="208" r="4.5" />
        <circle cx="179" cy="208" r="4.5" />
        <circle cx="221" cy="208" r="4.5" />
        <circle cx="32" cy="234" r="4.5" />
        <circle cx="74" cy="234" r="4.5" />
        <circle cx="116" cy="234" r="4.5" />
        <circle cx="158" cy="234" r="4.5" />
        <circle cx="200" cy="234" r="4.5" />
        <circle cx="242" cy="234" r="4.5" />
      </g>
    </svg>
  );
}

/**
 * Biểu tượng Target Đỏ vòng tròn đồng tâm (Chuẩn 100% như ảnh người dùng chụp cho Outflow -SOL, -ZEC)
 */
function TargetNegativeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none">
      <circle cx="12" cy="12" r="10" stroke="#f43f5e" strokeWidth="1.6" strokeOpacity="0.45" />
      <circle cx="12" cy="12" r="7.5" stroke="#fb7185" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" fill="#f43f5e" />
    </svg>
  );
}

/**
 * Biểu tượng Chấm Xanh Glowing (Chuẩn 100% như emoji 🟢 trong ảnh người dùng chụp)
 */
function InflowGreenIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none">
      <circle cx="12" cy="12" r="10" fill="#10b981" fillOpacity="0.2" />
      <circle cx="12" cy="12" r="7" stroke="#34d399" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" fill="#10b981" />
    </svg>
  );
}

/**
 * Format số tiền ròng chuẩn theo ảnh (e.g. 175.6, 24.8, 0, -1.0, -5.2)
 */
function formatNetFlowNumber(val: number): string {
  if (val === 0) return '0';
  if (Number.isInteger(val)) return val.toFixed(1);
  return String(val);
}

function EtfFlowTrackerComponent({
  onSelectToken,
  className = '',
  defaultExpanded = true,
}: EtfFlowTrackerProps) {
  const [data, setData] = useState<EtfFlowApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [viewMode, setViewMode] = useState<'BOT_FEED' | 'DETAILED_CARDS'>('BOT_FEED');
  const [filterScope, setFilterScope] = useState<'ALL' | 'IMAGE_ONLY' | 'INFLOW' | 'OUTFLOW'>('IMAGE_ONLY');
  const [copied, setCopied] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<EtfFlowItem | null>(null);

  // Gọi API /api/etf-flows
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      const res = await fetch('/api/etf-flows', { cache: 'no-store' });
      if (!res.ok) throw new Error('Không thể tải dữ liệu ETF');
      const json: EtfFlowApiResponse = await res.json();
      if (json.success) {
        setData(json);
        setError(null);
      }
    } catch (err: any) {
      console.error('Lỗi nạp ETF flows:', err);
      setError(err?.message || 'Lỗi kết nối API');
    } finally {
      if (isManual) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Tự động làm mới mỗi 30 giây
    const timer = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(timer);
  }, [fetchData]);

  // Lọc danh sách items theo bộ lọc
  const displayedItems = useMemo(() => {
    if (!data?.items) return [];
    let list = [...data.items];

    if (filterScope === 'IMAGE_ONLY') {
      list = list.filter((item) => item.highlightedInImage);
    } else if (filterScope === 'INFLOW') {
      list = list.filter((item) => item.direction === 'inflow');
    } else if (filterScope === 'OUTFLOW') {
      list = list.filter((item) => item.direction === 'outflow');
    }

    return list;
  }, [data, filterScope]);

  // Tạo text copy chuẩn format bot Telegram/Twitter như ảnh
  const handleCopyText = useCallback(() => {
    if (!data?.items) return;
    const targetItems = data.items.filter((i) => i.highlightedInImage);
    const textLines = [
      '🇺🇸 Dòng tiền vào ETF hôm nay:',
      '',
      ...targetItems.map((item) => {
        const icon = item.direction === 'outflow' ? '🔘' : '🟢';
        const formatted = formatNetFlowNumber(item.netFlowMillions);
        return `${icon} ${formatted} triệu đô la cho $${item.symbol}`;
      }),
      '',
      `📊 Tổng Net Inflow: ${data.summary.totalNetInflowMillions > 0 ? '+' : ''}${data.summary.totalNetInflowMillions}M USD (~${data.summary.totalNetInflowVNDBillions.toLocaleString('vi-VN')} Tỷ VNĐ)`,
      '⚡ Nguồn: Đối soát SEC Filings, Binance & Coinbase Prime'
    ];

    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  // Format thời gian cập nhật
  const formattedSyncTime = useMemo(() => {
    if (!data?.timestamp) return 'Đang đồng bộ...';
    return new Date(data.timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [data?.timestamp]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0B1020]/95 via-[#080D1A]/95 to-[#050813]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* TOP HEADER: Tiêu đề chuẩn ảnh + Controls */}
      <div className="relative z-10 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <UsFlagIcon className="w-5 h-3.5 shadow-md" />
            <h3 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
              Dòng tiền vào ETF hôm nay
              <span className="hidden sm:inline-block text-xs font-normal text-slate-400 font-mono">
                (US Spot & Institutional Funds)
              </span>
            </h3>
          </div>

          {/* Live Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE SEC & SÀN CEX
          </span>

          {/* Macro Total Pill */}
          {data?.summary && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                data.summary.totalNetInflowMillions >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              Net Flow: {data.summary.totalNetInflowMillions >= 0 ? '+' : ''}
              {data.summary.totalNetInflowMillions}M USD (~{data.summary.totalNetInflowVNDBillions.toLocaleString('vi-VN')} Tỷ VNĐ)
            </span>
          )}
        </div>

        {/* Action Buttons: Refresh, Copy, View Mode, Toggle Collapse */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Đồng bộ thời gian */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">{formattedSyncTime}</span>
          </div>

          {/* Nút Làm Mới */}
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            title="Làm mới dữ liệu từ SEC, Binance và Coinbase Prime"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden md:inline">Làm mới</span>
          </button>

          {/* Nút Sao chép nội dung giống ảnh */}
          <button
            onClick={handleCopyText}
            title="Sao chép nội dung báo cáo dạng text Telegram/Twitter"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sao chép feed</span>
              </>
            )}
          </button>

          {/* Nút Đổi Chế độ Hiển thị */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('BOT_FEED')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                viewMode === 'BOT_FEED'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Feed Bot
            </button>
            <button
              onClick={() => setViewMode('DETAILED_CARDS')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                viewMode === 'DETAILED_CARDS'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Thẻ Chi Tiết
            </button>
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* FILTER TABS & SUBHEADER */}
      {isExpanded && (
        <div className="relative z-10 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Filter scope buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Bộ lọc:</span>
            <button
              onClick={() => setFilterScope('IMAGE_ONLY')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterScope === 'IMAGE_ONLY'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              ⭐ Danh sách trong ảnh ({data?.items?.filter((i) => i.highlightedInImage).length || 8})
            </button>
            <button
              onClick={() => setFilterScope('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterScope === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Tất cả các đồng ({data?.items?.length || 13})
            </button>
            <button
              onClick={() => setFilterScope('INFLOW')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterScope === 'INFLOW'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              🟢 Tiền vào ({data?.summary?.inflowCount || 0})
            </button>
            <button
              onClick={() => setFilterScope('OUTFLOW')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterScope === 'OUTFLOW'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              🔘 Rút ròng ({data?.summary?.outflowCount || 0})
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden lg:flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Lưu ký: Coinbase Prime & BlackRock iShares
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              Khớp lệnh & Giá đối soát: Binance & OKX CEX
            </span>
          </div>
        </div>
      )}

      {/* ERROR NOTICE IF ANY */}
      {error && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error} — Đang sử dụng dữ liệu đối soát dự phòng thời gian thực.</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {isExpanded && (
        <div className="relative z-10 mt-3.5">
          {/* VIEW MODE 1: BOT FEED (Giao diện chuẩn y hệt như trong ảnh của người dùng) */}
          {viewMode === 'BOT_FEED' && (
            <div className="rounded-xl border border-slate-800/90 bg-[#090E1D]/90 p-4 sm:p-5 backdrop-blur-md">
              <div className="mb-3.5 flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <div className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
                  <UsFlagIcon className="w-4 h-3 shadow-xs" />
                  <span>Dòng tiền vào ETF hôm nay:</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  Nhấp vào đồng coin để soi chi tiết sàn & quỹ
                </span>
              </div>

              {/* LIST OF COINS (Từng dòng hiển thị giống hệt ảnh) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-3.5 font-sans">
                {displayedItems.map((item) => {
                  const isNegative = item.netFlowMillions < 0;
                  const isPositive = item.netFlowMillions > 0;
                  const formattedAmount = formatNetFlowNumber(item.netFlowMillions);

                  return (
                    <div
                      key={item.symbol}
                      onClick={() => {
                        setSelectedItemDetail(item);
                        onSelectToken?.(item.symbol);
                      }}
                      className="group flex items-center justify-between py-1.5 px-2.5 -mx-2 rounded-lg hover:bg-slate-800/40 transition-all cursor-pointer border border-transparent hover:border-slate-700/50"
                    >
                      {/* Left: Icon + Text theo đúng ảnh */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Biểu tượng chuẩn ảnh */}
                        {isNegative ? (
                          <TargetNegativeIcon className="w-4 h-4 sm:w-4 sm:h-4 text-rose-500" />
                        ) : (
                          <InflowGreenIcon className="w-4 h-4 sm:w-4 sm:h-4 text-emerald-400" />
                        )}

                        {/* Text dòng tiền: e.g. "175.6 triệu đô la cho $BTC", "-1.0 triệu đô la cho $SOL" */}
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                          <span
                            className={`font-mono font-semibold tracking-tight ${
                              isNegative
                                ? 'text-rose-300'
                                : isPositive
                                ? 'text-white'
                                : 'text-slate-300'
                            }`}
                          >
                            {formattedAmount} triệu đô la
                          </span>
                          <span className="text-slate-400 font-normal">cho</span>
                          <span className="font-extrabold text-sky-400 group-hover:text-cyan-300 group-hover:underline transition-colors font-mono tracking-wide">
                            ${item.symbol}
                          </span>
                        </div>
                      </div>

                      {/* Right: Thêm thông tin hỗ trợ tinh tế (Giá Binance + Badge quỹ) */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.binancePrice ? (
                          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                            {formatCryptoPrice(item.binancePrice)}
                          </span>
                        ) : null}

                        {item.priceChange24h !== undefined && (
                          <span
                            className={`hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              item.priceChange24h >= 0
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {item.priceChange24h >= 0 ? '+' : ''}
                            {item.priceChange24h.toFixed(2)}%
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                            item.etfStatus === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : item.etfStatus === 'TRUST_ETP'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : item.etfStatus === 'PENDING_SEC'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700/60'
                          }`}
                        >
                          {item.etfStatus === 'APPROVED'
                            ? 'Spot ETF'
                            : item.etfStatus === 'TRUST_ETP'
                            ? 'Trust/ETP'
                            : item.etfStatus === 'PENDING_SEC'
                            ? 'SEC Pending'
                            : 'Chưa có ETF'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: DETAILED CARDS (Thẻ chi tiết đa sàn CEX & Quỹ Wall Street) */}
          {viewMode === 'DETAILED_CARDS' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedItems.map((item) => {
                const isNegative = item.netFlowMillions < 0;
                const isPositive = item.netFlowMillions > 0;
                const logoUrl = getTokenLogoUrl(item.symbol);
                const formattedAmount = formatNetFlowNumber(item.netFlowMillions);

                return (
                  <div
                    key={item.symbol}
                    onClick={() => {
                      setSelectedItemDetail(item);
                      onSelectToken?.(item.symbol);
                    }}
                    className="group relative rounded-xl border border-slate-800 bg-[#090E1F]/90 p-3.5 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer shadow-lg space-y-2.5"
                  >
                    {/* Header: Logo, Symbol, Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={logoUrl}
                          alt={item.symbol}
                          className="w-7 h-7 rounded-full bg-slate-950 p-0.5 border border-slate-700/60 object-contain shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
                            ${item.symbol}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-sm font-black font-mono flex items-center justify-end gap-1 ${
                            isNegative
                              ? 'text-rose-400'
                              : isPositive
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {isNegative ? (
                            <TargetNegativeIcon className="w-3.5 h-3.5" />
                          ) : (
                            <InflowGreenIcon className="w-3.5 h-3.5" />
                          )}
                          {item.netFlowMillions > 0 ? '+' : ''}
                          {formattedAmount}M
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Dòng tiền ETF</div>
                      </div>
                    </div>

                    {/* Multi-Exchange Prices Comparison */}
                    <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500">Binance Spot</div>
                        <div className="text-slate-200 font-bold">
                          {item.binancePrice ? formatCryptoPrice(item.binancePrice) : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Coinbase Prime</div>
                        <div className="text-cyan-300 font-bold">
                          {item.coinbasePrice ? formatCryptoPrice(item.coinbasePrice) : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Primary Issuers / Status Footer */}
                    <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[160px]" title={item.statusText}>
                        {item.statusText}
                      </span>
                      <span className="text-cyan-400 font-semibold group-hover:underline">
                        Chi tiết →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* POPUP MODAL CHI TIẾT TỪNG QUỸ & ĐƠN VỊ LƯU KÝ KHI BẤM CHỌN COIN */}
          {selectedItemDetail && (
            <div className="mt-3.5 p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-[#0C1428] to-slate-950 text-xs shadow-2xl relative animate-in fade-in duration-200">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs font-bold"
              >
                ✕ Đóng
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={getTokenLogoUrl(selectedItemDetail.symbol)}
                    alt={selectedItemDetail.symbol}
                    className="w-10 h-10 rounded-full bg-slate-900 p-0.5 border border-cyan-500/40 object-contain"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-white">
                        {selectedItemDetail.name} (${selectedItemDetail.symbol})
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                        {selectedItemDetail.statusText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Đơn vị lưu ký tài sản: <span className="text-white font-semibold">{selectedItemDetail.custodian}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Dòng vốn ròng ETF hôm nay</div>
                    <div
                      className={`text-base font-black font-mono ${
                        selectedItemDetail.netFlowMillions < 0
                          ? 'text-rose-400'
                          : selectedItemDetail.netFlowMillions > 0
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {selectedItemDetail.netFlowMillions > 0 ? '+' : ''}
                      {formatNetFlowNumber(selectedItemDetail.netFlowMillions)} Triệu USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Fund Breakdown List if available */}
              {selectedItemDetail.fundBreakdown && selectedItemDetail.fundBreakdown.length > 0 && (
                <div className="mt-3">
                  <div className="text-[11px] font-bold text-slate-300 mb-2 font-mono flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Phân bổ theo từng quỹ phát hành (BlackRock, Fidelity, Grayscale...):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {selectedItemDetail.fundBreakdown.map((f) => (
                      <div
                        key={f.ticker}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 font-mono text-[11px]"
                      >
                        <div>
                          <span className="font-bold text-cyan-300 mr-1.5">{f.ticker}</span>
                          <span className="text-slate-400">{f.issuer}</span>
                        </div>
                        <span
                          className={`font-bold ${
                            f.flowUsdMillions < 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {f.flowUsdMillions > 0 ? '+' : ''}
                          {f.flowUsdMillions}M USD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const EtfFlowTracker = React.memo(EtfFlowTrackerComponent);
export default EtfFlowTracker;
