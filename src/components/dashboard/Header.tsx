"use client";

import React from "react";
import { 
  Radio, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Search, 
  Terminal 
} from "lucide-react";

interface HeaderProps {
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({
  isSimulating,
  onToggleSimulate,
  onRefresh,
  isRefreshing,
  lastUpdated,
  soundEnabled,
  onToggleSound,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const timeFormatted =
    lastUpdated > 0
      ? new Date(lastUpdated).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "Đang đồng bộ...";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Radio className="w-5 h-5 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07090e] animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  WHALEPULSE
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                  Radar v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                CRYPTO SMART MONEY RADAR
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex flex-1 max-w-xs relative items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm coin, ticker (BTC, SOL, PEPE)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Actions & Status Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Simulator Switch */}
            <button
              onClick={onToggleSimulate}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                isSimulating
                  ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
              title="Mô phỏng dòng tiền cá mập realtime mỗi 7 giây"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? "text-cyan-400 animate-bounce" : "text-slate-500"}`} />
              <span className="hidden sm:inline">Giả lập Live:</span>
              <span className={isSimulating ? "text-emerald-400 font-bold" : "text-slate-500 font-bold"}>
                {isSimulating ? "ON" : "OFF"}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              title={soundEnabled ? "Tắt âm thanh cảnh báo" : "Bật âm thanh cảnh báo"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-all active:scale-95 disabled:opacity-50"
              title="Làm mới dữ liệu từ API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
              <span className="hidden lg:inline">{timeFormatted}</span>
            </button>

            {/* Status indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FAILOVER READY</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
