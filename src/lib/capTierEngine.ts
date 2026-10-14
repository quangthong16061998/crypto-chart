/**
 * Engine Phân Tích Phân Khúc Vốn Hóa (Market Cap Tier & Liquidity Audit)
 * 
 * Phân chia chuẩn mực 5 phân khúc theo tiêu chuẩn Quốc tế (CoinGecko / Messari / Binance Research):
 * 1. Mega / Large Cap (> 10 tỷ USD): BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, SUI, LINK, SHIB...
 * 2. Mid Cap (1 tỷ - 10 tỷ USD): NEAR, APT, ARB, OP, PEPE, TAO, UNI, AAVE, KAS, STX, ICP, FIL, ENA, ONDO, FTM, DOT, MNT, POL, WLD, MKR, GRT, LDO, AR, RUNE, EIGEN, TIA, INJ, SEI...
 * 3. Small Cap (100 triệu - 1 tỷ USD): RAY, ENS, PENDLE, JUP, WIF, BONK, FLOKI, STRK, RENDER, FET, PYTH, IO, ZK, ZRO, JTO, NOT, DOGS, NEIRO, POPCAT, SAFE, DRIFT, ETHFI, CRV, 1INCH, COMP, SNX, CAKE, DYDX, CHZ, SAND, MANA, AXS, GALA, BEAM, BLUR, BOME, MEW, BRETT...
 * 4. Micro Cap (10 triệu - 100 triệu USD): TURBO, ATH, BB, KMNO, TNSR, REZ, LISTA...
 * 5. Super Low Cap (< 10 triệu USD, đặc biệt < 2M USD): XPL (~$1.42M) và các meme coins/dex tokens mới mint
 */

export type CapTier = 'MEGA_CAP' | 'MID_CAP' | 'SMALL_CAP' | 'MICRO_CAP' | 'SUPER_LOW_CAP';

export interface CapTierAudit {
  tier: CapTier;
  tierLabel: string;
  badgeLabel: string;
  badgeColor: string;
  capRange: string;
  marketCapUSD: number;
  marketCapFormatted: string;
  fdvUSD: number;
  fdvFormatted: string;
  circulatingSupply: string;
  totalSupply: string;
  circulatingRatio: number; // % lưu hành so với tổng cung
  liquidityPoolUSD: number;
  liquidityPoolFormatted: string;
  liquidityRatio: number; // % thanh khoản so với vốn hóa (an toàn > 15-20%)
  liquidityHealth: 'EXCELLENT' | 'SAFE' | 'WARNING' | 'CRITICAL_THIN';
  riskLevel: 'Thấp nhất' | 'Trung bình' | 'Khá cao' | 'Cao' | 'Cực kỳ rủi ro';
  riskScore: number; // 1 (an toàn nhất) - 5 (rủi ro cao nhất)
  upsidePotential: string;
  slippageRisk: string;
  scamRugPullRisk: string;
  traderAdvice: string;
}

