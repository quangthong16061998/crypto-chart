import { NextResponse } from "next/server";
import { connection } from "next/server";
import { fetchMarketCoins, fetchMarketOverview, generateMarketAlerts, fetchChainFlows } from "@/lib/api/crypto";

// Tự động cache kết quả 30s với Cache-Control headers (Tương thích Next.js 16 cacheComponents)

/**
 * Route Handler: /api/market
 * Trả về danh sách Coin, Overview thị trường, Tín hiệu cảnh báo và Dòng tiền chain
 */
export async function GET() {
  try {
    const [coins, overview, alerts] = await Promise.all([
      fetchMarketCoins(),
      fetchMarketOverview(),
      generateMarketAlerts(),
    ]);

    const chainFlows = fetchChainFlows();

    // Top Gainers & Losers
    const topGainers = [...coins]
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);

    const topLosers = [...coins]
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);

    return NextResponse.json(
      {
        success: true,
        data: {
          coins,
          overview,
          alerts,
          chainFlows,
          topGainers,
          topLosers,
        },
        timestamp: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/market route handler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch market data",
      },
      { status: 500 }
    );
  }
}
