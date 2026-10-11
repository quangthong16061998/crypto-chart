/**
 * Cấu hình danh mục Token theo dõi chuẩn cho WhalePulse Crypto Radar
 * Bao gồm: Core Layer 1 (BTC, ETH, SOL, NEAR, APT), Layer 2 (ARB, OP), DeFi & Trending (RAY, ENS, XPL)
 */

export interface TokenConfig {
  id: string;
  symbol: string;
  name: string;
  image: string;
  category: "Layer 1" | "Layer 2" | "DeFi" | "Infra" | "NEAR Ecosystem" | "Trending";
  binanceSymbol: string | null; // e.g. "nearusdt", null nếu là token DEX chưa list Binance spot
  coingeckoId: string;
  contractAddress?: string;
  blockchain: "bitcoin" | "ethereum" | "solana" | "near" | "arbitrum" | "optimism";
  defaultPrice: number;
  decimals: number;
}

export const WATCHLIST_TOKENS: TokenConfig[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    category: "Layer 1",
    binanceSymbol: "btcusdt",
    coingeckoId: "bitcoin",
    blockchain: "bitcoin",
    defaultPrice: 94820.50,
    decimals: 8,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    category: "Layer 1",
    binanceSymbol: "ethusdt",
    coingeckoId: "ethereum",
    blockchain: "ethereum",
    defaultPrice: 3450.80,
    decimals: 18,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    category: "Layer 1",
    binanceSymbol: "solusdt",
    coingeckoId: "solana",
    blockchain: "solana",
    defaultPrice: 218.45,
    decimals: 9,
  },
  {
    id: "near",
    symbol: "near",
    name: "NEAR Protocol",
    image: "https://assets.coingecko.com/coins/images/10365/large/near.png",
    category: "NEAR Ecosystem",
    binanceSymbol: "nearusdt",
    coingeckoId: "near",
    blockchain: "near",
    defaultPrice: 6.85,
    decimals: 24,
  },
  {
    id: "arbitrum",
    symbol: "arb",
    name: "Arbitrum",
    image: "https://assets.coingecko.com/coins/images/16547/large/arbitrum_logo.png",
    category: "Layer 2",
    binanceSymbol: "arbusdt",
    coingeckoId: "arbitrum",
    contractAddress: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    blockchain: "arbitrum",
    defaultPrice: 1.15,
    decimals: 18,
  },
  {
    id: "aptos",
    symbol: "apt",
    name: "Aptos",
    image: "https://assets.coingecko.com/coins/images/26455/large/aptos_round.png",
    category: "Layer 1",
    binanceSymbol: "aptusdt",
    coingeckoId: "aptos",
    blockchain: "arbitrum",
    defaultPrice: 11.45,
    decimals: 8,
  },
  {
    id: "optimism",
    symbol: "op",
    name: "Optimism",
    image: "https://assets.coingecko.com/coins/images/25244/large/Optimism.png",
    category: "Layer 2",
    binanceSymbol: "opusdt",
    coingeckoId: "optimism",
    contractAddress: "0x4200000000000000000000000000000000000042",
    blockchain: "optimism" as any,
    defaultPrice: 2.35,
    decimals: 18,
  },
  {
    id: "raydium",
    symbol: "ray",
    name: "Raydium",
    image: "https://assets.coingecko.com/coins/images/13928/large/Raydium_Acorn.png",
    category: "DeFi",
    binanceSymbol: "rayusdt",
    coingeckoId: "raydium",
    contractAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    blockchain: "solana",
    defaultPrice: 5.68,
    decimals: 6,
  },
  {
    id: "ethereum-name-service",
    symbol: "ens",
    name: "ENS",
    image: "https://assets.coingecko.com/coins/images/19785/large/acatxTm8_400x400.jpg",
    category: "Infra",
    binanceSymbol: "ensusdt",
    coingeckoId: "ethereum-name-service",
    contractAddress: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
    blockchain: "ethereum",
    defaultPrice: 38.90,
    decimals: 18,
  },
  {
    id: "x-protocol",
    symbol: "xpl",
    name: "X-Protocol",
    image: "https://assets.coingecko.com/coins/images/28206/large/ftx789.png",
    category: "Trending",
    binanceSymbol: null, // DEX / Fallback Simulated Stream
    coingeckoId: "x-protocol",
    blockchain: "arbitrum",
    defaultPrice: 0.845,
    decimals: 18,
  },
];

/**
 * Lấy danh sách các cặp stream Binance WebSocket hợp lệ
 */
export function getBinanceStreamSymbols(): string[] {
  return WATCHLIST_TOKENS
    .map((t) => t.binanceSymbol)
    .filter((s): s is string => Boolean(s));
}
