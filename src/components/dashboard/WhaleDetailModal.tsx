"use client";

import React, { useState } from "react";
import { WhaleTransaction } from "@/types/crypto";
import { formatUSD, formatTokenAmount, formatTimeAgo, shortenAddress } from "@/lib/utils";
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertOctagon, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";

interface WhaleDetailModalProps {
  tx: WhaleTransaction | null;
  onClose: () => void;
}

export function WhaleDetailModal({ tx, onClose }: WhaleDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!tx) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(tx.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDump = tx.impact_signal === "DUMP_ALERT";
  const isAccumulation = tx.impact_signal === "ACCUMULATION";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0c1017] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div
          className={`h-1.5 ${
            isDump
              ? "bg-gradient-to-r from-rose-500 to-red-600"
              : isAccumulation
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-cyan-500 to-blue-600"
          }`}
        />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {tx.coin_icon && (
              <img
                src={tx.coin_icon}
                alt={tx.symbol}
                className="w-10 h-10 rounded-full p-1 bg-slate-900 border border-slate-800"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Chi Tiết Giao Dịch Cá Mập
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {tx.blockchain}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Phát hiện {formatTimeAgo(tx.timestamp)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs font-mono">
          
          {/* Main Value Banner */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
            <div className="text-slate-400 text-[11px] mb-1">GIÁ TRỊ CHUYỂN DỊCH QUY ĐỔI</div>
            <div className="text-3xl font-black text-white tracking-tight">
              {formatUSD(tx.amount_usd)}
            </div>
            <div className="text-sm font-bold text-cyan-400 mt-1">
              {formatTokenAmount(tx.amount, tx.symbol)}
            </div>
          </div>

          {/* Transfer Flow Visualizer */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="text-slate-400 text-[11px]">LỘ TRÌNH DÒNG TIỀN:</div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[#07090e] border border-slate-800/80">
              {/* From */}
              <div className="flex-1 text-center sm:text-left">
                <div className="text-[10px] text-slate-500 uppercase">Nguồn (FROM)</div>
                <div className="text-slate-200 font-bold mt-0.5 text-xs">{tx.from_owner}</div>
                <div className="text-[11px] text-slate-400">{shortenAddress(tx.from_address, 6)}</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-cyan-400">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* To */}
              <div className="flex-1 text-center sm:text-right">
                <div className="text-[10px] text-slate-500 uppercase">Đích đến (TO)</div>
                <div className="text-slate-200 font-bold mt-0.5 text-xs">{tx.to_owner}</div>
                <div className="text-[11px] text-slate-400">{shortenAddress(tx.to_address, 6)}</div>
              </div>
            </div>
          </div>

          {/* Signal / Impact Assessment */}
          <div
            className={`p-4 rounded-xl border ${
              isDump
                ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                : isAccumulation
                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                : "bg-cyan-950/20 border-cyan-500/40 text-cyan-300"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {isDump ? (
                <>
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>CẢNH BÁO: NGUY CƠ BÁN THẢO (DUMP RISK)</span>
                </>
              ) : isAccumulation ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>TÍN HIỆU TÍCH LŨY DÀI HẠN (ACCUMULATION)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span>ĐIỀU PHỐI THANH KHOẢN NỘI BỘ (INTERNAL TRANSFER)</span>
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {isDump
                ? "Giao dịch nạp token từ ví cá voi lên sàn tập trung (CEX) thường dự báo áp lực cung tức thì hoặc các lệnh bán giới hạn lớn (Sell Walls). Khuyến nghị nhà đầu tư theo dõi phản ứng giá tại các mốc hỗ trợ."
                : isAccumulation
                ? "Cá mập vừa rút khối lượng tài sản lớn từ sàn giao dịch về kho lưu trữ lạnh (Cold Storage). Đây là hành vi tích trữ tài sản không muốn bán ngắn hạn, làm giảm áp lực cung trên sàn."
                : "Giao dịch chuyển dời thanh khoản giữa các cụm ví sàn hoặc giải ngân OTC của các tổ chức tạo lập thị trường (Market Makers)."}
            </p>
          </div>

          {/* Hash and Details */}
          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">TRANSACTION HASH:</span>
              <button
                onClick={copyHash}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Đã copy!" : "Sao chép hash"}</span>
              </button>
            </div>
            <div className="p-2 rounded bg-[#07090e] text-[11px] text-slate-300 break-all select-all">
              {tx.hash}
            </div>
          </div>

          {/* Link to Blockchain Explorer */}
          <div className="pt-2">
            <a
              href={tx.explorer_url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-bold transition-all"
            >
              <span>Xem trực tiếp trên Explorer ({tx.blockchain.toUpperCase()})</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