// Bảng dữ liệu Vốn Hóa & Cung Lưu Hành chuẩn hóa TOÀN DIỆN cho TOÀN BỘ 85 đồng coin trong danh mục
export const KNOWN_CAP_DATA: Record<string, {
  capUSD: number;
  fdvUSD: number;
  circulating: string;
  total: string;
  circulatingRatio: number;
  liquidityUSD: number;
}> = {
  // === 1. MEGA / LARGE CAP (> $10B) ===
  btc: { capUSD: 1_724_500_000_000, fdvUSD: 1_836_000_000_000, circulating: '19.78M BTC', total: '21M BTC', circulatingRatio: 94.2, liquidityUSD: 85_400_000_000 },
  eth: { capUSD: 375_200_000_000, fdvUSD: 375_200_000_000, circulating: '120.4M ETH', total: '120.4M ETH', circulatingRatio: 100, liquidityUSD: 24_600_000_000 },
  sol: { capUSD: 101_800_000_000, fdvUSD: 128_500_000_000, circulating: '472M SOL', total: '588M SOL', circulatingRatio: 80.2, liquidityUSD: 11_800_000_000 },
  bnb: { capUSD: 94_200_000_000, fdvUSD: 94_200_000_000, circulating: '144M BNB', total: '144M BNB', circulatingRatio: 100, liquidityUSD: 5_200_000_000 },
  xrp: { capUSD: 63_500_000_000, fdvUSD: 112_000_000_000, circulating: '56.8B XRP', total: '100B XRP', circulatingRatio: 56.8, liquidityUSD: 4_100_000_000 },
  ada: { capUSD: 26_400_000_000, fdvUSD: 33_200_000_000, circulating: '35.7B ADA', total: '45B ADA', circulatingRatio: 79.3, liquidityUSD: 1_400_000_000 },
  doge: { capUSD: 24_800_000_000, fdvUSD: 24_800_000_000, circulating: '146B DOGE', total: '146B DOGE', circulatingRatio: 100, liquidityUSD: 1_850_000_000 },
  avax: { capUSD: 14_200_000_000, fdvUSD: 25_100_000_000, circulating: '407M AVAX', total: '720M AVAX', circulatingRatio: 56.5, liquidityUSD: 920_000_000 },
  sui: { capUSD: 10_280_000_000, fdvUSD: 32_400_000_000, circulating: '2.85B SUI', total: '10B SUI', circulatingRatio: 28.5, liquidityUSD: 1_140_000_000 },
  shib: { capUSD: 14_820_000_000, fdvUSD: 14_820_000_000, circulating: '589T SHIB', total: '589T SHIB', circulatingRatio: 100, liquidityUSD: 850_000_000 },
  link: { capUSD: 10_250_000_000, fdvUSD: 14_850_000_000, circulating: '626M LINK', total: '1B LINK', circulatingRatio: 62.6, liquidityUSD: 780_000_000 },

  // === 2. MID CAP ($1B - $10B) ===
  uni: { capUSD: 8_500_000_000, fdvUSD: 10_200_000_000, circulating: '600M UNI', total: '1B UNI', circulatingRatio: 60.0, liquidityUSD: 640_000_000 },
  dot: { capUSD: 7_200_000_000, fdvUSD: 7_850_000_000, circulating: '1.43B DOT', total: '1.51B DOT', circulatingRatio: 94.7, liquidityUSD: 420_000_000 },
  near: { capUSD: 6_380_000_000, fdvUSD: 6_450_000_000, circulating: '1.22B NEAR', total: '1.24B NEAR', circulatingRatio: 98.4, liquidityUSD: 820_000_000 },
  apt: { capUSD: 5_850_000_000, fdvUSD: 12_600_000_000, circulating: '512M APT', total: '1.1B APT', circulatingRatio: 46.5, liquidityUSD: 480_000_000 },
  icp: { capUSD: 5_420_000_000, fdvUSD: 5_850_000_000, circulating: '475M ICP', total: '525M ICP', circulatingRatio: 90.4, liquidityUSD: 260_000_000 },
  pepe: { capUSD: 4_250_000_000, fdvUSD: 4_250_000_000, circulating: '420T PEPE', total: '420T PEPE', circulatingRatio: 100, liquidityUSD: 580_000_000 },
  kas: { capUSD: 3_250_000_000, fdvUSD: 3_750_000_000, circulating: '25.1B KAS', total: '28.7B KAS', circulatingRatio: 87.5, liquidityUSD: 220_000_000 },
  pol: { capUSD: 3_150_000_000, fdvUSD: 3_950_000_000, circulating: '8.02B POL', total: '10B POL', circulatingRatio: 80.2, liquidityUSD: 280_000_000 },
  arb: { capUSD: 2_920_000_000, fdvUSD: 7_420_000_000, circulating: '3.94B ARB', total: '10B ARB', circulatingRatio: 39.4, liquidityUSD: 390_000_000 },
  stx: { capUSD: 2_850_000_000, fdvUSD: 3_450_000_000, circulating: '1.50B STX', total: '1.81B STX', circulatingRatio: 82.8, liquidityUSD: 190_000_000 },
  aave: { capUSD: 2_650_000_000, fdvUSD: 2_840_000_000, circulating: '14.9M AAVE', total: '16M AAVE', circulatingRatio: 93.1, liquidityUSD: 310_000_000 },
  mnt: { capUSD: 2_650_000_000, fdvUSD: 5_100_000_000, circulating: '3.26B MNT', total: '6.21B MNT', circulatingRatio: 52.5, liquidityUSD: 210_000_000 },
  op: { capUSD: 2_380_000_000, fdvUSD: 7_980_000_000, circulating: '1.26B OP', total: '4.29B OP', circulatingRatio: 29.4, liquidityUSD: 320_000_000 },
  fil: { capUSD: 2_150_000_000, fdvUSD: 7_200_000_000, circulating: '602M FIL', total: '1.96B FIL', circulatingRatio: 30.7, liquidityUSD: 180_000_000 },
  tao: { capUSD: 2_150_000_000, fdvUSD: 5_880_000_000, circulating: '7.38M TAO', total: '21M TAO', circulatingRatio: 35.1, liquidityUSD: 280_000_000 },
  ftm: { capUSD: 1_950_000_000, fdvUSD: 2_210_000_000, circulating: '2.80B FTM', total: '3.17B FTM', circulatingRatio: 88.3, liquidityUSD: 190_000_000 },
  rune: { capUSD: 1_920_000_000, fdvUSD: 2_450_000_000, circulating: '335M RUNE', total: '500M RUNE', circulatingRatio: 67.0, liquidityUSD: 190_000_000 },
  inj: { capUSD: 1_850_000_000, fdvUSD: 1_980_000_000, circulating: '100M INJ', total: '100M INJ', circulatingRatio: 100, liquidityUSD: 210_000_000 },
  grt: { capUSD: 1_850_000_000, fdvUSD: 2_120_000_000, circulating: '9.54B GRT', total: '10.8B GRT', circulatingRatio: 88.3, liquidityUSD: 175_000_000 },
  ondo: { capUSD: 1_840_000_000, fdvUSD: 9_200_000_000, circulating: '1.44B ONDO', total: '10B ONDO', circulatingRatio: 14.4, liquidityUSD: 240_000_000 },
  wld: { capUSD: 1_620_000_000, fdvUSD: 11_400_000_000, circulating: '720M WLD', total: '10B WLD', circulatingRatio: 7.2, liquidityUSD: 220_000_000 },
  mkr: { capUSD: 1_520_000_000, fdvUSD: 1_520_000_000, circulating: '920K MKR', total: '920K MKR', circulatingRatio: 100, liquidityUSD: 160_000_000 },
  ldo: { capUSD: 1_420_000_000, fdvUSD: 1_580_000_000, circulating: '895M LDO', total: '1B LDO', circulatingRatio: 89.5, liquidityUSD: 195_000_000 },
  eigen: { capUSD: 1_350_000_000, fdvUSD: 6_800_000_000, circulating: '186M EIGEN', total: '1.67B EIGEN', circulatingRatio: 11.1, liquidityUSD: 170_000_000 },
  ena: { capUSD: 1_280_000_000, fdvUSD: 8_550_000_000, circulating: '2.84B ENA', total: '15B ENA', circulatingRatio: 18.9, liquidityUSD: 210_000_000 },
  sei: { capUSD: 1_250_000_000, fdvUSD: 3_600_000_000, circulating: '3.62B SEI', total: '10B SEI', circulatingRatio: 36.2, liquidityUSD: 180_000_000 },
  ar: { capUSD: 1_180_000_000, fdvUSD: 1_190_000_000, circulating: '65.4M AR', total: '66M AR', circulatingRatio: 99.1, liquidityUSD: 140_000_000 },
  tia: { capUSD: 1_150_000_000, fdvUSD: 4_800_000_000, circulating: '215M TIA', total: '1.05B TIA', circulatingRatio: 20.4, liquidityUSD: 165_000_000 },

  // === 3. SMALL CAP ($100M - $1B) ===
  render: { capUSD: 920_000_000, fdvUSD: 1_280_000_000, circulating: '388M RENDER', total: '532M RENDER', circulatingRatio: 72.9, liquidityUSD: 155_000_000 },
  jup: { capUSD: 850_000_000, fdvUSD: 6_200_000_000, circulating: '1.35B JUP', total: '10B JUP', circulatingRatio: 13.5, liquidityUSD: 160_000_000 },
  fet: { capUSD: 840_000_000, fdvUSD: 1_680_000_000, circulating: '2.52B FET', total: '5.04B FET', circulatingRatio: 50.0, liquidityUSD: 140_000_000 },
  bonk: { capUSD: 810_000_000, fdvUSD: 920_000_000, circulating: '75T BONK', total: '92T BONK', circulatingRatio: 81.5, liquidityUSD: 120_000_000 },
  ray: { capUSD: 785_000_000, fdvUSD: 1_420_000_000, circulating: '290M RAY', total: '555M RAY', circulatingRatio: 52.2, liquidityUSD: 145_000_000 },
  axs: { capUSD: 780_000_000, fdvUSD: 1_350_000_000, circulating: '155M AXS', total: '270M AXS', circulatingRatio: 57.4, liquidityUSD: 125_000_000 },
  wif: { capUSD: 750_000_000, fdvUSD: 750_000_000, circulating: '998M WIF', total: '998M WIF', circulatingRatio: 100, liquidityUSD: 130_000_000 },
  brett: { capUSD: 740_000_000, fdvUSD: 740_000_000, circulating: '9.91B BRETT', total: '9.91B BRETT', circulatingRatio: 100, liquidityUSD: 95_000_000 },
  pyth: { capUSD: 720_000_000, fdvUSD: 2_400_000_000, circulating: '3.62B PYTH', total: '10B PYTH', circulatingRatio: 36.2, liquidityUSD: 110_000_000 },
  popcat: { capUSD: 710_000_000, fdvUSD: 710_000_000, circulating: '979M POPCAT', total: '979M POPCAT', circulatingRatio: 100, liquidityUSD: 88_000_000 },
  gala: { capUSD: 690_000_000, fdvUSD: 850_000_000, circulating: '38B GALA', total: '50B GALA', circulatingRatio: 76.0, liquidityUSD: 98_000_000 },
  floki: { capUSD: 680_000_000, fdvUSD: 680_000_000, circulating: '9.68T FLOKI', total: '9.68T FLOKI', circulatingRatio: 100, liquidityUSD: 98_000_000 },
  zro: { capUSD: 680_000_000, fdvUSD: 3_800_000_000, circulating: '110M ZRO', total: '1B ZRO', circulatingRatio: 11.0, liquidityUSD: 95_000_000 },
  not: { capUSD: 680_000_000, fdvUSD: 680_000_000, circulating: '102B NOT', total: '102B NOT', circulatingRatio: 100, liquidityUSD: 92_000_000 },
  ens: { capUSD: 625_000_000, fdvUSD: 2_045_000_000, circulating: '31.5M ENS', total: '100M ENS', circulatingRatio: 31.5, liquidityUSD: 110_000_000 },
  sand: { capUSD: 610_000_000, fdvUSD: 780_000_000, circulating: '2.42B SAND', total: '3B SAND', circulatingRatio: 80.7, liquidityUSD: 92_000_000 },
  mana: { capUSD: 590_000_000, fdvUSD: 680_000_000, circulating: '1.94B MANA', total: '2.19B MANA', circulatingRatio: 88.6, liquidityUSD: 88_000_000 },
  cake: { capUSD: 580_000_000, fdvUSD: 860_000_000, circulating: '290M CAKE', total: '380M CAKE', circulatingRatio: 76.3, liquidityUSD: 110_000_000 },
  beam: { capUSD: 580_000_000, fdvUSD: 640_000_000, circulating: '51B BEAM', total: '62B BEAM', circulatingRatio: 82.3, liquidityUSD: 85_000_000 },
  chz: { capUSD: 520_000_000, fdvUSD: 520_000_000, circulating: '8.89B CHZ', total: '8.89B CHZ', circulatingRatio: 100, liquidityUSD: 85_000_000 },
  pendle: { capUSD: 520_000_000, fdvUSD: 640_000_000, circulating: '163M PENDLE', total: '200M PENDLE', circulatingRatio: 81.5, liquidityUSD: 95_000_000 },
  mew: { capUSD: 520_000_000, fdvUSD: 520_000_000, circulating: '88.9B MEW', total: '88.9B MEW', circulatingRatio: 100, liquidityUSD: 78_000_000 },
  bome: { capUSD: 480_000_000, fdvUSD: 480_000_000, circulating: '69B BOME', total: '69B BOME', circulatingRatio: 100, liquidityUSD: 72_000_000 },
  safe: { capUSD: 450_000_000, fdvUSD: 1_020_000_000, circulating: '450M SAFE', total: '1B SAFE', circulatingRatio: 45.0, liquidityUSD: 65_000_000 },
  snx: { capUSD: 450_000_000, fdvUSD: 460_000_000, circulating: '328M SNX', total: '328M SNX', circulatingRatio: 100, liquidityUSD: 82_000_000 },
  strk: { capUSD: 420_000_000, fdvUSD: 2_100_000_000, circulating: '2.09B STRK', total: '10B STRK', circulatingRatio: 20.9, liquidityUSD: 85_000_000 },
  crv: { capUSD: 420_000_000, fdvUSD: 850_000_000, circulating: '1.25B CRV', total: '2.14B CRV', circulatingRatio: 58.4, liquidityUSD: 95_000_000 },
  zk: { capUSD: 410_000_000, fdvUSD: 2_350_000_000, circulating: '3.67B ZK', total: '21B ZK', circulatingRatio: 17.5, liquidityUSD: 80_000_000 },
  dydx: { capUSD: 410_000_000, fdvUSD: 820_000_000, circulating: '640M DYDX', total: '1B DYDX', circulatingRatio: 64.0, liquidityUSD: 75_000_000 },
  neiro: { capUSD: 390_000_000, fdvUSD: 390_000_000, circulating: '420B NEIRO', total: '420B NEIRO', circulatingRatio: 100, liquidityUSD: 75_000_000 },
  ethfi: { capUSD: 380_000_000, fdvUSD: 2_150_000_000, circulating: '175M ETHFI', total: '1B ETHFI', circulatingRatio: 17.5, liquidityUSD: 62_000_000 },
  '1inch': { capUSD: 380_000_000, fdvUSD: 490_000_000, circulating: '1.28B 1INCH', total: '1.5B 1INCH', circulatingRatio: 85.3, liquidityUSD: 78_000_000 },
  comp: { capUSD: 360_000_000, fdvUSD: 420_000_000, circulating: '8.8M COMP', total: '10M COMP', circulatingRatio: 88.0, liquidityUSD: 68_000_000 },
  jto: { capUSD: 340_000_000, fdvUSD: 2_650_000_000, circulating: '131M JTO', total: '1B JTO', circulatingRatio: 13.1, liquidityUSD: 70_000_000 },
  dogs: { capUSD: 340_000_000, fdvUSD: 370_000_000, circulating: '516B DOGS', total: '550B DOGS', circulatingRatio: 93.8, liquidityUSD: 68_000_000 },
  io: { capUSD: 320_000_000, fdvUSD: 1_650_000_000, circulating: '120M IO', total: '800M IO', circulatingRatio: 15.0, liquidityUSD: 65_000_000 },
  drift: { capUSD: 280_000_000, fdvUSD: 1_420_000_000, circulating: '255M DRIFT', total: '1B DRIFT', circulatingRatio: 25.5, liquidityUSD: 52_000_000 },
  blur: { capUSD: 240_000_000, fdvUSD: 720_000_000, circulating: '1.85B BLUR', total: '3B BLUR', circulatingRatio: 61.7, liquidityUSD: 55_000_000 },

  // === 4. MICRO CAP ($10M - $100M) ===
  turbo: { capUSD: 85_000_000, fdvUSD: 85_000_000, circulating: '69B TURBO', total: '69B TURBO', circulatingRatio: 100, liquidityUSD: 18_000_000 },
  lista: { capUSD: 78_000_000, fdvUSD: 410_000_000, circulating: '230M LISTA', total: '1B LISTA', circulatingRatio: 23.0, liquidityUSD: 16_000_000 },
  kmno: { capUSD: 72_000_000, fdvUSD: 720_000_000, circulating: '1.35B KMNO', total: '10B KMNO', circulatingRatio: 13.5, liquidityUSD: 15_000_000 },
  ath: { capUSD: 65_000_000, fdvUSD: 820_000_000, circulating: '4.05B ATH', total: '42B ATH', circulatingRatio: 9.6, liquidityUSD: 14_000_000 },
  tnsr: { capUSD: 52_000_000, fdvUSD: 420_000_000, circulating: '125M TNSR', total: '1B TNSR', circulatingRatio: 12.5, liquidityUSD: 11_000_000 },
  bb: { capUSD: 48_000_000, fdvUSD: 490_000_000, circulating: '409M BB', total: '2.1B BB', circulatingRatio: 19.5, liquidityUSD: 12_000_000 },
  rez: { capUSD: 45_000_000, fdvUSD: 380_000_000, circulating: '1.15B REZ', total: '10B REZ', circulatingRatio: 11.5, liquidityUSD: 10_000_000 },

  // === 5. SUPER LOW CAP (< $10M) ===
  xpl: { capUSD: 1_420_000, fdvUSD: 2_150_000, circulating: '1.02M XPL', total: '1.5M XPL', circulatingRatio: 68.0, liquidityUSD: 285_000 },
};

