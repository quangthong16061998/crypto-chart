"use client";

import React, { useState, useMemo } from "react";
import { MarketAlert, Coin } from "@/types/crypto";
import { formatTimeAgo } from "@/lib/utils";
import { 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";

interface AlertsFeedProps {
  alerts: MarketAlert[];
  coins: Coin[];
  onSelectCoinBySymbol: (symbol: string) => void;
}

export function AlertsFeed({ alerts, coins, onSelectCoinBySymbol }: AlertsFeedProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredAlerts = useMemo(() => {
    if (filterSeverity === "all") return alerts;
    return alerts.filter((a) => a.severity === filterSeverity);
  }, [alerts, filterSeverity]);

  // Đếm theo mức độ
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const successCount = alerts.filter((a) => a.severity === "success").length;

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Top Banner Tóm Tắt Tín Hiệu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold">RỦI RO XẢ & GIẢM SÂU</span>
          </div>
          <span className="text-lg font-black text-rose-400">{criticalCount}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-4 h-4" />
            <span className="font-bold">ĐỘT BIẾN VOLUME</span>
          </div>
          <span className="text-lg font-black text-amber-400">{warningCount}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold">BỨT PHÁ & TÍCH LŨY</span>
          </div>
          <span className="text-lg font-black text-emerald-400">{successCount}</span>
        </div>
      </div>

      {/* Bộ Lọc Tín Hiệu */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterSeverity("all")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterSeverity === "all"
                ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Tất cả tín hiệu ({alerts.length})
          </button>

          <button
            onClick={() => setFilterSeverity("critical")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterSeverity === "critical"
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Khẩn cấp ({criticalCount})
          </button>

          <button
            onClick={() => setFilterSeverity("warning")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterSeverity === "warning"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Cảnh báo ({warningCount})
          </button>

          <button
            onClick={() => setFilterSeverity("success")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterSeverity === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Cơ hội tăng giá ({successCount})
          </button>
        </div>

        <span className="hidden sm:inline-block text-slate-400 text-[11px]">
          Cập nhật realtime từ thuật toán Radar
        </span>
      </div>

      {/* Danh Sách Tín Hiệu Cảnh Báo */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === "critical";
          const isWarning = alert.severity === "warning";
          const isSuccess = alert.severity === "success";

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                isCritical
                  ? "bg-rose-950/10 border-rose-500/30 hover:border-rose-500/60"
                  : isWarning
                  ? "bg-amber-950/10 border-amber-500/30 hover:border-amber-500/60"
                  : isSuccess
                  ? "bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/60"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                
                {/* Logo & Info */}
                <div className="flex items-start gap-3">
                  {alert.coin_icon ? (
                    <img
                      src={alert.coin_icon}
                      alt={alert.coin_symbol}
                      className="w-10 h-10 rounded-full p-1 bg-slate-900 border border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-cyan-400 shrink-0">
                      {alert.coin_symbol.slice(0, 3)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {alert.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          isCritical
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                            : isWarning
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                            : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        }`}
                      >
                        {alert.type.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                {/* Metric & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                  <div
                    className={`font-black text-sm px-2.5 py-1 rounded-lg border ${
                      isCritical
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        : isWarning
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {alert.metric}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                    <button
                      onClick={() => onSelectCoinBySymbol(alert.coin_symbol)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 text-slate-300 text-[11px] transition-all flex items-center gap-1"
                    >
                      <span>Soi coin</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
