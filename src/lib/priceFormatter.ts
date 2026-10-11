/**
 * Chuẩn hóa số chữ số thập phân (Tick Size Precision) chuẩn sàn Binance, CoinGecko & TradingView
 */

export function getDecimalsForPrice(price: number | undefined | null): number {
  if (!price || price <= 0 || isNaN(price)) return 2;
  if (price >= 1000) return 2;       // BTC, ETH: 2 số thập phân ($87,450.20)
  if (price >= 100) return 2;        // SOL, BNB, AAVE: 2 số thập phân ($215.80)
  if (price >= 1) return 3;          // NEAR, SUI, OP: 2-3 số ($6.840, $3.285)
  if (price >= 0.1) return 4;        // ARB, ADA, DOGE, SEI: 4 số ($0.7420, $0.3850)
  if (price >= 0.01) return 5;       // GALA, CHZ, BEAM: 5 số ($0.02850, $0.07500)
  if (price >= 0.001) return 6;      // NOT, TURBO, MEW: 6 số ($0.007800, $0.008400)
  if (price >= 0.0001) return 7;     // DOGS, FLOKI: 7 số ($0.0006200, $0.0002450)
  return 8;                          // PEPE, SHIB, BONK: 8 số ($0.00001950, $0.00002480)
}

/**
 * Format giá tiền điện tử chuẩn sàn giao dịch:
 * - Tự động format dấu phẩy hàng nghìn cho số lớn
 * - Hiển thị đủ số 0 sau dấu phẩy theo đúng tick size sàn
 * - Không bao giờ làm tròn sai làm mất số thập phân của coin nhỏ (PEPE, SHIB, BONK, NOT...)
 */
export function formatCryptoPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) return '$0.00';
  if (price === 0) return '$0.00';

  const absPrice = Math.abs(price);
  const sign = price < 0 ? '-' : '';

  if (absPrice >= 1000) {
    return `${sign}$${absPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (absPrice >= 100) {
    return `${sign}$${absPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (absPrice >= 1) {
    // $1.00 - $99.99: Tối thiểu 2 số thập phân, tối đa 3 số thập phân nếu có số lẻ
    const hasThirdDecimal = (absPrice.toString().split('.')[1] || '').length > 2;
    return `${sign}$${absPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: hasThirdDecimal ? 3 : 2,
    })}`;
  }
  if (absPrice >= 0.1) {
    // $0.1000 - $0.9999 (e.g. ARB $0.7420, ADA $0.7450, DOGE $0.3850)
    return `${sign}$${absPrice.toFixed(4)}`;
  }
  if (absPrice >= 0.01) {
    // $0.01000 - $0.09999 (e.g. GALA $0.02850, BEAM $0.02150)
    return `${sign}$${absPrice.toFixed(5)}`;
  }
  if (absPrice >= 0.001) {
    // $0.001000 - $0.009999 (e.g. NOT $0.007800, TURBO $0.008400)
    return `${sign}$${absPrice.toFixed(6)}`;
  }
  if (absPrice >= 0.0001) {
    // $0.0001000 - $0.0009999 (e.g. DOGS $0.0006200, FLOKI $0.0002450)
    return `${sign}$${absPrice.toFixed(7)}`;
  }
  // Micro Meme (< $0.0001): 8 số thập phân chuẩn sàn (e.g. PEPE $0.00001950, SHIB $0.00002480, BONK $0.00004200)
  return `${sign}$${absPrice.toFixed(8)}`;
}