/**
 * Định dạng số tiền USD sang chữ ngắn gọn ($1.72T, $6.38B, $785M, $1.42M)
 */
export function formatCapUSD(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

// Cache in-memory O(1) để triệt tiêu việc tính toán lặp lại hàng nghìn lần mỗi giây
const capAuditCache = new Map<string, CapTierAudit>();

/**
 * Hàm phân tích phân khúc vốn hóa & độ sâu thanh khoản toàn diện cho từng token
 */
export function getCapTierAudit(token: {
  symbol: string;
  name?: string;
  basePrice?: number;
  globalAvgPrice?: number;
  marketCapUSD?: number;
}): CapTierAudit {
  const sym = token.symbol.toLowerCase();
  if (!token.marketCapUSD && capAuditCache.has(sym)) {
    return capAuditCache.get(sym)!;
  }
  const livePrice = token.globalAvgPrice || token.basePrice || 1;

  // Lấy dữ liệu mẫu nếu có trong bảng KNOWN_CAP_DATA
  const known = KNOWN_CAP_DATA[sym];

  let marketCapUSD: number;
  let fdvUSD: number;
  let circulatingSupply: string;
  let totalSupply: string;
  let circulatingRatio: number;
  let liquidityPoolUSD: number;

  if (token.marketCapUSD && token.marketCapUSD > 0) {
    marketCapUSD = token.marketCapUSD;
    fdvUSD = known ? known.fdvUSD : marketCapUSD * 1.5;
    circulatingSupply = known ? known.circulating : 'Đang cập nhật';
    totalSupply = known ? known.total : 'Đang cập nhật';
    circulatingRatio = known ? known.circulatingRatio : 65.0;
    liquidityPoolUSD = known ? known.liquidityUSD : marketCapUSD * 0.15;
  } else if (known) {
    marketCapUSD = known.capUSD;
    fdvUSD = known.fdvUSD;
    circulatingSupply = known.circulating;
    totalSupply = known.total;
    circulatingRatio = known.circulatingRatio;
    liquidityPoolUSD = known.liquidityUSD;
  } else {
    // Dự phòng thông minh cho token mới chưa có trong danh mục
    marketCapUSD = Math.max(10_000_000, livePrice * 450_000_000);
    fdvUSD = marketCapUSD * 1.6;
    circulatingSupply = '450M Token';
    totalSupply = '720M Token';
    circulatingRatio = 62.5;
    liquidityPoolUSD = marketCapUSD * 0.16;
  }

  // Tỷ lệ thanh khoản so với vốn hóa (%)
  const liquidityRatio = marketCapUSD > 0 ? +((liquidityPoolUSD / marketCapUSD) * 100).toFixed(1) : 15.0;

  // Đánh giá sức khỏe thanh khoản (An toàn tối thiểu 15-20% vốn hóa)
  let liquidityHealth: CapTierAudit['liquidityHealth'] = 'SAFE';
  if (liquidityRatio >= 20) {
    liquidityHealth = 'EXCELLENT';
  } else if (liquidityRatio >= 14) {
    liquidityHealth = 'SAFE';
  } else if (liquidityRatio >= 8) {
    liquidityHealth = 'WARNING';
  } else {
    liquidityHealth = 'CRITICAL_THIN';
  }

  // Phân loại phân khúc vốn hóa (Cap Tier) chuẩn Quốc tế
  let tier: CapTier;
  let tierLabel: string;
  let badgeLabel: string;
  let badgeColor: string;
  let capRange: string;
  let riskLevel: CapTierAudit['riskLevel'];
  let riskScore: number;
  let upsidePotential: string;
  let slippageRisk: string;
  let scamRugPullRisk: string;
  let traderAdvice: string;

  if (marketCapUSD >= 10_000_000_000) {
    // 1. MEGA / LARGE CAP (> 10 Tỷ USD)
    tier = 'MEGA_CAP';
    tierLabel = 'Mega / Large Cap';
    badgeLabel = 'Mega Cap (> $10B)';
    badgeColor = 'cyan';
    capRange = '> 10 tỷ USD';
    riskLevel = 'Thấp nhất';
    riskScore = 1;
    upsidePotential = 'Biến động vừa phải, an toàn giữ tài sản lớn (+10% ~ +40%)';
    slippageRisk = 'Cực thấp (< 0.05%), thanh khoản CEX cực sâu, khớp lệnh lệnh triệu USD êm';
    scamRugPullRisk = 'Gần như bằng 0 (Đã kiểm toán đa tổ chức, minh bạch on-chain)';
    traderAdvice = 'Thích hợp tích lũy trữ tài sản dài hạn (Hodl). Khó bị cá mập thao túng giá trong ngắn hạn.';
  } else if (marketCapUSD >= 1_000_000_000) {
    // 2. MID CAP (1 Tỷ - 10 Tỷ USD)
    tier = 'MID_CAP';
    tierLabel = 'Mid Cap';
    badgeLabel = 'Mid Cap ($1B - $10B)';
    badgeColor = 'emerald';
    capRange = '1 tỷ – 10 tỷ USD';
    riskLevel = 'Trung bình';
    riskScore = 2;
    upsidePotential = 'Tiềm năng tăng trưởng tốt theo sóng hệ sinh thái (x2 ~ x5)';
    slippageRisk = 'Thấp (0.1% ~ 0.3%), thanh khoản dồi dào trên cả CEX lớn và DEX';
    scamRugPullRisk = 'Rất thấp (Nền tảng Layer 1/Layer 2 có quỹ lớn hậu thuẫn)';
    traderAdvice = 'Điểm cân bằng lý tưởng giữa tiềm năng tăng giá và an toàn vốn. Phù hợp cho chiến lược Swing Trade.';
  } else if (marketCapUSD >= 100_000_000) {
    // 3. SMALL CAP (100 Triệu - 1 Tỷ USD)
    tier = 'SMALL_CAP';
    tierLabel = 'Small Cap';
    badgeLabel = 'Small Cap ($100M - $1B)';
    badgeColor = 'amber';
    capRange = '100 triệu – 1 tỷ USD';
    riskLevel = 'Khá cao';
    riskScore = 3;
    upsidePotential = 'Dễ tăng gấp 2 – 5 lần khi có sóng ngành (DeFi, AI, Meme)';
    slippageRisk = 'Trung bình (0.5% ~ 1.5%), chịu áp lực trượt giá khi có cá mập xả';
    scamRugPullRisk = 'Thấp đến Trung bình (Dự án đã có sản phẩm chạy thực tế)';
    traderAdvice = 'Nên chốt lời từng phần khi đạt mục tiêu (DCA out). Chịu áp lực xả mạnh nếu thị trường chung điều chỉnh.';
  } else if (marketCapUSD >= 10_000_000) {
    // 4. MICRO CAP (10 Triệu - 100 Triệu USD)
    tier = 'MICRO_CAP';
    tierLabel = 'Micro Cap';
    badgeLabel = 'Micro Cap ($10M - $100M)';
    badgeColor = 'orange';
    capRange = '10 triệu – 100 triệu USD';
    riskLevel = 'Cao';
    riskScore = 4;
    upsidePotential = 'Biến động mạnh, dễ pump x5 – x15 trong thời gian ngắn';
    slippageRisk = 'Cao (2% ~ 5%), thanh khoản mỏng, dễ bị trượt giá khi gom/xả';
    scamRugPullRisk = 'Cần thận trọng (Kiểm tra lịch mở khóa token và ví Dev)';
    traderAdvice = 'Chỉ nên đi tỷ trọng vốn vừa phải (< 5% danh mục). Đặt sẵn Stop-loss nghiêm ngặt.';
  } else {
    // 5. SUPER LOW CAP (< 10 Triệu USD, thường < 2M USD)
    tier = 'SUPER_LOW_CAP';
    tierLabel = 'Super Low Cap';
    badgeLabel = 'Super Low Cap (< $10M)';
    badgeColor = 'rose';
    capRange = '< 10 triệu USD (Thường < 2M USD)';
    riskLevel = 'Cực kỳ rủi ro';
    riskScore = 5;
    upsidePotential = 'Đòn bẩy vốn cực cao: Dễ x10 – x50 chỉ sau vài giờ với dòng tiền nhỏ';
    slippageRisk = 'Cực kỳ cao (15% ~ 50%+): Bể thanh khoản mỏng, bán tháo sẽ bị sập giá sâu';
    scamRugPullRisk = 'Cực kỳ cao (95% nguy cơ Rug pull, Honeypot, Dev dump allocation)';
    traderAdvice = 'Chỉ nên tham gia với số vốn chấp nhận mất (1% - 2% tài khoản). Phải kiểm tra Liquidity Locked trên DexScreener trước khi vào lệnh!';
  }

  const auditResult: CapTierAudit = {
    tier,
    tierLabel,
    badgeLabel,
    badgeColor,
    capRange,
    marketCapUSD,
    marketCapFormatted: formatCapUSD(marketCapUSD),
    fdvUSD,
    fdvFormatted: formatCapUSD(fdvUSD),
    circulatingSupply,
    totalSupply,
    circulatingRatio,
    liquidityPoolUSD,
    liquidityPoolFormatted: formatCapUSD(liquidityPoolUSD),
    liquidityRatio,
    liquidityHealth,
    riskLevel,
    riskScore,
    upsidePotential,
    slippageRisk,
    scamRugPullRisk,
    traderAdvice,
  };

  if (!token.marketCapUSD) {
    capAuditCache.set(sym, auditResult);
  }

  return auditResult;
}
