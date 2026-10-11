"use client";

import React from 'react';
import {
  Coins,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Lock,
  Flame,
  Zap,
  Info,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { CapTierAudit, CapTier } from '@/lib/capTierEngine';

interface CapTierModalSectionProps {
  audit: CapTierAudit;
  tokenSymbol: string;
}

export function CapTierModalSection({ audit, tokenSymbol }: CapTierModalSectionProps) {
  const tiers: {
    id: CapTier;
    label: string;
    range: string;
    desc: string;
    color: 'rose' | 'orange' | 'amber' | 'emerald' | 'cyan';
  }[] = [
    { id: 'SUPER_LOW_CAP', label: 'Super Low Cap', range: '< $10M', desc: 'Dễ x10-x50, rủi ro Rug/Dump 95%', color: 'rose' },
    { id: 'MICRO_CAP', label: 'Micro Cap', range: '$10M - $100M', desc: 'Thanh khoản mỏng, dễ bị đẩy/xả', color: 'orange' },
    { id: 'SMALL_CAP', label: 'Small Cap', range: '$100M - $1B', desc: 'Tăng 2-5x nhanh, áp lực xả cao', color: 'amber' },
    { id: 'MID_CAP', label: 'Mid Cap', range: '$1B - $10B', desc: 'Nền tảng L1/L2, tăng trưởng tốt', color: 'emerald' },
    { id: 'MEGA_CAP', label: 'Mega Cap', range: '> $10B', desc: 'Thanh khoản sâu, an toàn nhất', color: 'cyan' },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0D1326] via-[#090E1C] to-[#070A14] border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Coins className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2 flex-wrap">
              PHÂN KHÚC VỐN HÓA & ĐỘ SÂU THANH KHOẢN (CAP AUDIT)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                {audit.badgeLabel}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Công thức: <strong className="text-slate-300">Market Cap = Giá × Lượng lưu hành</strong> • Đối soát bẫy thanh khoản & trượt giá
            </p>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">Mức độ rủi ro:</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-lg font-extrabold border flex items-center gap-1 font-mono ${
              audit.tier === 'MEGA_CAP'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : audit.tier === 'MID_CAP'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : audit.tier === 'SMALL_CAP'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : audit.tier === 'MICRO_CAP'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
            }`}
          >
            {audit.tier === 'SUPER_LOW_CAP' ? (
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            ) : audit.tier === 'MEGA_CAP' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            {audit.riskLevel}
          </span>
        </div>
      </div>

      {/* 5-TIER SPECTRUM VISUAL (Thanh đo 5 nấc phân khúc vốn hóa) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Phân khúc Vốn Hóa Thị Trường (Crypto Market Cap Spectrum):</span>
          <span className="text-cyan-300 font-bold">Vốn hóa: {audit.marketCapFormatted}</span>
        </div>

        <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono">
          {tiers.map((t) => {
            const isCurrent = audit.tier === t.id;
            return (
              <div
                key={t.id}
                className={`relative p-2 rounded-lg text-center transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? t.color === 'rose'
                      ? 'bg-rose-950/80 text-rose-200 border-2 border-rose-500 shadow-lg shadow-rose-950/50 font-bold scale-[1.02] z-10'
                      : t.color === 'orange'
                      ? 'bg-orange-950/80 text-orange-200 border-2 border-orange-500 shadow-lg shadow-orange-950/50 font-bold scale-[1.02] z-10'
                      : t.color === 'amber'
                      ? 'bg-amber-950/80 text-amber-200 border-2 border-amber-500 shadow-lg shadow-amber-950/50 font-bold scale-[1.02] z-10'
                      : t.color === 'emerald'
                      ? 'bg-emerald-950/80 text-emerald-200 border-2 border-emerald-500 shadow-lg shadow-emerald-950/50 font-bold scale-[1.02] z-10'
                      : 'bg-cyan-950/80 text-cyan-200 border-2 border-cyan-400 shadow-lg shadow-cyan-950/50 font-bold scale-[1.02] z-10'
                    : 'bg-slate-900/40 text-slate-500 border border-transparent hover:text-slate-400'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-white text-slate-950 text-[8px] font-extrabold shadow uppercase whitespace-nowrap">
                    ĐANG Ở ĐÂY
                  </span>
                )}
                <div>
                  <span className="block truncate text-[10px] sm:text-[11px] font-extrabold">{t.label}</span>
                  <span className="block text-[9px] opacity-75">{t.range}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-METRIC GRID (4 Thẻ Chỉ Số Cốt Lõi Vốn Hóa & Thanh Khoản) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        {/* Metric 1: Market Cap */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-medium">Vốn Hóa (Market Cap)</span>
          <span className="text-base font-extrabold text-white block">{audit.marketCapFormatted}</span>
          <span className="text-[10px] text-cyan-400 block truncate">{audit.tierLabel}</span>
        </div>

        {/* Metric 2: FDV & Circulating Ratio */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-medium">Vốn Hóa Pha Loãng (FDV)</span>
          <span className="text-base font-extrabold text-slate-200 block">{audit.fdvFormatted}</span>
          <span className="text-[10px] text-emerald-400 block truncate">{audit.circulatingRatio}% Đã lưu hành</span>
        </div>

        {/* Metric 3: Liquidity Pool / CEX Depth */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-medium">Bể Thanh Khoản</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-sans font-bold ${
                audit.liquidityHealth === 'EXCELLENT' || audit.liquidityHealth === 'SAFE'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {audit.liquidityRatio}% Cap
            </span>
          </div>
          <span className="text-base font-extrabold text-slate-200 block">{audit.liquidityPoolFormatted}</span>
          <span className="text-[10px] text-slate-400 block">
            {audit.liquidityRatio >= 15 ? '✓ Chuẩn an toàn >15%' : '⚠️ Thanh khoản mỏng'}
          </span>
        </div>

        {/* Metric 4: Circulating Supply */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-medium">Lượng Lưu Hành / Tổng Cung</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-200 block truncate">{audit.circulatingSupply}</span>
          <span className="text-[10px] text-slate-400 block truncate">Max: {audit.totalSupply}</span>
        </div>
      </div>

      {/* DEEP DIVE AUDIT: 3 Khía Cạnh Cốt Lõi Về Cap (Đòn Bẩy, Trượt Giá, Rug Pull) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        {/* Khía cạnh 1: Tiềm năng đòn bẩy vốn */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Tiềm Năng Đòn Bẩy Vốn</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {audit.upsidePotential}
          </p>
        </div>

        {/* Khía cạnh 2: Nguy cơ cạm bẫy thanh khoản & Trượt giá */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Độ Sâu & Trượt Giá (Slippage)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {audit.slippageRisk}
          </p>
        </div>

        {/* Khía cạnh 3: Kiểm soát rủi ro Rug Pull & Bẫy Scam */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px] uppercase">
            <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Bẫy Rug Pull & Smart Contract</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {audit.scamRugPullRisk}
          </p>
        </div>
      </div>

      {/* LỜI KHUYÊN QUẢN TRỊ VỐN TỪ PRO TRADER */}
      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5 text-xs">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-cyan-300 text-[11px] uppercase tracking-wider block">
            Chiến Lược Giao Dịch Đề Xuất (Pro Trader Guide):
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {audit.traderAdvice}
          </p>
        </div>
      </div>
    </div>
  );
}
