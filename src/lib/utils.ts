import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gộp class tailwind an toàn với clsx và tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { formatCryptoPrice } from "./priceFormatter";

/**
 * Format tiền tệ USD chuẩn sàn giao dịch (ví dụ: BTC $87,450.20, ARB $0.7420, PEPE $0.00001950)
 */
export function formatUSD(value: number, compact: boolean = false): string {
  if (value === undefined || value === null || isNaN(value)) return "$0.00";
  
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  }

  return formatCryptoPrice(value);
}

/**
 * Format số lượng token (ví dụ: 12,500 BTC)
 */
export function formatTokenAmount(amount: number, symbol?: string): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "0";
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: amount > 1000 ? 2 : 4,
  }).format(amount);
  return symbol ? `${formatted} ${symbol.toUpperCase()}` : formatted;
}

/**
 * Format phần trăm biến động (+5.24% hoặc -3.12%)
 */
export function formatPercent(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return "0.00%";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

/**
 * Rút gọn địa chỉ ví (ví dụ: 0x71C...3a9F)
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Format thời gian tương đối tiếng Việt (ví dụ: "2 phút trước")
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 10) return "vừa xong";
  if (diffSec < 60) return `${diffSec} giây trước`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}
