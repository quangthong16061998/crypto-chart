import { NextResponse } from "next/server";
import { connection } from "next/server";
import { fetchWhaleTransactions } from "@/lib/api/crypto";
import { generateSimulatedWhaleTx } from "@/lib/mockData";

/**
 * Route Handler: /api/whale
 * Trả về danh sách giao dịch cá mập gần nhất và hỗ trợ tạo giao dịch realtime mô phỏng
 */
export async function GET(request: Request) {
  // Chờ incoming user request, dừng static prerendering
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Nếu client yêu cầu sinh giao dịch mô phỏng mới
    if (action === "simulate") {
      const newTx = generateSimulatedWhaleTx();
      return NextResponse.json({
        success: true,
        data: newTx,
      });
    }

    const transactions = await fetchWhaleTransactions();

    // Thống kê nhanh dòng tiền CEX Inflow/Outflow từ transactions
    let inflowUSD = 0;
    let outflowUSD = 0;
    let dumpAlertsCount = 0;
    let accumulationCount = 0;

    transactions.forEach((tx) => {
      if (tx.transaction_type === "wallet_to_exchange") {
        inflowUSD += tx.amount_usd;
        dumpAlertsCount++;
      } else if (tx.transaction_type === "exchange_to_wallet") {
        outflowUSD += tx.amount_usd;
        accumulationCount++;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        stats: {
          total_transactions: transactions.length,
          inflow_usd: inflowUSD,
          outflow_usd: outflowUSD,
          net_flow_usd: outflowUSD - inflowUSD, // Dương = Tích lũy ròng
          dump_alerts_count: dumpAlertsCount,
          accumulation_count: accumulationCount,
        },
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error in /api/whale route handler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch whale transactions",
      },
      { status: 500 }
    );
  }
}
