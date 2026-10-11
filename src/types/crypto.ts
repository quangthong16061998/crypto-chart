/**
 * Định nghĩa Type/Interface cho WhalePulse Crypto Radar
 * Mở rộng: Hỗ trợ Realtime WebSocket, Checklist Audit và Chi Tiết Khuyến Nghị Spot
 */

export type AssetCategory = 
  | "All" 
  | "Layer 1" 
  | "Layer 2" 
  | "DeFi" 
  | "Infra" 
  | "Meme" 
  | "AI" 
  | "NEAR Ecosystem" 
  | "Trending"
  | "Stablecoin";

export interface CoinSparkline {
  price: number[];
}

export type SpotRecommendationType = 
  | "STRONG_BUY"         // Mua mạnh: Tích lũy cá mập + RSI hồi phục + Khối lượng bứt phá
  | "ACCUMULATE"         // Gom dần: Cá mập rút ví lạnh đều đặn, giữ trên EMA
  | "NEUTRAL"            // Quan sát: Chưa có dòng tiền đột biến
  | "AVOID_OVERBOUGHT"   // Tránh: Quá mua, FOMO RSI > 72, rủi ro đu đỉnh
  | "AVOID_DUMP_RISK";   // Cảnh báo đỏ: Cá mập nạp sàn ồ ạt hoặc gãy hỗ trợ kỹ thuật

export interface SpotRecommendation {
  status: SpotRecommendationType;
  confidenceScore: number;     // 0 - 100%
  badgeLabel: string;          // e.g. "[MUA SPOT TỐT] - Tích lũy cá mập" | "[RỦI RO CAO / NÉ] - Áp lực xả"
  reason: string;              // e.g. "Cá mập rút $12M về ví lạnh, RSI 48 đẹp"
  targetPriceShortTerm?: number; // Mục tiêu giá ngắn hạn (USD)
}

export interface AuditChecklistItem {
  label: string;
  status: "pass" | "fail" | "warning"; // pass = xanh, fail = đỏ, warning = vàng
  detail: string;
}

export interface SpotDeepAnalysis {
  spotScore: number; // 0 - 100
  recommendationType: SpotRecommendationType;
  badgeLabel: string;
  summary: string;
  checklist: AuditChecklistItem[];
  tradingPlan: {
    entryZone: string;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
    riskRewardRatio: string;
  };
  whaleFlow24h: {
    inflowUSD: number;
    outflowUSD: number;
    netFlowUSD: number;
    largeTxCount: number;
  };
  technicals: {
    rsi14: number;
    volumeSpikePct: number;
    emaStatus: "ABOVE_EMA" | "TESTING_EMA" | "BELOW_EMA";
    fundingRatePct: number;
  };
}

export interface RealtimePriceUpdate {
  symbol: string;
  price: number;
  direction: "up" | "down" | "same";
  timestamp: number;
  change24h?: number;
  high24h?: number;
  low24h?: number;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: CoinSparkline;
  circulating_supply?: number;
  total_supply?: number;
  category: AssetCategory;
  whale_activity_score?: number; // Điểm hoạt động cá mập 0-100
  net_flow_24h?: number; // USD dòng tiền ròng 24h (+ Inflow / - Outflow)
  ath?: number;
  ath_change_percentage?: number;
  // Các chỉ số phục vụ thuật toán Spot Signal
  rsi_14?: number;
  whale_net_inflow_usd?: number; // Âm: Cá mập rút ra khỏi sàn (Tốt). Dương: Cá mập nạp lên sàn (Xấu).
  spot_recommendation?: SpotRecommendation;
  spotAnalysis?: SpotDeepAnalysis;
  is_near_ecosystem?: boolean;
}

export type WhaleTransactionType = 
  | "wallet_to_exchange"   // Cá mập nạp sàn -> Nguy cơ xả hàng (DUMP_RISK)
  | "exchange_to_wallet"   // Cá mập rút ví lạnh -> Gom hàng tích lũy (ACCUMULATION)
  | "exchange_to_exchange" // Chuyển đổi giữa các sàn (ARBITRAGE/LIQUIDITY)
  | "wallet_to_wallet";    // Giao dịch OTC hoặc chuyển ví cá mập

export type WhaleImpactSignal = 
  | "DUMP_ALERT"        // Cảnh báo bán tháo
  | "ACCUMULATION"      // Tích lũy gom hàng
  | "INTERNAL_TRANSFER" // Chuyển nội bộ
  | "HIGH_VOLATILITY";  // Biến động mạnh

export interface WhaleTransaction {
  id: string;
  blockchain: "bitcoin" | "ethereum" | "solana" | "binance-smart-chain" | "arbitrum" | "polygon" | "near" | "optimism";
  symbol: string;
  coin_name: string;
  coin_icon?: string;
  amount: number;
  amount_usd: number;
  transaction_type: WhaleTransactionType;
  from_address: string;
  from_owner: string; // Tên sàn hoặc "Cá mập ẩn danh"
  to_address: string;
  to_owner: string;   // Tên sàn hoặc "Ví cá voi"
  timestamp: number;
  hash: string;
  impact_signal: WhaleImpactSignal;
  explorer_url: string;
  fee_usd?: number;
}

export interface FearAndGreedData {
  value: number; // 0 - 100
  value_classification: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
  timestamp: string;
}

export interface MarketOverview {
  total_market_cap_usd: number;
  total_volume_24h_usd: number;
  market_cap_change_percentage_24h_usd: number;
  btc_dominance: number;
  eth_dominance: number;
  fear_greed: FearAndGreedData;
  cex_net_inflow_24h: number;     // USD Inflow - Outflow
  cex_total_inflow_24h: number;
  cex_total_outflow_24h: number;
  whale_tx_count_24h: number;
  total_whale_volume_24h: number;
  active_alerts_count: number;
  last_updated: number;
  near_stats?: {
    current_price: number;
    price_change_24h: number;
    tvl_usd: number;
    whale_net_flow_24h: number;
    recommendation: SpotRecommendation;
  };
}

export type AlertType = 
  | "VOLUME_SPIKE" 
  | "TOP_GAINER" 
  | "TOP_LOSER" 
  | "WHALE_DUMP_RISK" 
  | "WHALE_ACCUMULATION" 
  | "BREAKOUT"
  | "SPOT_STRONG_BUY"
  | "NEAR_ECOSYSTEM_ALERT";

export interface MarketAlert {
  id: string;
  coin_symbol: string;
  coin_name: string;
  coin_icon: string;
  type: AlertType;
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  metric: string;
  timestamp: number;
}

export interface ChainFlowData {
  chain: string;
  inflow_usd: number;
  outflow_usd: number;
  net_usd: number;
  tx_count: number;
}
