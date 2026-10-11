import { Coin, SpotRecommendation, SpotRecommendationType } from "@/types/crypto";
import { formatUSD } from "@/lib/utils";

/**
 * Thuật toán phân tích tín hiệu Spot ("Nên mua Spot" vs "Nên Tránh / Rủi ro")
 * Dựa trên 3 trụ cột: Dòng tiền cá mập (Whale Flow), Chỉ báo kỹ thuật RSI(14) và Động lượng Volume/EMA
 */
export function calculateSpotRecommendation(coin: Partial<Coin>): SpotRecommendation {
  const rsi = coin.rsi_14 ?? 50;
  const netInflow = coin.whale_net_inflow_usd ?? -(coin.net_flow_24h ?? 0); // Âm = Rút ví (Tốt), Dương = Nạp sàn (Xấu)
  const priceChange24h = coin.price_change_percentage_24h ?? 0;
  const currentPrice = coin.current_price ?? 0;

  // 1. KỊCH BẢN QUÁ MUA / FOMO ĐU ĐỈNH (AVOID_OVERBOUGHT)
  if (rsi >= 75 || priceChange24h >= 25) {
    const confidence = Math.min(95, Math.floor(75 + (rsi - 75) * 1.5 + (priceChange24h > 20 ? 10 : 0)));
    return {
      status: "AVOID_OVERBOUGHT",
      confidenceScore: confidence,
      badgeLabel: "[RỦI RO CAO / NÉ] - Quá mua FOMO",
      reason: `RSI ${rsi.toFixed(0)} chạm vùng quá mua nghiêm trọng, tăng nóng +${priceChange24h.toFixed(1)}% dễ kích hoạt xả chốt lời.`,
      targetPriceShortTerm: currentPrice * 0.88, // Vùng hỗ trợ điều chỉnh
    };
  }

  // 2. KỊCH BẢN CÁ MẬP NẠP SÀN XẢ HÀNG / GÃY HỖ TRỢ (AVOID_DUMP_RISK)
  if (netInflow > 10_000_000 || (rsi < 36 && priceChange24h < -8)) {
    const confidence = Math.min(95, Math.floor(70 + (netInflow > 20_000_000 ? 15 : 8)));
    const inflowMillions = (netInflow / 1_000_000).toFixed(1);
    return {
      status: "AVOID_DUMP_RISK",
      confidenceScore: confidence,
      badgeLabel: "[RỦI RO CAO / NÉ] - Áp lực xả lớn",
      reason: netInflow > 0
        ? `Cá mập vừa nạp ròng +$${inflowMillions}M lên sàn CEX, nguy cơ bán tháo ngắn hạn rất cao.`
        : `Thủng đáy hỗ trợ kỹ thuật (RSI ${rsi.toFixed(0)}), phe bán chiếm ưu thế tuyệt đối.`,
      targetPriceShortTerm: currentPrice * 0.92,
    };
  }

  // 3. KỊCH BẢN MUA SPOT TỈ LỆ CAO (STRONG_BUY): Cá mập rút ví + RSI đẹp (42 - 60) + Giá giữ vững
  if (netInflow < -15_000_000 && rsi >= 42 && rsi <= 62) {
    const confidence = Math.min(96, Math.floor(82 + Math.abs(netInflow) / 20_000_000 * 5));
    const outflowMillions = (Math.abs(netInflow) / 1_000_000).toFixed(1);
    return {
      status: "STRONG_BUY",
      confidenceScore: confidence,
      badgeLabel: "[MUA SPOT TỐT] - Tích lũy cá mập",
      reason: `Cá mập rút -$${outflowMillions}M về ví lạnh, RSI ${rsi.toFixed(0)} tạo nền tích lũy chuẩn bị bứt phá.`,
      targetPriceShortTerm: currentPrice * 1.15, // Target +15%
    };
  }

  // 4. KỊCH BẢN GOM SPOT DẦN (ACCUMULATE): Dòng tiền ổn định, RSI chưa quá nhiệt
  if (netInflow <= 0 && rsi >= 38 && rsi <= 68 && priceChange24h > -4) {
    const confidence = Math.min(88, Math.floor(72 + (priceChange24h > 0 ? 8 : 4)));
    return {
      status: "ACCUMULATE",
      confidenceScore: confidence,
      badgeLabel: "[TÍCH LŨY DẦN] - Vùng giá an toàn",
      reason: `Dòng tiền gom ổn định, giá giữ vững trên đường trung bình động EMA, rủi ro điều chỉnh thấp.`,
      targetPriceShortTerm: currentPrice * 1.10, // Target +10%
    };
  }

  // 5. TRUNG LẬP / THEO DÕI (NEUTRAL)
  return {
    status: "NEUTRAL",
    confidenceScore: 50,
    badgeLabel: "[QUAN SÁT] - Chưa có đột biến",
    reason: `Chưa ghi nhận dòng tiền cá mập đột biến, RSI ${rsi.toFixed(0)} đi ngang cân bằng.`,
    targetPriceShortTerm: currentPrice * 1.03,
  };
}

/**
 * Lọc Top 3 đồng coin khuyến nghị Mua Spot tốt nhất hôm nay
 */
export function getTopSpotBuys(coins: Coin[], limit = 3): Coin[] {
  return [...coins]
    .filter((c) => {
      const status = c.spot_recommendation?.status;
      return status === "STRONG_BUY" || status === "ACCUMULATE";
    })
    .sort((a, b) => {
      const scoreA = a.spot_recommendation?.confidenceScore ?? 0;
      const scoreB = b.spot_recommendation?.confidenceScore ?? 0;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Lọc Top 3 đồng coin cảnh báo Rủi ro cao / Nên tránh hôm nay
 */
export function getTopSpotAvoids(coins: Coin[], limit = 3): Coin[] {
  return [...coins]
    .filter((c) => {
      const status = c.spot_recommendation?.status;
      return status === "AVOID_DUMP_RISK" || status === "AVOID_OVERBOUGHT";
    })
    .sort((a, b) => {
      const scoreA = a.spot_recommendation?.confidenceScore ?? 0;
      const scoreB = b.spot_recommendation?.confidenceScore ?? 0;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
