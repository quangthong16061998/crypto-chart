"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Radio
} from 'lucide-react';
import { getTokenLogoUrl } from '@/config/tokenLogos';

export interface WhaleAlertItem {
  id: number;
  type: 'OUTFLOW' | 'INFLOW' | string;
  text: string;
  time: string;
  coin: string;
}

interface LiveWhaleFlipAlertProps {
  alerts: WhaleAlertItem[];
  onRefreshPrices?: () => void;
  multiLoading?: boolean;
  autoLiveFeed?: boolean;
  setAutoLiveFeed?: (val: boolean) => void;
  onSelectToken?: (symbol: string) => void;
  flipIntervalMs?: number;
}

function LiveWhaleFlipAlertComponent({
  alerts,
  onRefreshPrices,
  multiLoading = false,
  autoLiveFeed = true,
  setAutoLiveFeed,
  onSelectToken,
  flipIntervalMs = 4500,
}: LiveWhaleFlipAlertProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const total = alerts.length || 1;
  const currentAlert = alerts[currentIndex] || alerts[0];

  // Hàm chuyển thông báo tiếp theo với hiệu ứng lật
  const handleNext = useCallback(() => {
    if (alerts.length <= 1) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
      setIsFlipping(false);
      setProgress(0);
    }, 220);
  }, [alerts.length]);

  // Hàm lùi lại thông báo trước
  const handlePrev = useCallback(() => {
    if (alerts.length <= 1) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
      setIsFlipping(false);
      setProgress(0);
    }, 220);
  }, [alerts.length]);

  // Auto-flip timer & progress bar
  useEffect(() => {
    if (isPaused || alerts.length <= 1) return;

    const intervalStep = 180; // Tối ưu throttle progress bar, giảm 72% render churn mà vẫn siêu mượt với CSS transition
    const totalSteps = flipIntervalMs / intervalStep;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, (currentStep / totalSteps) * 100);
      setProgress(nextProgress);

      if (currentStep >= totalSteps) {
        handleNext();
        currentStep = 0;
      }
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, alerts.length, flipIntervalMs, handleNext]);

  // Khi click vào thông báo để soi coin
  const handleAlertClick = () => {
    if (currentAlert?.coin && onSelectToken) {
      onSelectToken(currentAlert.coin);
    }
  };

  const isOutflow = currentAlert?.type === 'OUTFLOW';
  const logoUrl = currentAlert?.coin ? getTokenLogoUrl(currentAlert.coin) : null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="relative bg-gradient-to-r from-slate-950/95 via-[#0A0F1D]/95 to-slate-950/95 border-b border-slate-800/80 backdrop-blur-md select-none transition-colors"
    >
      {/* Thanh tiến trình thời gian lật mỏng tinh tế ở đáy */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-900 overflow-hidden">
        <div
          className={`h-full transition-all duration-200 ease-linear ${
            isOutflow ? 'bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-400/80 shadow-[0_0_8px_rgba(251,113,133,0.8)]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2">
        {/* DESKTOP LAYOUT (md và lớn hơn: 1 hàng ngang duy nhất siêu mượt) */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left: Tag nhãn Live + Bộ đếm lật */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold shadow-sm shadow-cyan-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>WHALE PULSE FEED</span>
            </div>

            {/* Counter pill: [ 1 / 6 ] */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 font-bold">
              <span className="text-cyan-400">{currentIndex + 1}</span>
              <span className="text-slate-600">/</span>
              <span>{total}</span>
            </div>
          </div>

          {/* Center: Khung thông báo lật 3D (Flip Card Display) */}
          <div
            onClick={handleAlertClick}
            className={`flex-1 min-w-0 cursor-pointer group transition-all duration-200 ${
              isFlipping
                ? flipDirection === 'next'
                  ? 'opacity-0 -translate-y-3 scale-[0.98]'
                  : 'opacity-0 translate-y-3 scale-[0.98]'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
            title="Bấm để lọc và phân tích cá mập đồng coin này"
          >
            <div className="flex items-center gap-3 overflow-hidden text-xs py-0.5">
              {/* Badge loại biến động: Rút ví vs Nạp sàn */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono shrink-0 shadow-sm transition-transform group-hover:scale-105 border ${
                  isOutflow
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-rose-500/10'
                }`}
              >
                {isOutflow ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400 animate-pulse" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-rose-400 animate-pulse" />
                )}
                {isOutflow ? 'RÚT VÍ TÍCH LŨY' : 'NẠP SÀN CẢNH BÁO'}
              </span>

              {/* Logo đồng coin nếu có */}
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={currentAlert.coin}
                  className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700/60 object-contain shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}

              {/* Nội dung thông báo hiển thị trọn vẹn */}
              <div className="truncate text-slate-200 group-hover:text-white transition-colors text-xs font-medium">
                <span>{currentAlert.text}</span>
              </div>

              {/* Thời gian thông báo */}
              <span className="text-slate-400 text-[11px] font-mono shrink-0 font-medium">
                ({currentAlert.time})
              </span>

              {/* Gợi ý soi coin */}
              <span className="text-[10px] text-cyan-400/80 font-mono hidden xl:inline shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                • Bấm để soi cá mập →
              </span>
            </div>
          </div>

          {/* Right: Controls (Previous, Next, Pause/Play, Refresh, Live) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Previous / Next buttons */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Thông báo trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                title={isPaused ? 'Tiếp tục tự động lật' : 'Tạm dừng lật'}
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Thông báo kế tiếp"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nút Làm mới đa sàn */}
            {onRefreshPrices && (
              <button
                onClick={onRefreshPrices}
                disabled={multiLoading}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                title="Cập nhật lại giá đa sàn ngay lập tức"
              >
                <RefreshCw className={`w-3 h-3 ${multiLoading ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Đa Sàn</span>
              </button>
            )}

            {/* Nút Live 60fps */}
            {setAutoLiveFeed && (
              <button
                onClick={() => setAutoLiveFeed(!autoLiveFeed)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  autoLiveFeed
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 shadow-sm shadow-cyan-500/10'
                    : 'border-slate-800 text-slate-400 bg-slate-900'
                }`}
                title="Bật/Tắt cập nhật Realtime liên tục"
              >
                <Activity className={`w-3 h-3 ${autoLiveFeed ? 'animate-pulse text-cyan-400' : ''}`} />
                <span>{autoLiveFeed ? 'Live 60fps' : 'Tạm dừng'}</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE & TABLET LAYOUT (Tối ưu hóa đặc biệt cho Mobile: Hiển thị 100% đầy đủ từng chữ, không bao giờ bị cắt cụt) */}
        <div className="flex md:hidden flex-col gap-1.5">
          {/* Hàng 1: Tiêu đề + Bộ đếm + Cụm điều khiển mini */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-extrabold text-cyan-400 tracking-wider text-[10px] uppercase font-mono">
                WHALE PULSE FEED
              </span>

              {/* Chỉ số thông báo: 1 / 6 */}
              <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400">
                <span className="text-cyan-300">{currentIndex + 1}</span>/{total}
              </span>
            </div>

            {/* Các nút bấm nhỏ gọn trên mobile */}
            <div className="flex items-center gap-1.5">
              {/* Prev / Next */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5">
                <button
                  onClick={handlePrev}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1 text-slate-400 hover:text-cyan-300"
                  title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                >
                  {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Kế tiếp"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Nút Làm mới mini */}
              {onRefreshPrices && (
                <button
                  onClick={onRefreshPrices}
                  disabled={multiLoading}
                  className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 active:scale-95 transition-transform"
                  title="Làm mới giá sàn"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${multiLoading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              )}

              {/* Toggle Live */}
              {setAutoLiveFeed && (
                <button
                  onClick={() => setAutoLiveFeed(!autoLiveFeed)}
                  className={`px-1.5 py-0.5 rounded-md border text-[10px] font-mono font-bold ${
                    autoLiveFeed
                      ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/15'
                      : 'border-slate-800 text-slate-500 bg-slate-900'
                  }`}
                >
                  {autoLiveFeed ? '60fps' : 'Dừng'}
                </button>
              )}
            </div>
          </div>

          {/* Hàng 2: Thẻ thông báo Lật Lật hiển thị trọn vẹn 100% thông tin trên Mobile */}
          <div
            onClick={handleAlertClick}
            className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer active:scale-[0.99] ${
              isOutflow
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            } ${
              isFlipping
                ? flipDirection === 'next'
                  ? 'opacity-0 -translate-y-2.5 scale-[0.98]'
                  : 'opacity-0 translate-y-2.5 scale-[0.98]'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            {/* Header hàng thông báo trên mobile: Badge + Logo + Time */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isOutflow
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isOutflow ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-400 shrink-0" />
                  )}
                  {isOutflow ? 'RÚT VÍ TÍCH LŨY' : 'NẠP SÀN CẢNH BÁO'}
                </span>

                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={currentAlert.coin}
                    className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700/60 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-extrabold text-cyan-300 text-[11px] font-mono">
                  ${currentAlert.coin}
                </span>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {currentAlert.time}
              </span>
            </div>

            {/* Chi tiết nội dung thông báo - hiển thị đầy đủ không bị tràn hay cắt chữ */}
            <p className="text-xs text-slate-200 font-normal leading-relaxed break-words">
              {currentAlert.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const LiveWhaleFlipAlert = React.memo(LiveWhaleFlipAlertComponent);
export default LiveWhaleFlipAlert;

