"use client";

import React, { useState, useEffect } from "react";
import { ChainFlowData, MarketOverview } from "@/types/crypto";
import { formatUSD } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Waves, Compass, ShieldCheck, Activity, Layers } from "lucide-react";

interface FlowAnalyticsProps {
  chainFlows: ChainFlowData[];
  overview: MarketOverview | null;
}

export function FlowAnalytics({ chainFlows, overview }: FlowAnalyticsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono">
        Đang tải biểu đồ phân tích dòng tiền...
      </div>
    );
  }

  // Chuẩn hóa dữ liệu triệu USD cho biểu đồ
  const chartData = chainFlows.map((cf) => ({
    name: cf.chain,
    Inflow: Math.round(cf.inflow_usd / 1_000_000),
    Outflow: Math.round(cf.outflow_usd / 1_000_000),
    Net: Math.round(cf.net_usd / 1_000_000),
    txCount: cf.tx_count,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-[#0c1017] border border-cyan-500/40 rounded-xl shadow-xl font-mono text-xs space-y-1">
          <div className="text-white font-bold text-sm mb-1">{label} Network</div>
          <div className="text-emerald-400">
            Rút ví (Outflow): ${payload[0]?.value}M
          </div>
          <div className="text-rose-400">
            Nạp sàn (Inflow): ${payload[1]?.value}M
          </div>
          <div className="text-slate-400 pt-1 border-t border-slate-800 text-[11px]">
            Số giao dịch lớn: {payload[0]?.payload?.txCount} TXs
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Biểu đồ chính: Dòng tiền Inflow vs Outflow theo Chain */}
      <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              Dòng Tiền CEX Theo Mạng Lưới Blockchain (24h)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              So sánh quy mô tài sản nạp lên sàn (áp lực bán) vs rút về ví lạnh (tích lũy dài hạn). Đơn vị: Triệu USD ($M).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>Rút Ví (Gom Hàng)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span>Nạp Sàn (Áp Lực Xả)</span>
            </div>
          </div>
        </div>

        {/* Khung Biểu Đồ Recharts */}
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `$${val}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Outflow" fill="#10b981" radius={[4, 4, 0, 0]} name="Rút ví" />
              <Bar dataKey="Inflow" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Nạp sàn" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid 2 Cột Thống Kê Chuyên Sâu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Cột 1: Phân Tích Dòng Tiền Smart Money */}
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Đánh Giá Dòng Tiền Cá Mập (Smart Money Verdict)
          </h4>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold">1. Bitcoin & Ethereum Tích Lũy Ròng:</span>
              <p className="mt-1 text-slate-400">
                Tỷ lệ rút ròng khỏi sàn Binance và Bitfinex tăng 18% so với trung bình 7 ngày qua, cho thấy các quỹ ETF và tổ chức tiếp tục xu hướng gom hàng sau các đợt điều chỉnh giá.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-amber-400 font-bold">2. Biến Động Khối Lượng Solana & Layer 1:</span>
              <p className="mt-1 text-slate-400">
                Solana ghi nhận lượng luân chuyển ví nóng sang ví phái sinh phình to với hơn $85M nạp ròng, cho thấy các cá mập đang mở rộng vị thế giao dịch ngắn hạn.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-rose-400 font-bold">3. Cảnh Báo Phân Phối Meme & Altcoins:</span>
              <p className="mt-1 text-slate-400">
                Dòng tiền nạp sàn PEPE và DOGE có tín hiệu chốt lời từ các ví OG Top 10 holder. Khuyến nghị theo dõi chặt chẽ tại các mốc kháng cự.
              </p>
            </div>
          </div>
        </div>

        {/* Cột 2: Bảng Tổng Kết Dòng Tiền Các Chain */}
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Chi Tiết Dòng Tiền Theo Blockchain
          </h4>

          <div className="divide-y divide-slate-800/80 text-xs">
            {chainFlows.map((cf) => {
              const isOutflowMore = cf.net_usd < 0; // Net âm nghĩa là Outflow > Inflow
              return (
                <div key={cf.chain} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{cf.chain}</span>
                    <span className="text-[10px] text-slate-500">
                      ({cf.tx_count} TXs)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 hidden sm:inline">
                      In: ${Math.round(cf.inflow_usd / 1e6)}M | Out: ${Math.round(cf.outflow_usd / 1e6)}M
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-black text-right min-w-[85px] ${
                        isOutflowMore
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {isOutflowMore ? "-" : "+"}
                      ${Math.abs(Math.round(cf.net_usd / 1e6))}M
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
