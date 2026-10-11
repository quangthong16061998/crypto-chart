import { TokenItem } from '@/app/page';
import { getDecimalsForPrice } from '@/lib/priceFormatter';

export const RAW_TOP_100_DEFS = [
  // --- TOP 1 - 10 ---
  {
    id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', category: 'Layer 1',
    basePrice: 87450.2, priceChange24h: 3.42, high24h: 88920.0, low24h: 84310.0, volume24h: '38.4B', rsi: 54.2,
    whaleInflowUSD: 345.8, whaleOutflowUSD: 820.4, netWhaleFlow: 474.6, spotScore: 92,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT MUA NGAY', confidence: 95,
    reasons: ['Cá mập rút ròng kỷ lục $474.6M khỏi Binance & Coinbase về ví lạnh.', 'RSI (14) = 54.2 ở vùng đệm tăng trưởng rất thoáng, không quá mua.', 'Funding rate trung hòa (0.008%), đòn bẩy futures chưa quá nóng.'],
    risks: ['Kháng cự tâm lý mốc $90,000 cần volume bứt phá dứt khoát.'],
    entryTarget: '$86,200 - $87,500', stopLoss: '$83,800', takeProfit: '$92,000 - $96,000'
  },
  {
    id: 'ethereum', symbol: 'ETH', name: 'Ethereum', category: 'Layer 1',
    basePrice: 3120.45, priceChange24h: 1.85, high24h: 3180.0, low24h: 3045.0, volume24h: '19.8B', rsi: 51.0,
    whaleInflowUSD: 180.2, whaleOutflowUSD: 395.5, netWhaleFlow: 215.3, spotScore: 88,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT MẠNH', confidence: 90,
    reasons: ['Net Outflow cá mập dương $215.3M (tích lũy staking & re-staking).', 'Lượng ETH trên các sàn CEX chạm đáy thấp nhất 6 tháng qua.'],
    risks: ['Tỷ giá ETH/BTC cần xác nhận đáy vững chắc hơn.'],
    entryTarget: '$3,080 - $3,140', stopLoss: '$2,970', takeProfit: '$3,450 - $3,680'
  },
  {
    id: 'solana', symbol: 'SOL', name: 'Solana', category: 'Layer 1',
    basePrice: 215.8, priceChange24h: 7.64, high24h: 222.5, low24h: 198.1, volume24h: '9.2B', rsi: 62.4,
    whaleInflowUSD: 142.0, whaleOutflowUSD: 298.0, netWhaleFlow: 156.0, spotScore: 84,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 85,
    reasons: ['DEX Volume vượt trội, dòng tiền cá mập Solana tiếp tục rút ròng $156M.', 'Khối lượng giao dịch 24h tăng 42% kèm giá phá đỉnh tuần.'],
    risks: ['RSI tiệm cận vùng 65, nên chia lệnh DCA tránh fomo đỉnh ngắn.'],
    entryTarget: '$208 - $214', stopLoss: '$194', takeProfit: '$240 - $265'
  },
  {
    id: 'binancecoin', symbol: 'BNB', name: 'BNB', category: 'Layer 1',
    basePrice: 642.5, priceChange24h: 2.15, high24h: 652.0, low24h: 631.0, volume24h: '1.8B', rsi: 53.5,
    whaleInflowUSD: 42.0, whaleOutflowUSD: 98.4, netWhaleFlow: 56.4, spotScore: 85,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT ĐẸP', confidence: 87,
    reasons: ['Làn sóng Launchpool liên tục kích thích dòng tiền lock BNB.', 'Dòng tiền rút ví staking chu kỳ mới đạt $56.4M.'],
    risks: ['Cản cứng tại mốc $660.'],
    entryTarget: '$630 - $642', stopLoss: '$605', takeProfit: '$690 - $725'
  },
  {
    id: 'ripple', symbol: 'XRP', name: 'XRP', category: 'Layer 1',
    basePrice: 1.12, priceChange24h: -4.85, high24h: 1.25, low24h: 1.08, volume24h: '4.2B', rsi: 41.2,
    whaleInflowUSD: 98.0, whaleOutflowUSD: 32.5, netWhaleFlow: -65.5, spotScore: 32,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC XẢ NGẮN HẠN', confidence: 83,
    reasons: ['Ví cá mập nạp $98M XRP lên Upbit và Binance chốt lời sau đợt pump nóng.', 'Chỉ số RSI hạ nhiệt, xuất hiện phân kỳ âm khung 4h.'],
    risks: ['Có thể điều chỉnh về vùng $0.98 trước khi tìm lại lực cầu.'],
    entryTarget: 'CHỜ QUAN SÁT VÙNG $0.98', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', category: 'Meme',
    basePrice: 0.385, priceChange24h: -6.40, high24h: 0.425, low24h: 0.368, volume24h: '6.4B', rsi: 68.2,
    whaleInflowUSD: 145.0, whaleOutflowUSD: 48.0, netWhaleFlow: -97.0, spotScore: 28,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO XẢ / NÉ', confidence: 89,
    reasons: ['Cá mập gom từ vùng $0.15 bắt đầu nạp xả $145M lên các sàn CEX.', 'Biên độ nến giằng co mạnh, funding rate phái sinh quá nóng.'],
    risks: ['Rủi ro quét Long thanh lý về $0.32.'],
    entryTarget: 'KHÔNG FOMO VÙNG NÀY', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'cardano', symbol: 'ADA', name: 'Cardano', category: 'Layer 1',
    basePrice: 0.745, priceChange24h: 5.12, high24h: 0.785, low24h: 0.695, volume24h: '1.2B', rsi: 58.4,
    whaleInflowUSD: 28.5, whaleOutflowUSD: 64.2, netWhaleFlow: 35.7, spotScore: 81,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 82,
    reasons: ['Dòng tiền ví lớn tích lũy ròng $35.7M sau khi phá vỡ cản chéo D1.', 'Khối lượng giao dịch hợp đồng thông minh Cardano tăng 28%.'],
    risks: ['Cần giữ vững hỗ trợ $0.71.'],
    entryTarget: '$0.72 - $0.75', stopLoss: '$0.67', takeProfit: '$0.88 - $0.95'
  },
  {
    id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', category: 'Layer 1',
    basePrice: 34.8, priceChange24h: 4.65, high24h: 36.4, low24h: 32.9, volume24h: '780M', rsi: 55.6,
    whaleInflowUSD: 19.2, whaleOutflowUSD: 52.8, netWhaleFlow: 33.6, spotScore: 83,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT TỐT', confidence: 84,
    reasons: ['Cá mập rút $52.8M AVAX về Subnet Staking.', 'Phục hồi mạnh từ đường hỗ trợ EMA50 ngày.'],
    risks: ['Kháng cự $38 cần volume duy trì trên $900M.'],
    entryTarget: '$33.5 - $35.0', stopLoss: '$31.8', takeProfit: '$42.0 - $46.5'
  },
  {
    id: 'sui', symbol: 'SUI', name: 'Sui', category: 'Layer 1',
    basePrice: 3.28, priceChange24h: 9.45, high24h: 3.45, low24h: 2.95, volume24h: '1.6B', rsi: 63.8,
    whaleInflowUSD: 34.0, whaleOutflowUSD: 98.5, netWhaleFlow: 64.5, spotScore: 89,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT MUA NGAY', confidence: 93,
    reasons: ['Hệ sinh thái Sui bùng nổ TVL vượt $1.4B, cá mập rút ròng $64.5M.', 'DEX Volume trên Sui ghi nhận chuỗi 7 ngày tăng liên tiếp.'],
    risks: ['RSI trên 63 cần theo dõi cản $3.50.'],
    entryTarget: '$3.10 - $3.30', stopLoss: '$2.85', takeProfit: '$4.10 - $4.60'
  },
  {
    id: 'chainlink', symbol: 'LINK', name: 'Chainlink', category: 'Infra',
    basePrice: 14.85, priceChange24h: 6.20, high24h: 15.40, low24h: 13.90, volume24h: '640M', rsi: 57.2,
    whaleInflowUSD: 14.5, whaleOutflowUSD: 58.0, netWhaleFlow: 43.5, spotScore: 87,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT MUA NGAY', confidence: 91,
    reasons: ['Đối tác RWA thể chế đẩy mạnh tích hợp Chainlink CCIP.', 'Cá mập rút ròng $43.5M khỏi sàn về ví Multisig tổ chức.'],
    risks: ['Cản tâm lý mốc $16.'],
    entryTarget: '$14.20 - $14.90', stopLoss: '$13.20', takeProfit: '$18.00 - $20.50'
  },

  // --- TOP 11 - 20 ---
  {
    id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', category: 'AI / Layer 1',
    basePrice: 5.24, priceChange24h: 1.56, high24h: 5.42, low24h: 5.12, volume24h: '840M', rsi: 56.5,
    whaleInflowUSD: 18.4, whaleOutflowUSD: 68.9, netWhaleFlow: 50.5, spotScore: 94,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT MUA NGAY', confidence: 96,
    reasons: ['Cá mập gom mạnh: Tỷ lệ rút ví gấp 3.7 lần lượng nạp sàn (Net +$50.5M).', 'Động lượng AI On-chain bùng nổ, User-Owned AI ghi nhận tăng trưởng TVL.'],
    risks: ['Cần test lại cản $5.60.'],
    entryTarget: '$5.15 - $5.28', stopLoss: '$4.90', takeProfit: '$6.05 - $6.80'
  },
  {
    id: 'aptos', symbol: 'APT', name: 'Aptos', category: 'Layer 1',
    basePrice: 11.45, priceChange24h: 4.12, high24h: 11.95, low24h: 10.82, volume24h: '410M', rsi: 53.1,
    whaleInflowUSD: 24.0, whaleOutflowUSD: 62.4, netWhaleFlow: 38.4, spotScore: 86,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 85,
    reasons: ['Dòng tiền rút ví tích lũy áp đảo, Net Outflow dương $38.4M.', 'Sự gia tăng quan hệ đối tác tài chính truyền thống thúc đẩy TVL.'],
    risks: ['Kháng cự cục bộ tại $12.50.'],
    entryTarget: '$11.00 - $11.40', stopLoss: '$10.20', takeProfit: '$13.80 - $15.50'
  },
  {
    id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', category: 'Layer 2',
    basePrice: 0.742, priceChange24h: -5.41, high24h: 0.812, low24h: 0.731, volume24h: '320M', rsi: 34.8,
    whaleInflowUSD: 78.5, whaleOutflowUSD: 14.2, netWhaleFlow: -64.3, spotScore: 24,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO NÉ SPOT', confidence: 88,
    reasons: ['CẢNH BÁO XẢ: Cá mập nạp $78.5M ARB lên Binance và OKX.', 'Lịch mở khóa Token Unlock tuần này tạo áp lực pha loãng lớn.'],
    risks: ['Nguy cơ tiếp tục trượt giá tìm đáy mới.'],
    entryTarget: 'CHƯA NÊN VÀO (Chờ xác nhận $0.68)', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'optimism', symbol: 'OP', name: 'Optimism', category: 'Layer 2',
    basePrice: 1.88, priceChange24h: -3.85, high24h: 1.99, low24h: 1.84, volume24h: '280M', rsi: 38.2,
    whaleInflowUSD: 45.2, whaleOutflowUSD: 16.1, netWhaleFlow: -29.1, spotScore: 31,
    status: 'AVOID' as const, statusLabel: 'RỦI RO CAO / NÉ', confidence: 82,
    reasons: ['Ví Foundation & cá mập vừa chuyển 15.4M OP lên sàn CEX.', 'Superchain revenue giảm 12% theo dữ liệu on-chain tuần.'],
    risks: ['Thiếu lực mua đỡ giá từ các market maker lớn.'],
    entryTarget: 'ĐỨNG NGOÀI QUAN SÁT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'raydium', symbol: 'RAY', name: 'Raydium', category: 'DeFi / Solana',
    basePrice: 5.62, priceChange24h: 14.28, high24h: 5.88, low24h: 4.81, volume24h: '520M', rsi: 78.4,
    whaleInflowUSD: 82.0, whaleOutflowUSD: 21.5, netWhaleFlow: -60.5, spotScore: 18,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO QUÁ MUA / CHỐT LỜI', confidence: 93,
    reasons: ['CỰC KỲ NGUY HIỂM: RSI chạm 78.4 (Quá mua cực độ), nguy cơ đu đỉnh.', 'Cá mập chuyển 14.5M RAY lên sàn để chốt lời sau chuỗi pump mạnh.'],
    risks: ['Khả năng điều chỉnh -15% đến -25%.'],
    entryTarget: 'TUYỆT ĐỐI KHÔNG FOMO SPOT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'ens', symbol: 'ENS', name: 'Ethereum Name Service', category: 'Infra',
    basePrice: 20.45, priceChange24h: 5.30, high24h: 21.30, low24h: 19.10, volume24h: '165M', rsi: 55.8,
    whaleInflowUSD: 8.4, whaleOutflowUSD: 31.6, netWhaleFlow: 23.2, spotScore: 87,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT ĐẸP', confidence: 88,
    reasons: ['Vitalik Buterin tiếp tục nhắc tới ENS L2 Name Wrapper, cá mập gom $31.6M.', 'RSI 55.8 chuẩn mực, phân kỳ dương trên khung 1 ngày (D1).'],
    risks: ['Khối lượng thanh khoản trung bình.'],
    entryTarget: '$19.80 - $20.50', stopLoss: '$18.20', takeProfit: '$24.50 - $28.00'
  },
  {
    id: 'xpl', symbol: 'XPL', name: 'X-Protocol Pulse', category: 'DePIN / Infra',
    basePrice: 1.42, priceChange24h: -11.8, high24h: 1.68, low24h: 1.38, volume24h: '94M', rsi: 28.5,
    whaleInflowUSD: 39.0, whaleOutflowUSD: 6.2, netWhaleFlow: -32.8, spotScore: 12,
    status: 'AVOID' as const, statusLabel: 'DUMP XẢ MẠNH / NÉ', confidence: 95,
    reasons: ['Ví Dev/Voi nạp xả liên tục $39M lên các sàn DEX & CEX.', 'Thủng hỗ trợ cứng $1.50 với nến đỏ Marubozu khối lượng lớn.'],
    risks: ['Rơi tự do không hỗ trợ, thanh khoản cạn kiệt.'],
    entryTarget: 'CẤM BẮT DAO RƠI SPOT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'pepe', symbol: 'PEPE', name: 'Pepe', category: 'Meme',
    basePrice: 0.0000195, priceChange24h: 12.4, high24h: 0.000021, low24h: 0.000017, volume24h: '2.1B', rsi: 64.2,
    whaleInflowUSD: 68.0, whaleOutflowUSD: 142.0, netWhaleFlow: 74.0, spotScore: 84,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT MEME LEADER', confidence: 85,
    reasons: ['Cá mập rút 7.2 nghìn tỷ PEPE về ví lạnh sau niêm yết Robinhood/Coinbase.', 'Thanh khoản on-chain cao kỷ lục.'],
    risks: ['Biến động mạnh đặc trưng dòng Meme.'],
    entryTarget: '$0.0000185 - $0.0000195', stopLoss: '$0.0000165', takeProfit: '$0.000026 - $0.000032'
  },
  {
    id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', category: 'Meme',
    basePrice: 0.0000248, priceChange24h: -3.2, high24h: 0.000026, low24h: 0.000024, volume24h: '950M', rsi: 44.5,
    whaleInflowUSD: 52.0, whaleOutflowUSD: 22.0, netWhaleFlow: -30.0, spotScore: 36,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC BÁN RÒNG', confidence: 80,
    reasons: ['Các ví cá voi ngầm luân chuyển 1.2 nghìn tỷ SHIB lên sàn bán lẻ.'],
    risks: ['Chưa có lực cầu mới từ hệ sinh thái Shibarium.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'render-token', symbol: 'RENDER', name: 'Render Token', category: 'AI',
    basePrice: 8.42, priceChange24h: 7.85, high24h: 8.85, low24h: 7.75, volume24h: '420M', rsi: 58.1,
    whaleInflowUSD: 14.0, whaleOutflowUSD: 49.5, netWhaleFlow: 35.5, spotScore: 88,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP AI SPOT PICK', confidence: 91,
    reasons: ['Nhu cầu điện toán GPU phi tập trung tăng mạnh.', 'Net Outflow cá mập dương $35.5M.'],
    risks: ['Cản $9.20.'],
    entryTarget: '$8.10 - $8.45', stopLoss: '$7.50', takeProfit: '$10.50 - $12.00'
  },

  // --- TOP 21 - 35 ---
  {
    id: 'artificial-superintelligence-alliance', symbol: 'FET', name: 'Artificial Superintelligence', category: 'AI',
    basePrice: 1.48, priceChange24h: 6.95, high24h: 1.56, low24h: 1.38, volume24h: '310M', rsi: 56.4,
    whaleInflowUSD: 11.2, whaleOutflowUSD: 39.8, netWhaleFlow: 28.6, spotScore: 86,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY AI SPOT', confidence: 89,
    reasons: ['Liên minh ASI hoàn tất đồng bộ tokenomics.', 'Cá mập gom mạnh $28.6M.'],
    risks: ['Kháng cự $1.65.'],
    entryTarget: '$1.42 - $1.49', stopLoss: '$1.32', takeProfit: '$1.90 - $2.20'
  },
  {
    id: 'bittensor', symbol: 'TAO', name: 'Bittensor', category: 'AI',
    basePrice: 545.0, priceChange24h: 4.80, high24h: 565.0, low24h: 518.0, volume24h: '280M', rsi: 54.8,
    whaleInflowUSD: 18.0, whaleOutflowUSD: 54.0, netWhaleFlow: 36.0, spotScore: 89,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT MUA NGAY', confidence: 93,
    reasons: ['Subnet Subnetting bùng nổ, cá mập gom ròng $36M.', 'RSI 54.8 cực kỳ vững vàng.'],
    risks: ['Biến động giá đơn vị lớn.'],
    entryTarget: '$530 - $550', stopLoss: '$495', takeProfit: '$650 - $720'
  },
  {
    id: 'pendle', symbol: 'PENDLE', name: 'Pendle', category: 'DeFi',
    basePrice: 5.75, priceChange24h: 8.40, high24h: 6.05, low24h: 5.25, volume24h: '190M', rsi: 61.2,
    whaleInflowUSD: 8.5, whaleOutflowUSD: 34.2, netWhaleFlow: 25.7, spotScore: 88,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT YIELD PICK', confidence: 90,
    reasons: ['TVL Yield Trading đạt mốc kỷ lục mới.', 'Net gom cá mập đạt $25.7M.'],
    risks: ['Cản đỉnh cũ $6.30.'],
    entryTarget: '$5.50 - $5.80', stopLoss: '$5.10', takeProfit: '$7.20 - $8.00'
  },
  {
    id: 'uniswap', symbol: 'UNI', name: 'Uniswap', category: 'DeFi',
    basePrice: 9.85, priceChange24h: 3.80, high24h: 10.25, low24h: 9.40, volume24h: '380M', rsi: 52.4,
    whaleInflowUSD: 15.0, whaleOutflowUSD: 48.0, netWhaleFlow: 33.0, spotScore: 83,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 85,
    reasons: ['Uniswap v4 và Unichain triển khai thuận lợi.', 'Cá mập rút ví gom ròng $33M.'],
    risks: ['Cản $10.50.'],
    entryTarget: '$9.50 - $9.90', stopLoss: '$8.90', takeProfit: '$12.00 - $13.50'
  },
  {
    id: 'aave', symbol: 'AAVE', name: 'Aave', category: 'DeFi',
    basePrice: 172.5, priceChange24h: 5.60, high24h: 178.0, low24h: 162.0, volume24h: '240M', rsi: 59.0,
    whaleInflowUSD: 9.2, whaleOutflowUSD: 36.8, netWhaleFlow: 27.6, spotScore: 87,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT MẠNH', confidence: 91,
    reasons: ['Doanh thu giao thức cho vay tăng trưởng 45% quý.', 'Rút ví cá mập $27.6M.'],
    risks: ['Kháng cự $185.'],
    entryTarget: '$168 - $174', stopLoss: '$158', takeProfit: '$210 - $235'
  },
  {
    id: 'jupiter-exchange-solana', symbol: 'JUP', name: 'Jupiter', category: 'DeFi / Solana',
    basePrice: 1.18, priceChange24h: 7.20, high24h: 1.25, low24h: 1.09, volume24h: '280M', rsi: 57.5,
    whaleInflowUSD: 12.0, whaleOutflowUSD: 38.5, netWhaleFlow: 26.5, spotScore: 85,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT SOLANA DEX', confidence: 88,
    reasons: ['DEX aggregator lớn nhất Solana ghi nhận khối lượng kỷ lục.', 'Net Outflow cá mập dương $26.5M.'],
    risks: ['Cản $1.28.'],
    entryTarget: '$1.12 - $1.19', stopLoss: '$1.04', takeProfit: '$1.45 - $1.65'
  },
  {
    id: 'dogwifhat', symbol: 'WIF', name: 'dogwifhat', category: 'Meme',
    basePrice: 3.65, priceChange24h: -7.80, high24h: 4.10, low24h: 3.52, volume24h: '1.4B', rsi: 48.0,
    whaleInflowUSD: 72.0, whaleOutflowUSD: 26.0, netWhaleFlow: -46.0, spotScore: 33,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO NÉ XẢ', confidence: 86,
    reasons: ['Ví cá voi lớn chuyển 18M WIF lên Bybit để chốt lời.', 'Lực bán chủ động chiếm 62% khối lượng.'],
    risks: ['Có thể lùi về test hỗ trợ $3.20.'],
    entryTarget: 'CHƯA NÊN VÀO', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'bonk', symbol: 'BONK', name: 'Bonk', category: 'Meme',
    basePrice: 0.000042, priceChange24h: 15.8, high24h: 0.000046, low24h: 0.000035, volume24h: '1.8B', rsi: 76.5,
    whaleInflowUSD: 94.0, whaleOutflowUSD: 28.0, netWhaleFlow: -66.0, spotScore: 21,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO QUÁ MUA ĐỈNH', confidence: 92,
    reasons: ['RSI chạm 76.5 ở mức quá mua nguy hiểm.', 'Dòng tiền nạp xả $94M lên Binance sau đợt pump +40%.'],
    risks: ['Rủi ro điều chỉnh -20% về $0.000032.'],
    entryTarget: 'TUYỆT ĐỐI KHÔNG ĐU', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'floki', symbol: 'FLOKI', name: 'Floki', category: 'Meme',
    basePrice: 0.000245, priceChange24h: -4.50, high24h: 0.000265, low24h: 0.000238, volume24h: '420M', rsi: 46.2,
    whaleInflowUSD: 28.0, whaleOutflowUSD: 9.5, netWhaleFlow: -18.5, spotScore: 38,
    status: 'AVOID' as const, statusLabel: 'RỦI RO ĐU ĐỈNH', confidence: 79,
    reasons: ['Áp lực nạp xả ngầm từ ví staking unbond.', 'Thiếu khối lượng mua đỡ giá.'],
    risks: ['Mất hỗ trợ $0.00022.'],
    entryTarget: 'QUAN SÁT THÊM', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'celestia', symbol: 'TIA', name: 'Celestia', category: 'Infra',
    basePrice: 5.42, priceChange24h: -8.90, high24h: 6.05, low24h: 5.30, volume24h: '340M', rsi: 32.5,
    whaleInflowUSD: 64.0, whaleOutflowUSD: 12.0, netWhaleFlow: -52.0, spotScore: 22,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO XẢ UNLOCK', confidence: 94,
    reasons: ['Đợt mở khóa token khổng lồ tạo áp lực bán xả hàng chục triệu USD lên CEX.', 'RSI gãy hỗ trợ khung tuần.'],
    risks: ['Nguy cơ tiếp tục phá đáy $4.80.'],
    entryTarget: 'CẤM BẮT ĐÁY SỚM', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'injective-protocol', symbol: 'INJ', name: 'Injective', category: 'DeFi / L1',
    basePrice: 24.8, priceChange24h: 6.40, high24h: 26.2, low24h: 23.1, volume24h: '290M', rsi: 56.8,
    whaleInflowUSD: 11.0, whaleOutflowUSD: 38.0, netWhaleFlow: 27.0, spotScore: 86,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 89,
    reasons: ['Tỷ lệ đốt token INJ tuần tăng vọt.', 'Cá mập rút ròng $27M về ví staking.'],
    risks: ['Cản $27.50.'],
    entryTarget: '$23.8 - $24.9', stopLoss: '$22.0', takeProfit: '$31.0 - $35.0'
  },
  {
    id: 'pyth-network', symbol: 'PYTH', name: 'Pyth Network', category: 'Infra',
    basePrice: 0.425, priceChange24h: 4.80, high24h: 0.448, low24h: 0.398, volume24h: '160M', rsi: 53.0,
    whaleInflowUSD: 6.2, whaleOutflowUSD: 24.5, netWhaleFlow: 18.3, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY ORACLE', confidence: 84,
    reasons: ['Mạng lưới dữ liệu giá phục vụ hơn 400 dApps.', 'Dòng tiền rút ví tích lũy $18.3M.'],
    risks: ['Lịch unlock định kỳ hàng tháng.'],
    entryTarget: '$0.40 - $0.43', stopLoss: '$0.37', takeProfit: '$0.54 - $0.62'
  },
  {
    id: 'sei-network', symbol: 'SEI', name: 'Sei', category: 'Layer 1',
    basePrice: 0.512, priceChange24h: 5.40, high24h: 0.538, low24h: 0.482, volume24h: '240M', rsi: 55.0,
    whaleInflowUSD: 9.8, whaleOutflowUSD: 31.0, netWhaleFlow: 21.2, spotScore: 83,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT ĐẸP', confidence: 85,
    reasons: ['Bản nâng cấp Sei V2 EVM thu hút dòng thanh khoản mới.', 'Cá mập rút ròng $21.2M.'],
    risks: ['Cản $0.56.'],
    entryTarget: '$0.49 - $0.52', stopLoss: '$0.45', takeProfit: '$0.65 - $0.74'
  },
  {
    id: 'kaspa', symbol: 'KAS', name: 'Kaspa', category: 'Layer 1',
    basePrice: 0.162, priceChange24h: 3.20, high24h: 0.171, low24h: 0.154, volume24h: '140M', rsi: 51.5,
    whaleInflowUSD: 4.5, whaleOutflowUSD: 19.8, netWhaleFlow: 15.3, spotScore: 81,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 83,
    reasons: ['Tỷ lệ hash-rate mạng lưới PoW liên tục lập đỉnh mới.', 'Net gom cá mập ổn định.'],
    risks: ['Thanh khoản trên các sàn lớn cần mở rộng.'],
    entryTarget: '$0.155 - $0.163', stopLoss: '$0.144', takeProfit: '$0.20 - $0.23'
  },
  {
    id: 'stacks', symbol: 'STX', name: 'Stacks', category: 'Bitcoin L2',
    basePrice: 1.95, priceChange24h: 6.80, high24h: 2.08, low24h: 1.81, volume24h: '210M', rsi: 57.0,
    whaleInflowUSD: 8.0, whaleOutflowUSD: 29.5, netWhaleFlow: 21.5, spotScore: 84,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT BTC ECO', confidence: 87,
    reasons: ['Nakamoto Upgrade tăng tốc độ giao dịch gấp 10 lần.', 'Cá mập rút ròng $21.5M.'],
    risks: ['Cản $2.20.'],
    entryTarget: '$1.88 - $1.96', stopLoss: '$1.74', takeProfit: '$2.55 - $2.90'
  },

  // --- TOP 36 - 50 ---
  {
    id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', category: 'Layer 1',
    basePrice: 9.65, priceChange24h: 3.40, high24h: 10.10, low24h: 9.25, volume24h: '180M', rsi: 50.5,
    whaleInflowUSD: 7.2, whaleOutflowUSD: 22.0, netWhaleFlow: 14.8, spotScore: 79,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 81,
    reasons: ['Phát triển ứng dụng AI on-chain không cần đám mây tập trung.', 'Net Outflow dương.'],
    risks: ['Cản $10.50.'],
    entryTarget: '$9.20 - $9.70', stopLoss: '$8.60', takeProfit: '$12.00 - $13.50'
  },
  {
    id: 'filecoin', symbol: 'FIL', name: 'Filecoin', category: 'DePIN',
    basePrice: 4.45, priceChange24h: 2.10, high24h: 4.68, low24h: 4.25, volume24h: '140M', rsi: 48.0,
    whaleInflowUSD: 5.5, whaleOutflowUSD: 16.2, netWhaleFlow: 10.7, spotScore: 77,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 80,
    reasons: ['Lưu trữ dữ liệu phi tập trung cho các mô hình AI tăng trưởng.'],
    risks: ['Thanh khoản phân tán.'],
    entryTarget: '$4.30 - $4.50', stopLoss: '$4.05', takeProfit: '$5.50 - $6.20'
  },
  {
    id: 'starknet', symbol: 'STRK', name: 'Starknet', category: 'Layer 2',
    basePrice: 0.485, priceChange24h: -6.20, high24h: 0.535, low24h: 0.472, volume24h: '110M', rsi: 35.0,
    whaleInflowUSD: 29.0, whaleOutflowUSD: 6.8, netWhaleFlow: -22.2, spotScore: 29,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC XẢ L2', confidence: 84,
    reasons: ['Lượng nạp xả $29M từ các ví nhận airdrop và investor.'],
    risks: ['Chưa có tín hiệu dừng rơi.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'ethena', symbol: 'ENA', name: 'Ethena', category: 'DeFi',
    basePrice: 0.582, priceChange24h: 8.90, high24h: 0.625, low24h: 0.525, volume24h: '310M', rsi: 62.0,
    whaleInflowUSD: 15.0, whaleOutflowUSD: 44.0, netWhaleFlow: 29.0, spotScore: 86,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT DEFI', confidence: 88,
    reasons: ['Nguồn cung USDe mở rộng vượt $3.2B, cá mập gom ròng $29M.'],
    risks: ['Phụ thuộc vào funding rate thị trường phái sinh.'],
    entryTarget: '$0.55 - $0.59', stopLoss: '$0.50', takeProfit: '$0.75 - $0.85'
  },
  {
    id: 'ondo-finance', symbol: 'ONDO', name: 'Ondo', category: 'RWA / DeFi',
    basePrice: 0.985, priceChange24h: 7.10, high24h: 1.05, low24h: 0.91, volume24h: '260M', rsi: 59.4,
    whaleInflowUSD: 12.0, whaleOutflowUSD: 39.5, netWhaleFlow: 27.5, spotScore: 88,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP SPOT RWA PICK', confidence: 91,
    reasons: ['Dẫn đầu mảng tài sản thực tế RWA với trái phiếu kho bạc Mỹ token hóa.'],
    risks: ['Cản $1.10.'],
    entryTarget: '$0.94 - $0.99', stopLoss: '$0.88', takeProfit: '$1.25 - $1.45'
  },
  {
    id: 'fantom', symbol: 'FTM', name: 'Sonic (Fantom)', category: 'Layer 1',
    basePrice: 0.725, priceChange24h: 6.30, high24h: 0.765, low24h: 0.675, volume24h: '190M', rsi: 57.5,
    whaleInflowUSD: 8.5, whaleOutflowUSD: 29.0, netWhaleFlow: 20.5, spotScore: 84,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SONIC L1', confidence: 86,
    reasons: ['Nâng cấp Sonic 10,000 TPS sắp mainnet.', 'Cá mập gom ròng $20.5M.'],
    risks: ['Cản $0.80.'],
    entryTarget: '$0.69 - $0.73', stopLoss: '$0.64', takeProfit: '$0.95 - $1.10'
  },
  {
    id: 'polkadot', symbol: 'DOT', name: 'Polkadot', category: 'Layer 1',
    basePrice: 6.12, priceChange24h: 2.80, high24h: 6.35, low24h: 5.92, volume24h: '280M', rsi: 49.0,
    whaleInflowUSD: 14.0, whaleOutflowUSD: 32.0, netWhaleFlow: 18.0, spotScore: 78,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 80,
    reasons: ['Polkadot 2.0 tối ưu phân bổ blockspace.', 'Dòng tiền rút ví staking ổn định.'],
    risks: ['Động lượng tăng trưởng chậm hơn các hệ L1 mới.'],
    entryTarget: '$5.95 - $6.15', stopLoss: '$5.60', takeProfit: '$7.50 - $8.20'
  },
  {
    id: 'mantle', symbol: 'MNT', name: 'Mantle', category: 'Layer 2',
    basePrice: 0.785, priceChange24h: 3.50, high24h: 0.815, low24h: 0.752, volume24h: '120M', rsi: 51.0,
    whaleInflowUSD: 5.0, whaleOutflowUSD: 18.5, netWhaleFlow: 13.5, spotScore: 80,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 82,
    reasons: ['Kho bạc Mantle Treasury bảo chứng giá trị lớn nhất các L2.'],
    risks: ['Thanh khoản phụ thuộc sàn Bybit.'],
    entryTarget: '$0.76 - $0.79', stopLoss: '$0.71', takeProfit: '$0.95 - $1.08'
  },
  {
    id: 'polygon-ecosystem-token', symbol: 'POL', name: 'Polygon', category: 'Layer 2',
    basePrice: 0.445, priceChange24h: -2.10, high24h: 0.468, low24h: 0.435, volume24h: '150M', rsi: 43.0,
    whaleInflowUSD: 21.0, whaleOutflowUSD: 9.0, netWhaleFlow: -12.0, spotScore: 42,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC CHUYỂN ĐỔI', confidence: 78,
    reasons: ['Tiến trình chuyển đổi MATIC sang POL vẫn gây phân tán thanh khoản.'],
    risks: ['Chưa tạo đáy rõ ràng.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'worldcoin-wld', symbol: 'WLD', name: 'Worldcoin', category: 'AI / Identity',
    basePrice: 2.25, priceChange24h: -8.40, high24h: 2.58, low24h: 2.18, volume24h: '380M', rsi: 36.5,
    whaleInflowUSD: 48.0, whaleOutflowUSD: 11.0, netWhaleFlow: -37.0, spotScore: 26,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO XẢ NẶNG', confidence: 91,
    reasons: ['Lịch mở khóa 5.3 triệu WLD mỗi ngày tạo áp lực xả liên tục lên sàn CEX.'],
    risks: ['Rơi qua hỗ trợ $2.40.'],
    entryTarget: 'CẤM BẮT DAO RƠI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'maker', symbol: 'MKR', name: 'Sky (Maker)', category: 'DeFi',
    basePrice: 1580.0, priceChange24h: 1.90, high24h: 1620.0, low24h: 1540.0, volume24h: '95M', rsi: 52.0,
    whaleInflowUSD: 6.0, whaleOutflowUSD: 19.5, netWhaleFlow: 13.5, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 85,
    reasons: ['Tỷ lệ mua lại (buyback) token Sky từ phí USDS duy trì mạnh mẽ.'],
    risks: ['Thanh khoản thấp hơn các altcoin bán lẻ.'],
    entryTarget: '$1,540 - $1,590', stopLoss: '$1,460', takeProfit: '$1,850 - $2,050'
  },
  {
    id: 'the-graph', symbol: 'GRT', name: 'The Graph', category: 'AI / Infra',
    basePrice: 0.235, priceChange24h: 5.80, high24h: 0.252, low24h: 0.221, volume24h: '130M', rsi: 54.5,
    whaleInflowUSD: 4.8, whaleOutflowUSD: 16.5, netWhaleFlow: 11.7, spotScore: 81,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT ĐẸP', confidence: 83,
    reasons: ['Truy vấn dữ liệu subgraphs tăng 32% nhờ nhu cầu phân tích on-chain.'],
    risks: ['Cản $0.26.'],
    entryTarget: '$0.225 - $0.238', stopLoss: '$0.210', takeProfit: '$0.30 - $0.34'
  },
  {
    id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', category: 'DeFi',
    basePrice: 1.28, priceChange24h: 3.20, high24h: 1.34, low24h: 1.23, volume24h: '110M', rsi: 49.5,
    whaleInflowUSD: 6.5, whaleOutflowUSD: 18.0, netWhaleFlow: 11.5, spotScore: 78,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 80,
    reasons: ['Khối lượng stETH chiếm vị thế độc tôn trong liquid staking.'],
    risks: ['Áp lực cạnh tranh từ các nền tảng restaking.'],
    entryTarget: '$1.24 - $1.29', stopLoss: '$1.17', takeProfit: '$1.55 - $1.72'
  },
  {
    id: 'arweave', symbol: 'AR', name: 'Arweave', category: 'DePIN / AI',
    basePrice: 18.5, priceChange24h: 6.50, high24h: 19.8, low24h: 17.2, volume24h: '125M', rsi: 56.2,
    whaleInflowUSD: 5.0, whaleOutflowUSD: 18.2, netWhaleFlow: 13.2, spotScore: 83,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT AO PICK', confidence: 86,
    reasons: ['Mạng lưới tính toán siêu song song AO bùng nổ giao dịch.'],
    risks: ['Cản $21.'],
    entryTarget: '$17.8 - $18.6', stopLoss: '$16.5', takeProfit: '$24.0 - $28.0'
  },
  {
    id: 'thorchain', symbol: 'RUNE', name: 'THORChain', category: 'DeFi',
    basePrice: 5.85, priceChange24h: 4.20, high24h: 6.15, low24h: 5.55, volume24h: '240M', rsi: 53.0,
    whaleInflowUSD: 8.5, whaleOutflowUSD: 24.5, netWhaleFlow: 16.0, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 84,
    reasons: ['Khối lượng hoán đổi cross-chain phi tập trung đạt đỉnh quý.'],
    risks: ['Cản $6.50.'],
    entryTarget: '$5.60 - $5.90', stopLoss: '$5.20', takeProfit: '$7.40 - $8.20'
  },

  // --- TOP 51 - 70 ---
  {
    id: 'io-net', symbol: 'IO', name: 'io.net', category: 'AI / DePIN',
    basePrice: 2.45, priceChange24h: 8.40, high24h: 2.68, low24h: 2.22, volume24h: '175M', rsi: 57.8,
    whaleInflowUSD: 7.0, whaleOutflowUSD: 26.5, netWhaleFlow: 19.5, spotScore: 85,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT CLOUD AI', confidence: 87,
    reasons: ['Cụm GPU phân tán kết nối hơn 300,000 node.', 'Net gom cá mập đạt $19.5M.'],
    risks: ['Cản $2.85.'],
    entryTarget: '$2.35 - $2.48', stopLoss: '$2.15', takeProfit: '$3.20 - $3.65'
  },
  {
    id: 'zksync', symbol: 'ZK', name: 'ZKsync', category: 'Layer 2',
    basePrice: 0.148, priceChange24h: -7.20, high24h: 0.165, low24h: 0.142, volume24h: '130M', rsi: 33.0,
    whaleInflowUSD: 31.0, whaleOutflowUSD: 6.5, netWhaleFlow: -24.5, spotScore: 25,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO NÉ XẢ ZK', confidence: 91,
    reasons: ['Áp lực xả từ ví nhận thưởng sau airdrop tiếp diễn.', 'RSI suy yếu dưới 35.'],
    risks: ['Chưa tạo đáy.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'layerzero', symbol: 'ZRO', name: 'LayerZero', category: 'Infra',
    basePrice: 3.85, priceChange24h: 4.20, high24h: 4.10, low24h: 3.65, volume24h: '140M', rsi: 52.5,
    whaleInflowUSD: 6.5, whaleOutflowUSD: 21.0, netWhaleFlow: 14.5, spotScore: 80,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 82,
    reasons: ['Giao thức kết nối cross-chain tiêu chuẩn cho hơn 80 blockchain.'],
    risks: ['Cản $4.30.'],
    entryTarget: '$3.70 - $3.90', stopLoss: '$3.45', takeProfit: '$4.80 - $5.40'
  },
  {
    id: 'jito-governance-token', symbol: 'JTO', name: 'Jito', category: 'DeFi / Solana',
    basePrice: 3.12, priceChange24h: 7.80, high24h: 3.35, low24h: 2.88, volume24h: '160M', rsi: 58.2,
    whaleInflowUSD: 8.0, whaleOutflowUSD: 28.5, netWhaleFlow: 20.5, spotScore: 85,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT MEV JITO', confidence: 88,
    reasons: ['Doanh thu MEV và Liquid Staking trên Solana cao kỷ lục.'],
    risks: ['Cản $3.50.'],
    entryTarget: '$2.98 - $3.15', stopLoss: '$2.80', takeProfit: '$3.90 - $4.40'
  },
  {
    id: 'eigenlayer', symbol: 'EIGEN', name: 'EigenLayer', category: 'Infra / Restaking',
    basePrice: 2.75, priceChange24h: -4.80, high24h: 2.98, low24h: 2.68, volume24h: '190M', rsi: 41.0,
    whaleInflowUSD: 28.0, whaleOutflowUSD: 10.5, netWhaleFlow: -17.5, spotScore: 37,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC CHỐT LỜI', confidence: 81,
    reasons: ['Áp lực nạp xả sau khi token mở tính năng chuyển nhượng.'],
    risks: ['Cần tích lũy thêm quanh $2.50.'],
    entryTarget: 'CHỜ QUAN SÁT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'notcoin', symbol: 'NOT', name: 'Notcoin', category: 'Meme / TON',
    basePrice: 0.0078, priceChange24h: -8.10, high24h: 0.0089, low24h: 0.0075, volume24h: '210M', rsi: 37.0,
    whaleInflowUSD: 34.0, whaleOutflowUSD: 8.0, netWhaleFlow: -26.0, spotScore: 27,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO NÉ XẢ', confidence: 89,
    reasons: ['Cá mập phân phối xả hàng loạt token từ ví Telegram tap-to-earn.'],
    risks: ['Gãy hỗ trợ $0.008.'],
    entryTarget: 'KHÔNG MUA', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'dogs', symbol: 'DOGS', name: 'Dogs', category: 'Meme / TON',
    basePrice: 0.00062, priceChange24h: -9.50, high24h: 0.00071, low24h: 0.00059, volume24h: '180M', rsi: 31.5,
    whaleInflowUSD: 26.0, whaleOutflowUSD: 4.5, netWhaleFlow: -21.5, spotScore: 23,
    status: 'AVOID' as const, statusLabel: 'DUMP XẢ MẠNH', confidence: 92,
    reasons: ['Áp lực bán tháo liên tục không có lực cầu đỡ.'],
    risks: ['Rơi tự do.'],
    entryTarget: 'TUYỆT ĐỐI NÉ', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'neiro-ethereum', symbol: 'NEIRO', name: 'First Neiro on ETH', category: 'Meme',
    basePrice: 0.00185, priceChange24h: 18.4, high24h: 0.0021, low24h: 0.0015, volume24h: '680M', rsi: 74.2,
    whaleInflowUSD: 48.0, whaleOutflowUSD: 14.0, netWhaleFlow: -34.0, spotScore: 29,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO QUÁ MUA', confidence: 90,
    reasons: ['RSI chạm 74.2 sau đợt pump nóng, nguy cơ quét râu xả chốt lời.'],
    risks: ['Rung lắc mạnh.'],
    entryTarget: 'KHÔNG FOMO', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'popcat', symbol: 'POPCAT', name: 'POPCAT', category: 'Meme / Solana',
    basePrice: 1.45, priceChange24h: 8.90, high24h: 1.58, low24h: 1.32, volume24h: '240M', rsi: 61.5,
    whaleInflowUSD: 14.0, whaleOutflowUSD: 42.0, netWhaleFlow: 28.0, spotScore: 83,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT MEME CÁT', confidence: 85,
    reasons: ['Top meme mèo trên Solana duy trì lực mua cá mập rút ròng $28M.'],
    risks: ['Cản $1.65.'],
    entryTarget: '$1.38 - $1.46', stopLoss: '$1.26', takeProfit: '$1.85 - $2.10'
  },
  {
    id: 'safe', symbol: 'SAFE', name: 'Safe', category: 'Infra',
    basePrice: 1.35, priceChange24h: 4.80, high24h: 1.44, low24h: 1.28, volume24h: '65M', rsi: 53.0,
    whaleInflowUSD: 3.2, whaleOutflowUSD: 14.8, netWhaleFlow: 11.6, spotScore: 81,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SMART ACCOUNT', confidence: 84,
    reasons: ['Hạ tầng Multisig và Account Abstraction lưu ký hơn $100B tài sản.'],
    risks: ['Thanh khoản vừa phải.'],
    entryTarget: '$1.30 - $1.36', stopLoss: '$1.22', takeProfit: '$1.68 - $1.85'
  },
  {
    id: 'drift-protocol', symbol: 'DRIFT', name: 'Drift Protocol', category: 'DeFi / Solana',
    basePrice: 1.15, priceChange24h: 6.80, high24h: 1.24, low24h: 1.06, volume24h: '85M', rsi: 56.0,
    whaleInflowUSD: 4.0, whaleOutflowUSD: 16.5, netWhaleFlow: 12.5, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT PERP DEX', confidence: 85,
    reasons: ['Sàn phái sinh on-chain Drift bứt phá khối lượng trên Solana.'],
    risks: ['Cản $1.30.'],
    entryTarget: '$1.08 - $1.16', stopLoss: '$0.99', takeProfit: '$1.45 - $1.65'
  },
  {
    id: 'ether-fi', symbol: 'ETHFI', name: 'ether.fi', category: 'DeFi / Restaking',
    basePrice: 2.12, priceChange24h: 5.20, high24h: 2.26, low24h: 1.98, volume24h: '110M', rsi: 54.0,
    whaleInflowUSD: 5.8, whaleOutflowUSD: 19.0, netWhaleFlow: 13.2, spotScore: 80,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY RESTAKING', confidence: 82,
    reasons: ['Dẫn đầu TVL liquid restaking với hơn 1.8 triệu ETH nạp staking.'],
    risks: ['Cản $2.40.'],
    entryTarget: '$2.02 - $2.14', stopLoss: '$1.88', takeProfit: '$2.70 - $3.05'
  },
  {
    id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO', category: 'DeFi',
    basePrice: 0.385, priceChange24h: 3.10, high24h: 0.405, low24h: 0.370, volume24h: '85M', rsi: 49.0,
    whaleInflowUSD: 4.2, whaleOutflowUSD: 12.5, netWhaleFlow: 8.3, spotScore: 76,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY GIÁ RẺ', confidence: 78,
    reasons: ['Nền tảng hoán đổi stablecoin cốt lõi trên Ethereum phục hồi dòng tiền.'],
    risks: ['Áp lực nợ nhà sáng lập đã hạ nhiệt nhưng cần thời gian.'],
    entryTarget: '$0.37 - $0.39', stopLoss: '$0.34', takeProfit: '$0.48 - $0.55'
  },
  {
    id: '1inch', symbol: '1INCH', name: '1inch', category: 'DeFi',
    basePrice: 0.342, priceChange24h: 2.40, high24h: 0.358, low24h: 0.331, volume24h: '65M', rsi: 48.5,
    whaleInflowUSD: 3.5, whaleOutflowUSD: 9.8, netWhaleFlow: 6.3, spotScore: 75,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 77,
    reasons: ['DEX aggregator đa chuỗi với giải thuật Fusion hạn chế MEV.'],
    risks: ['Cản $0.38.'],
    entryTarget: '$0.33 - $0.35', stopLoss: '$0.31', takeProfit: '$0.42 - $0.48'
  },
  {
    id: 'compound-governance-token', symbol: 'COMP', name: 'Compound', category: 'DeFi',
    basePrice: 52.5, priceChange24h: 3.80, high24h: 55.0, low24h: 50.2, volume24h: '55M', rsi: 51.0,
    whaleInflowUSD: 2.8, whaleOutflowUSD: 9.2, netWhaleFlow: 6.4, spotScore: 77,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 79,
    reasons: ['Giao thức tiền tệ lending kinh điển giữ vững TVL hơn $2.5B.'],
    risks: ['Cản $60.'],
    entryTarget: '$51 - $53', stopLoss: '$47', takeProfit: '$65 - $72'
  },

  // --- TOP 71 - 100 ---
  {
    id: 'synthetix-network-token', symbol: 'SNX', name: 'Synthetix', category: 'DeFi',
    basePrice: 1.72, priceChange24h: 4.10, high24h: 1.82, low24h: 1.64, volume24h: '75M', rsi: 52.0,
    whaleInflowUSD: 3.5, whaleOutflowUSD: 11.0, netWhaleFlow: 7.5, spotScore: 78,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 80,
    reasons: ['Synthetix V3 triển khai thanh khoản vĩnh cửu trên đa chuỗi.'],
    risks: ['Cản $1.95.'],
    entryTarget: '$1.66 - $1.74', stopLoss: '$1.55', takeProfit: '$2.15 - $2.40'
  },
  {
    id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap', category: 'DeFi / BSC',
    basePrice: 2.15, priceChange24h: 3.20, high24h: 2.25, low24h: 2.06, volume24h: '95M', rsi: 50.5,
    whaleInflowUSD: 4.8, whaleOutflowUSD: 14.5, netWhaleFlow: 9.7, spotScore: 78,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 80,
    reasons: ['Sàn DEX thống trị mạng BNB Chain với cơ chế giảm phát liên tục.'],
    risks: ['Cản $2.40.'],
    entryTarget: '$2.08 - $2.18', stopLoss: '$1.95', takeProfit: '$2.70 - $3.00'
  },
  {
    id: 'dydx-chain', symbol: 'DYDX', name: 'dYdX', category: 'DeFi / AppChain',
    basePrice: 1.25, priceChange24h: -3.50, high24h: 1.34, low24h: 1.22, volume24h: '85M', rsi: 44.0,
    whaleInflowUSD: 16.0, whaleOutflowUSD: 5.2, netWhaleFlow: -10.8, spotScore: 43,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC UNLOCK', confidence: 79,
    reasons: ['Áp lực mở khóa token hàng tháng tạo nguồn cung phân phối đều đặn.'],
    risks: ['Cần tích lũy thêm quanh $1.15.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'chiliz', symbol: 'CHZ', name: 'Chiliz', category: 'Fan Token / L1',
    basePrice: 0.075, priceChange24h: 2.80, high24h: 0.079, low24h: 0.072, volume24h: '65M', rsi: 49.0,
    whaleInflowUSD: 2.5, whaleOutflowUSD: 7.8, netWhaleFlow: 5.3, spotScore: 76,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 78,
    reasons: ['Mạng lưới chuỗi thể thao chuyên biệt Chiliz Chain gia tăng quan hệ đối tác.'],
    risks: ['Cản $0.085.'],
    entryTarget: '$0.072 - $0.076', stopLoss: '$0.068', takeProfit: '$0.095 - $0.11'
  },
  {
    id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', category: 'Metaverse / Game',
    basePrice: 0.355, priceChange24h: -4.20, high24h: 0.378, low24h: 0.348, volume24h: '90M', rsi: 42.0,
    whaleInflowUSD: 14.5, whaleOutflowUSD: 4.8, netWhaleFlow: -9.7, spotScore: 41,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC ĐU ĐỈNH CŨ', confidence: 80,
    reasons: ['Dòng tiền lĩnh vực Metaverse còn trầm lắng, áp lực thoát vốn.'],
    risks: ['Chưa có câu chuyện thu hút mới.'],
    entryTarget: 'QUAN SÁT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'decentraland', symbol: 'MANA', name: 'Decentraland', category: 'Metaverse / Game',
    basePrice: 0.382, priceChange24h: -3.80, high24h: 0.405, low24h: 0.375, volume24h: '75M', rsi: 43.5,
    whaleInflowUSD: 12.0, whaleOutflowUSD: 4.2, netWhaleFlow: -7.8, spotScore: 42,
    status: 'AVOID' as const, statusLabel: 'DÒNG TIỀN YẾU', confidence: 79,
    reasons: ['Khối lượng giao dịch thấp so với các nhóm ngành dẫn dắt (AI, Meme, L1).'],
    risks: ['Thiếu xung lực bứt phá.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity', category: 'Gaming',
    basePrice: 5.65, priceChange24h: -2.80, high24h: 5.95, low24h: 5.52, volume24h: '65M', rsi: 45.0,
    whaleInflowUSD: 10.5, whaleOutflowUSD: 3.8, netWhaleFlow: -6.7, spotScore: 44,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC XẢ', confidence: 77,
    reasons: ['Lượng người chơi hoạt động đi ngang, áp lực bán token từ phần thưởng.'],
    risks: ['Gãy hỗ trợ $5.40.'],
    entryTarget: 'QUAN SÁT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'gala', symbol: 'GALA', name: 'GALA', category: 'Gaming',
    basePrice: 0.0285, priceChange24h: 3.50, high24h: 0.0305, low24h: 0.0272, volume24h: '110M', rsi: 51.0,
    whaleInflowUSD: 4.8, whaleOutflowUSD: 14.0, netWhaleFlow: 9.2, spotScore: 77,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 79,
    reasons: ['GalaChain ra mắt tính năng thanh toán phi tập trung mới.'],
    risks: ['Cản $0.032.'],
    entryTarget: '$0.027 - $0.029', stopLoss: '$0.025', takeProfit: '$0.036 - $0.042'
  },
  {
    id: 'beam-2', symbol: 'BEAM', name: 'Beam', category: 'Gaming / L1',
    basePrice: 0.0215, priceChange24h: 5.80, high24h: 0.0232, low24h: 0.0201, volume24h: '85M', rsi: 55.0,
    whaleInflowUSD: 3.2, whaleOutflowUSD: 12.0, netWhaleFlow: 8.8, spotScore: 80,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT GAMING', confidence: 82,
    reasons: ['Hạ tầng game subnet trên Avalanche gia tăng số lượng tựa game.'],
    risks: ['Cản $0.025.'],
    entryTarget: '$0.020 - $0.022', stopLoss: '$0.019', takeProfit: '$0.028 - $0.033'
  },
  {
    id: 'blur', symbol: 'BLUR', name: 'Blur', category: 'NFT / DeFi',
    basePrice: 0.255, priceChange24h: -5.10, high24h: 0.278, low24h: 0.248, volume24h: '55M', rsi: 38.0,
    whaleInflowUSD: 15.0, whaleOutflowUSD: 3.5, netWhaleFlow: -11.5, spotScore: 36,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC XẢ NẶNG', confidence: 85,
    reasons: ['Thị trường NFT thanh khoản ảm đạm, cá voi xả token nhận airdrop.'],
    risks: ['Gãy đáy $0.24.'],
    entryTarget: 'CẤM BẮT ĐÁY', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'book-of-meme', symbol: 'BOME', name: 'BOOK OF MEME', category: 'Meme / Solana',
    basePrice: 0.0098, priceChange24h: -6.40, high24h: 0.0108, low24h: 0.0094, volume24h: '280M', rsi: 41.5,
    whaleInflowUSD: 24.0, whaleOutflowUSD: 7.0, netWhaleFlow: -17.0, spotScore: 34,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC BÁN RÒNG', confidence: 86,
    reasons: ['Cá mập phân phối token lên sàn CEX sau chuỗi ngày đi ngang.'],
    risks: ['Mất hỗ trợ $0.0092.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'cat-in-a-dogs-world', symbol: 'MEW', name: 'cat in a dogs world', category: 'Meme / Solana',
    basePrice: 0.0105, priceChange24h: 7.20, high24h: 0.0115, low24h: 0.0096, volume24h: '160M', rsi: 58.0,
    whaleInflowUSD: 5.5, whaleOutflowUSD: 18.0, netWhaleFlow: 12.5, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT MEME MÈO', confidence: 84,
    reasons: ['Top meme mèo trên Solana thu hút dòng tiền cá mập rút ròng $12.5M.'],
    risks: ['Cản $0.0125.'],
    entryTarget: '$0.0099 - $0.0106', stopLoss: '$0.0091', takeProfit: '$0.014 - $0.016'
  },
  {
    id: 'brett', symbol: 'BRETT', name: 'Brett', category: 'Meme / Base',
    basePrice: 0.168, priceChange24h: 9.50, high24h: 0.182, low24h: 0.151, volume24h: '185M', rsi: 62.5,
    whaleInflowUSD: 7.8, whaleOutflowUSD: 28.0, netWhaleFlow: 20.2, spotScore: 85,
    status: 'BUY_SPOT' as const, statusLabel: 'TOP MEME BASE CHAIN', confidence: 87,
    reasons: ['Linh vật biểu tượng của hệ sinh thái Base L2, cá mập gom ròng $20.2M.'],
    risks: ['Cản $0.19.'],
    entryTarget: '$0.158 - $0.170', stopLoss: '$0.145', takeProfit: '$0.22 - $0.26'
  },
  {
    id: 'turbo', symbol: 'TURBO', name: 'Turbo', category: 'Meme / AI',
    basePrice: 0.0084, priceChange24h: -5.80, high24h: 0.0094, low24h: 0.0081, volume24h: '140M', rsi: 44.0,
    whaleInflowUSD: 18.5, whaleOutflowUSD: 5.5, netWhaleFlow: -13.0, spotScore: 35,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO XẢ', confidence: 83,
    reasons: ['Áp lực chốt lời ngắn hạn từ các nhóm đầu cơ tạo nến đảo chiều.'],
    risks: ['Có thể lùi về $0.0075.'],
    entryTarget: 'QUAN SÁT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'aethir', symbol: 'ATH', name: 'Aethir', category: 'AI / DePIN',
    basePrice: 0.062, priceChange24h: 6.80, high24h: 0.068, low24h: 0.057, volume24h: '95M', rsi: 56.5,
    whaleInflowUSD: 3.8, whaleOutflowUSD: 14.0, netWhaleFlow: 10.2, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'MUA SPOT GPU DEPIN', confidence: 84,
    reasons: ['Mạng lưới tính toán GPU cấp doanh nghiệp ghi nhận doanh thu thực tế cao.'],
    risks: ['Cản $0.072.'],
    entryTarget: '$0.059 - $0.063', stopLoss: '$0.054', takeProfit: '$0.082 - $0.095'
  },
  {
    id: 'bouncebit', symbol: 'BB', name: 'BounceBit', category: 'Bitcoin Restaking',
    basePrice: 0.385, priceChange24h: -4.20, high24h: 0.415, low24h: 0.375, volume24h: '75M', rsi: 43.0,
    whaleInflowUSD: 14.0, whaleOutflowUSD: 4.5, netWhaleFlow: -9.5, spotScore: 40,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC ĐIỀU CHỈNH', confidence: 79,
    reasons: ['Nguồn cung phát hành mới tạo áp lực bán ròng.'],
    risks: ['Gãy $0.36.'],
    entryTarget: 'ĐỨNG NGOÀI', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'kamino-finance', symbol: 'KMNO', name: 'Kamino', category: 'DeFi / Solana',
    basePrice: 0.145, priceChange24h: 7.40, high24h: 0.158, low24h: 0.132, volume24h: '55M', rsi: 57.5,
    whaleInflowUSD: 2.5, whaleOutflowUSD: 9.8, netWhaleFlow: 7.3, spotScore: 82,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SOLANA LENDING', confidence: 83,
    reasons: ['Giao thức cho vay và thanh khoản tự động hàng đầu Solana đạt TVL cao.'],
    risks: ['Cản $0.165.'],
    entryTarget: '$0.138 - $0.147', stopLoss: '$0.126', takeProfit: '$0.185 - $0.21'
  },
  {
    id: 'tensor', symbol: 'TNSR', name: 'Tensor', category: 'NFT / Solana',
    basePrice: 0.625, priceChange24h: -6.50, high24h: 0.685, low24h: 0.605, volume24h: '45M', rsi: 39.0,
    whaleInflowUSD: 11.0, whaleOutflowUSD: 2.8, netWhaleFlow: -8.2, spotScore: 35,
    status: 'AVOID' as const, statusLabel: 'ÁP LỰC XẢ', confidence: 82,
    reasons: ['Thanh khoản chợ NFT sụt giảm, cá voi phân phối token.'],
    risks: ['Gãy $0.58.'],
    entryTarget: 'QUAN SÁT', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'renzo', symbol: 'REZ', name: 'Renzo', category: 'DeFi / Restaking',
    basePrice: 0.042, priceChange24h: -7.80, high24h: 0.047, low24h: 0.041, volume24h: '40M', rsi: 34.0,
    whaleInflowUSD: 13.5, whaleOutflowUSD: 2.5, netWhaleFlow: -11.0, spotScore: 28,
    status: 'AVOID' as const, statusLabel: 'CẢNH BÁO XẢ NẶNG', confidence: 89,
    reasons: ['Áp lực bán tháo liên tục sau chuỗi mở khóa token.'],
    risks: ['Chưa có lực cầu.'],
    entryTarget: 'CẤM BẮT ĐÁY', stopLoss: 'N/A', takeProfit: 'N/A'
  },
  {
    id: 'lista-dao', symbol: 'LISTA', name: 'Lista DAO', category: 'DeFi / BSC',
    basePrice: 0.415, priceChange24h: 3.80, high24h: 0.438, low24h: 0.395, volume24h: '35M', rsi: 51.5,
    whaleInflowUSD: 2.0, whaleOutflowUSD: 6.8, netWhaleFlow: 4.8, spotScore: 78,
    status: 'BUY_SPOT' as const, statusLabel: 'TÍCH LŨY SPOT', confidence: 80,
    reasons: ['Giao thức thế chấp nợ CDP và liquid staking trọng điểm trên BNB Chain.'],
    risks: ['Cản $0.46.'],
    entryTarget: '$0.395 - $0.420', stopLoss: '$0.375', takeProfit: '$0.52 - $0.58'
  }
];

export const TOP_100_COINS: TokenItem[] = RAW_TOP_100_DEFS.map((coin) => {
  const isAccumulating = coin.netWhaleFlow >= 0;
  const decimals = getDecimalsForPrice(coin.basePrice);
  const sym = coin.symbol.toLowerCase();

  // Các đồng coin có biến động DEX/Arbitrage cao (RAY, XPL, ARB, OP, ENS, PEPE, WIF, SUI, APT, PENDLE, NEAR...)
  const isHighArbitrage = ['ray', 'xpl', 'arb', 'op', 'ens', 'pepe', 'wif', 'bonk', 'floki', 'jup', 'sui', 'apt', 'pendle', 'fet', 'render'].includes(sym);
  const okxRatio = isHighArbitrage ? 1.0018 : 1.0002;
  const coinbaseRatio = isHighArbitrage ? 1.0028 : 1.0006;
  const dexRatio = isHighArbitrage ? 0.9955 : 0.9992;

  const binancePrice = coin.basePrice;
  const okxPrice = Number((coin.basePrice * okxRatio).toFixed(decimals));
  const coinbasePrice = Number((coin.basePrice * coinbaseRatio).toFixed(decimals));
  const dexPrice = Number((coin.basePrice * dexRatio).toFixed(decimals));

  const minP = Math.min(binancePrice, okxPrice, coinbasePrice, dexPrice);
  const maxP = Math.max(binancePrice, okxPrice, coinbasePrice, dexPrice);
  const spreadPct = minP > 0 ? +(((maxP - minP) / minP) * 100).toFixed(2) : 0.14;

  return {
    ...coin,
    binancePrice,
    okxPrice,
    coinbasePrice,
    dexPrice,
    globalAvgPrice: coin.basePrice,
    spreadPct,
  };
});
