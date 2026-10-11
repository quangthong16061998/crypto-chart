"use client";

import React, { useState, useMemo } from "react";
import { WhaleTransaction } from "@/types/crypto";
import { formatUSD, formatTokenAmount, formatTimeAgo, shortenAddress } from "@/lib/utils";
import { 
  ArrowRight, 
  ExternalLink, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  ArrowUpRight, 
  Layers 
} from "lucide-react";

interface WhaleFeedProps {
  transactions: WhaleTransaction[];
  onSelectTx: (tx: WhaleTransaction) => void;
}

export function WhaleFeed({ transactions, onSelectTx }: WhaleFeedProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterChain, setFilterChain] = useState<string>("all");
  const [minAmountUSD, setMinAmountUSD] = useState<number>(0);
  const [searchCoin, setSearchCoin] = useState<string>("");

  // Lọc danh sách giao dịch
  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) => {
      // Lọc theo loại
      if (filterType === "dump" && tx.transaction_type !== "wallet_to_exchange") return false;
      if (filterType === "accumulate" && tx.transaction_type !== "exchange_to_wallet") return false;
      if (filterType === "internal" && tx.transaction_type !== "wallet_to_wallet" && tx.transaction_type !== "exchange_to_exchange") return false;

      // Lọc theo Chain
      if (filterChain !== "all" && tx.blockchain !== filterChain) return false;

      // Lọc theo số tiền tối thiểu
      if (tx.amount_usd < minAmountUSD) return false;

      // Lọc theo ký hiệu Coin
      if (searchCoin && !tx.symbol.toLowerCase().includes(searchCoin.toLowerCase())) return false;

      return true;
    });
  }, [transactions, filterType, filterChain, minAmountUSD, searchCoin]);

  // Thống kê nhanh dữ liệu đang hiển thị
  const totalVolumeUSD = useMemo(() => {
    return filteredTxs.reduce((sum, tx) => sum + tx.amount_usd, 0);
  }, [filteredTxs]);

  return (
    <div className="space-y-4">
      
      {/* Bộ Lọc (Filters Bar) */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Lọc Hướng Di Chuyển */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterType === "all"
                ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Tất cả ({transactions.length})
          </button>

          <button
            onClick={() => setFilterType("dump")}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
              filterType === "dump"
                ? "bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Nạp sàn (Cảnh báo Xả)
          </button>

          <button
            onClick={() => setFilterType("accumulate")}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
              filterType === "accumulate"
                ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Rút ví (Tích lũy)
          </button>

          <button
            onClick={() => setFilterType("internal")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterType === "internal"
                ? "bg-purple-500/20 border-purple-500/60 text-purple-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Nội bộ / OTC
          </button>
        </div>

        {/* Lọc Chain & Ngưỡng Giá Trị */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chain Select */}
          <select
            value={filterChain}
            onChange={(e) => setFilterChain(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tất cả Chain</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
            <option value="binance-smart-chain">BSC</option>
            <option value="arbitrum">Arbitrum</option>
          </select>

          {/* Min Amount Select */}
          <select
            value={minAmountUSD}
            onChange={(e) => setMinAmountUSD(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value={0}>Tất cả số tiền</option>
            <option value={10000000}>&gt; $10 Triệu USD</option>
            <option value={50000000}>&gt; $50 Triệu USD</option>
            <option value={100000000}>&gt; $100 Triệu USD</option>
          </select>

          {/* Summary Stat */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <span className="text-slate-400">Khối lượng lọc:</span>
            <span className="text-cyan-400 font-bold">{formatUSD(totalVolumeUSD, true)}</span>
          </div>
        </div>

      </div>

      {/* Danh Sách Giao Dịch Cá Mập */}
      <div className="space-y-3">
        {filteredTxs.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#0c1017] border border-slate-800 text-slate-500 font-mono">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse text-cyan-400" />
            <p className="text-sm">Không tìm thấy giao dịch nào phù hợp với bộ lọc.</p>
            <button
              onClick={() => {
                setFilterType("all");
                setFilterChain("all");
                setMinAmountUSD(0);
                setSearchCoin("");
              }}
              className="mt-3 px-3 py-1 text-xs text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          filteredTxs.map((tx, idx) => {
            const isDump = tx.impact_signal === "DUMP_ALERT";
            const isAccumulate = tx.impact_signal === "ACCUMULATION";
            const isFresh = idx === 0; // Giao dịch mới nhất

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTx(tx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isDump
                    ? "bg-[#0f121a]/90 hover:bg-[#151924] border-slate-800/80 hover:border-rose-500/50"
                    : isAccumulate
                    ? "bg-[#0f121a]/90 hover:bg-[#151924] border-slate-800/80 hover:border-emerald-500/50"
                    : "bg-[#0f121a]/90 hover:bg-[#151924] border-slate-800/80 hover:border-cyan-500/50"
                }`}
              >
                {/* Glow bar for latest TX */}
                {isFresh && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-rose-400 rounded-t-xl animate-pulse" />
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                  
                  {/* Cột 1: Coin, Số lượng & USD */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    {tx.coin_icon ? (
                      <img
                        src={tx.coin_icon}
                        alt={tx.symbol}
                        className="w-10 h-10 rounded-full p-1 bg-slate-900 border border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center font-bold text-cyan-400 shrink-0">
                        {tx.symbol.slice(0, 3)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white tracking-wide">
                          {formatTokenAmount(tx.amount, tx.symbol)}
                        </span>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {tx.blockchain}
                        </span>
                      </div>
                      
                      <div className="text-sm font-black text-cyan-400 tracking-tight mt-0.5">
                        {formatUSD(tx.amount_usd)}
                      </div>
                    </div>
                  </div>

                  {/* Cột 2: Lộ trình From -> To */}
                  <div className="flex-1 max-w-lg">
                    <div className="flex items-center gap-2 text-xs">
                      
                      {/* Nguồn */}
                      <div className="flex-1 p-2 rounded bg-slate-900/80 border border-slate-800/80 text-left">
                        <div className="text-[10px] text-slate-500">FROM</div>
                        <div className="text-slate-200 font-semibold truncate text-[11px]">
                          {tx.from_owner}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {shortenAddress(tx.from_address, 4)}
                        </div>
                      </div>

                      {/* Mũi tên chỉ hướng */}
                      <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      {/* Đích */}
                      <div className="flex-1 p-2 rounded bg-slate-900/80 border border-slate-800/80 text-left">
                        <div className="text-[10px] text-slate-500">TO</div>
                        <div className="text-slate-200 font-semibold truncate text-[11px]">
                          {tx.to_owner}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {shortenAddress(tx.to_address, 4)}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Cột 3: Signal Badge & Time */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-1.5 shrink-0">
                    {/* Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1.5 ${
                        isDump
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                          : isAccumulate
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                      }`}
                    >
                      {isDump ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          <span>🚨 CẢNH BÁO XẢ</span>
                        </>
                      ) : isAccumulate ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>🟢 TÍCH LŨY CÁ MẬP</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          <span>🔄 NỘI BỘ SÀN</span>
                        </>
                      )}
                    </div>

                    {/* Time */}
                    <div className="text-[11px] text-slate-400">
                      {formatTimeAgo(tx.timestamp)}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
