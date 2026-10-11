"use client";

import React from 'react';
import { CapTier, getCapTierAudit } from '@/lib/capTierEngine';

interface CapBadgeProps {
  symbol: string;
  className?: string;
  showDetails?: boolean;
  marketCapUSD?: number;
  basePrice?: number;
}

export function CapBadge({ symbol, className = '', showDetails = false, marketCapUSD, basePrice }: CapBadgeProps) {
  const audit = getCapTierAudit({ symbol, marketCapUSD, basePrice });

  const colorStyles = {
    MEGA_CAP: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:border-cyan-400/60 shadow-sm shadow-cyan-500/5',
    MID_CAP: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/60 shadow-sm shadow-emerald-500/5',
    SMALL_CAP: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400/60 shadow-sm shadow-amber-500/5',
    MICRO_CAP: 'bg-orange-500/15 text-orange-300 border-orange-500/30 hover:border-orange-400/60 shadow-sm shadow-orange-500/5',
    SUPER_LOW_CAP: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:border-rose-400/70 shadow-sm shadow-rose-500/15',
  }[audit.tier];

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border transition-colors whitespace-nowrap shrink-0 ${colorStyles} ${className}`}
      title={`Vốn Hóa: ${audit.marketCapFormatted} (${audit.capRange}) • Rủi ro: ${audit.riskLevel}`}
    >
      <span className="whitespace-nowrap">{audit.tier === 'SUPER_LOW_CAP' ? 'Super Low Cap' : audit.tier === 'MEGA_CAP' ? 'Mega Cap' : audit.tier === 'MID_CAP' ? 'Mid Cap' : audit.tier === 'SMALL_CAP' ? 'Small Cap' : 'Micro Cap'}</span>
      {showDetails && (
        <span className="opacity-80 whitespace-nowrap">({audit.marketCapFormatted})</span>
      )}
    </span>
  );
}
