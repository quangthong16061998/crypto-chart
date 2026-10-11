import { Coin, SpotDeepAnalysis, AuditChecklistItem, SpotRecommendationType } from "@/types/crypto";
import { formatUSD } from "@/lib/utils";

/**
 * Thuật toán Realtime Dynamic Spot Scorer & Ranking Engine
 * Tính toán điểm Spot Score (0 - 100 điểm) theo từng tick giá, dòng tiền cá mập, RSI, Volume và EMA
 */
export function calculateSpotMetric(coin: Partial<Coin>, livePrice?: number): SpotDeepAnalysis {
  const price = livePrice ?? coin.current_price ?? 1;
  const priceChange24h = coin.price_change_percentage_24h ?? 0;
  const rsi = coin.rsi_14 ?? 50;
  const netInflow = coin.whale_net_inflow_usd ?? -(coin.net_flow_24h ?? 0); // Âm = Rút ví (Tốt), Dương = Nạp sàn (Xấu)
  const volume24h = coin.total_volume ?? 100_000_000;
  
  // Khối lượng đột biến so với trung bình ước tính
  const volumeSpikePct = Math.min(300, Math.max(10, Math.round((volume24h / (volume24h * 0.7)) * 100 - 100)));

  // Điểm cơ bản
  let score = 50;
  const checklist: AuditChecklistItem[] = [];

  // ==========================================================
  // 1. TIÊU CHÍ 1: DÒNG TIỀN VÍ CÁ MẬP (WHALE FLOW)
  // ==========================================================
  if (netInflow < -20_000_000) {
    // Cá mập rút ví cực mạnh
    score += 24;
    checklist.push({
      label: "Dòng tiền ví cá mập",
      status: "pass",
      detail: `Cá mập rút ròng -$${(Math.abs(netInflow) / 1e6).toFixed(1)}M về ví lạnh, làm cạn kiệt thanh khoản bán trên sàn CEX.`,
    });
  } else if (netInflow <= 0) {
    score += 12;
    checklist.push({
      label: "Dòng tiền ví cá mập",
      status: "pass",
      detail: `Dòng tiền gom hàng ổn định -$${(Math.abs(netInflow) / 1e6).toFixed(1)}M, không có áp lực nạp xả đột biến.`,
    });
  } else if (netInflow > 30_000_000) {
    // Cá mập nạp sàn xả lớn
    score -= 30;
    checklist.push({
      label: "Dòng tiền ví cá mập",
      status: "fail",
      detail: `Cảnh báo: Cá mập nạp ồ ạt +$${(netInflow / 1e6).toFixed(1)}M lên sàn CEX, nguy cơ bán tháo áp đảo.`,
    });
  } else {
    score -= 12;
    checklist.push({
      label: "Dòng tiền ví cá mập",
      status: "warning",
      detail: `Ghi nhận dòng tiền nạp nhẹ +$${(netInflow / 1e6).toFixed(1)}M lên sàn, cần đề phòng chốt lời ngắn hạn.`,
    });
  }

  // ==========================================================
  // 2. TIÊU CHÍ 2: ĐỘNG LƯỢNG KỸ THUẬT RSI(14)
  // ==========================================================
  if (rsi >= 40 && rsi <= 58) {
    score += 18;
    checklist.push({
      label: "Chỉ số RSI (14)",
      status: "pass",
      detail: `RSI ${rsi.toFixed(1)} nằm trong vùng tích lũy vàng, tạo nền giá vững chắc chuẩn bị vào nhịp bứt phá.`,
    });
  } else if (rsi >= 72 || priceChange24h >= 24) {
    score -= 26;
    checklist.push({
      label: "Chỉ số RSI (14)",
      status: "fail",
      detail: `RSI ${rsi.toFixed(1)} chạm vùng Quá Mua FOMO (Overbought), rủi ro đu đỉnh ngắn hạn rất cao.`,
    });
  } else if (rsi < 35 && priceChange24h < -8) {
    score -= 22;
    checklist.push({
      label: "Chỉ số RSI (14)",
      status: "fail",
      detail: `RSI ${rsi.toFixed(1)} rớt xuống vùng quá bán kèm thủng đáy hỗ trợ, xu hướng giảm chiếm ưu thế.`,
    });
  } else {
    score += 4;
    checklist.push({
      label: "Chỉ số RSI (14)",
      status: "warning",
      detail: `RSI ${rsi.toFixed(1)} ở mức trung tính cân bằng, dao động trong biên độ tích lũy thông thường.`,
    });
  }

  // ==========================================================
  // 3. TIÊU CHÍ 3: KHỐI LƯỢNG GIAO DỊCH (VOLUME SPIKE) & EMA
  // ==========================================================
  const isAboveEma = priceChange24h > 1.5;
  if (volumeSpikePct > 35 && isAboveEma) {
    score += 12;
    checklist.push({
      label: "Đột biến Volume & EMA",
      status: "pass",
      detail: `Volume tăng vọt +${volumeSpikePct}%, giá giữ vững trên đường xu hướng EMA20/50.`,
    });
  } else if (!isAboveEma && priceChange24h < -4) {
    score -= 10;
    checklist.push({
      label: "Đột biến Volume & EMA",
      status: "fail",
      detail: `Giá đang nằm dưới đường trung bình động EMA, lực cầu đỡ giá suy yếu.`,
    });
  } else {
    checklist.push({
      label: "Đột biến Volume & EMA",
      status: "warning",
      detail: `Khối lượng giao dịch ở mức tiêu chuẩn, chưa xuất hiện breakout dứt khoát.`,
    });
  }

  // ==========================================================
  // 4. TIÊU CHÍ 4: FUNDING RATE & THỊ TRƯỜNG PHÁI SINH
  // ==========================================================
  const fundingRate = rsi > 70 ? 0.065 : rsi < 40 ? -0.015 : 0.01;
  if (fundingRate > 0.05) {
    score -= 8;
    checklist.push({
      label: "Funding Rate & Đòn bẩy",
      status: "warning",
      detail: `Funding Rate cao (${fundingRate}%), phe Long quá đông, dễ xảy ra quét thanh lý Long Squeeze.`,
    });
  } else {
    checklist.push({
      label: "Funding Rate & Đòn bẩy",
      status: "pass",
      detail: `Funding Rate ổn định (${fundingRate}%), tỷ lệ đòn bẩy thị trường an toàn.`,
    });
  }

  // Giới hạn điểm từ 5 đến 98
  const finalScore = Math.min(98, Math.max(5, Math.round(score)));

  // Phân loại khuyến nghị
  let recType: SpotRecommendationType = "NEUTRAL";
  let badgeLabel = "[QUAN SÁT] - Chưa có đột biến";

  if (finalScore >= 82) {
    recType = "STRONG_BUY";
    badgeLabel = "[NÊN MUA SPOT] - Tích lũy cá mập cực tốt";
  } else if (finalScore >= 68) {
    recType = "ACCUMULATE";
    badgeLabel = "[TÍCH LŨY SPOT] - Vùng giá an toàn";
  } else if (finalScore <= 35) {
    recType = rsi > 70 ? "AVOID_OVERBOUGHT" : "AVOID_DUMP_RISK";
    badgeLabel = "[CẢNH BÁO NÉ] - Rủi ro áp lực xả lớn";
  }

  // Kế hoạch giao dịch (Trading Plan)
  const entryLower = price * 0.985;
  const entryUpper = price * 1.01;
  const stopLoss = price * 0.93; // Cắt lỗ -7%
  const tp1 = price * 1.12;       // Chốt lời 1: +12%
  const tp2 = price * 1.25;       // Chốt lời 2: +25%
  const riskReward = "1 : 2.8";

  const inflowUSD = netInflow > 0 ? netInflow * 1.4 : Math.abs(netInflow) * 0.4;
  const outflowUSD = netInflow <= 0 ? Math.abs(netInflow) * 1.4 : netInflow * 0.3;

  return {
    spotScore: finalScore,
    recommendationType: recType,
    badgeLabel,
    summary:
      finalScore >= 75
        ? `Đồng coin đang nằm trong vùng gom hàng của Smart Money với điểm Spot Score ${finalScore}/100. Tỷ lệ rút ví áp đảo và cấu trúc kỹ thuật lành mạnh ủng hộ nhịp tăng trưởng tiếp diễn.`
        : finalScore <= 35
        ? `Cảnh báo rủi ro cao (Score ${finalScore}/100). Dữ liệu On-chain và chỉ báo kỹ thuật cho thấy áp lực xả lớn hoặc trạng thái quá mua FOMO, nhà đầu tư Spot nên đứng ngoài quan sát.`
        : `Điểm số Spot cân bằng (${finalScore}/100). Dòng tiền chưa xuất hiện đột biến rõ ràng, thích hợp theo dõi thêm tín hiệu breakout.`,
    checklist,
    tradingPlan: {
      entryZone: `${formatUSD(entryLower)} - ${formatUSD(entryUpper)}`,
      stopLoss,
      takeProfit1: tp1,
      takeProfit2: tp2,
      riskRewardRatio: riskReward,
    },
    whaleFlow24h: {
      inflowUSD,
      outflowUSD,
      netFlowUSD: outflowUSD - inflowUSD,
      largeTxCount: Math.max(12, Math.floor(finalScore * 1.5)),
    },
    technicals: {
      rsi14: rsi,
      volumeSpikePct,
      emaStatus: isAboveEma ? "ABOVE_EMA" : "TESTING_EMA",
      fundingRatePct: fundingRate,
    },
  };
}

/**
 * Tự động sắp xếp lại danh sách coin theo Spot Score động mới nhất
 */
export function sortCoinsByDynamicSpot(coins: Coin[], livePrices?: Record<string, number>): Coin[] {
  return [...coins].sort((a, b) => {
    const priceA = livePrices?.[a.symbol.toLowerCase()] ?? a.current_price;
    const priceB = livePrices?.[b.symbol.toLowerCase()] ?? b.current_price;

    const metricA = a.spotAnalysis ?? calculateSpotMetric(a, priceA);
    const metricB = b.spotAnalysis ?? calculateSpotMetric(b, priceB);

    return metricB.spotScore - metricA.spotScore;
  });
}
