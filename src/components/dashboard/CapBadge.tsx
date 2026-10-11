"use client";

import React from 'react';
import { CapTier, getCapTierAudit } from '@/lib/capTierEngine';

interface CapBadgeProps {
  symbol: string;
  className?: string;
  showDetails?: boolean;
}

export function CapBadge({ symbol, className = '', showDetails = false }: CapBadgeProps) {
  const audit = getCapTierAudit({ symbol });

  const colorStyles = {
    MEGA_CAP: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    MID_CAP: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    SMALL_CAP: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    MICRO_CAP: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    SUPER_LOW_CAP: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10',
  }[audit.tier];

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border transition-colors ${colorStyles} ${className}`}
      title={`Vốn Hóa: ${audit.marketCapFormatted} (${audit.capRange}) • Rủi ro: ${audit.riskLevel}`}
    >
      <span>{audit.tier === 'SUPER_LOW_CAP' ? 'Super Low Cap' : audit.tier === 'MEGA_CAP' ? 'Mega Cap' : audit.tier === 'MID_CAP' ? 'Mid Cap' : audit.tier === 'SMALL_CAP' ? 'Small Cap' : 'Micro Cap'}</span>
      {showDetails && (
        <span className="opacity-80">({audit.marketCapFormatted})</span>
      )}
    </span>
  );
}
