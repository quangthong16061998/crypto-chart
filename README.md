# 🐋 WhalePulse Crypto Radar (v2.5)

> **Hệ thống Dashboard theo dõi thị trường Crypto, bắt biến động giá và phân tích dòng tiền Smart Money / Whale Alerts thời gian thực.**  
> Thiết kế theo phong cách **Cyberpunk / Bloomberg Terminal dark mode**, tối ưu hiệu năng với kiến trúc **Next.js 15+ App Router**, **TypeScript**, **Tailwind CSS**, và **Recharts**.

---

## ⚡ Các Tính Năng Nổi Bật

1. **Whale Radar (Giám Sát Cá Mập Realtime)**:
   - Tự động bắt các giao dịch quy mô lớn (> $500K, $10M, $50M+) trên các mạng lưới Bitcoin, Ethereum, Solana, BSC, Arbitrum.
   - Phân loại thông minh:
     - 🚨 **Nạp sàn (Cảnh báo Xả - DUMP ALERT)**: Phát hiện cá mập nạp token lên CEX (Binance, Coinbase, OKX).
     - 🟢 **Rút ví lạnh (Tích lũy - ACCUMULATION)**: Bắt tín hiệu gom hàng dài hạn của các quỹ đầu tư.
     - 🔄 **Nội bộ / OTC**: Điều phối thanh khoản giữa các cụm ví sàn và market makers.

2. **Market Screener (Bảng Giá & Sparklines)**:
   - Dữ liệu Top Coins với biến động 1h, 24h, 7d, Volume 24h và Vốn hóa thị trường.
   - Biểu đồ mini **7-Day Sparkline SVG** siêu nhẹ, không lag giật.
   - Bộ lọc chuyên sâu theo danh mục: **Layer 1**, **DeFi**, **Meme**, **AI**, **Layer 2**.
   - Hỗ trợ sắp xếp đa chiều và tìm kiếm tức thì.

3. **Alpha Signals & Alerts Engine (Bộ Lọc Bất Thường)**:
   - Lọc tự động các đồng **Top Gainers** (> +10%), **Top Losers** (< -8%).
   - Cảnh báo **Đột biến Volume 24h** (> 200% so với trung bình 7 ngày).
   - Tích hợp chỉ số tâm lý **Fear & Greed Index** từ Alternative.me.

4. **Flow Analytics (Biểu Đồ Trực Quan Recharts)**:
   - So sánh dòng tiền nạp vào vs rút ra sàn CEX theo từng mạng lưới Blockchain (BTC, ETH, SOL, ARB, BSC, Base).
   - Báo cáo nhận định dòng tiền Smart Money (Verdict).

5. **Cơ Chế Dự Phòng 3 Lớp (Failover Safe)**:
   - **Tầng 1**: CoinGecko Free API + Whale Alert API.
   - **Tầng 2**: Binance 24h Public API (Keyless, phản hồi siêu nhanh).
   - **Tầng 3**: Intelligent Mock & Live Simulator Engine. Khi chưa điền API Key hoặc bị 429 Rate Limit, hệ thống tự động fallback sang dữ liệu mô phỏng realtime sinh động, **không bao giờ để web bị vỡ giao diện**.

---

## 🛠️ Cấu Trúc Dự Án (Clean Architecture)

```
c:\Project\Coin\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── market/route.ts      # Route handler trung gian bảo mật & cache market data
│   │   │   └── whale/route.ts       # Route handler whale transactions & live simulator
│   │   ├── globals.css              # Cyberpunk tokens, glassmorphism, marquee & radar animations
│   │   ├── layout.tsx               # Root layout với SEO metadata
│   │   └── page.tsx                 # Trang chính kết nối toàn bộ hệ sinh thái
│   ├── components/
│   │   └── dashboard/
│   │       ├── Header.tsx           # Thanh điều hướng Cyberpunk, live simulator toggle, âm thanh
│   │       ├── TickerMarquee.tsx    # Thanh ticker cuộn ngang giá và chỉ số tâm lý
│   │       ├── HeroMetrics.tsx      # 4 Thẻ tóm tắt vốn hóa, net flow, whale volume, alerts
│   │       ├── WhaleFeed.tsx        # Danh sách giao dịch cá mập kèm bộ lọc đa chiều
│   │       ├── CoinTable.tsx        # Bảng giá coin chuẩn, sorting, pagination & categories
│   │       ├── AlertsFeed.tsx       # Bảng cảnh báo đột biến volume và cá mập xả
│   │       ├── FlowAnalytics.tsx    # Biểu đồ Recharts BarChart dòng tiền theo Chain
│   │       ├── SparklineChart.tsx   # Component vẽ SVG Sparkline tương tác mượt mà
│   │       ├── CoinDetailModal.tsx  # Modal soi chi tiết từng đồng coin
│   │       └── WhaleDetailModal.tsx # Modal soi chi tiết từng giao dịch cá mập
│   ├── lib/
│   │   ├── api/
│   │   │   └── crypto.ts            # API client tích hợp CoinGecko, Binance, Fear & Greed
│   │   ├── mockData.ts              # Dataset mẫu phong phú và bộ sinh whale realtime
│   │   └── utils.ts                 # Helper format tiền tệ USD, token, thời gian, shorten address
│   └── types/
│       └── crypto.ts                # TypeScript interfaces chuẩn mực
├── .env.example                     # Biến môi trường mẫu
└── package.json
```

---

## 🚀 Khởi Chạy Dự Án Tại Local

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Chạy máy chủ phát triển:**
   ```bash
   npm run dev
   ```

3. Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 🌐 Hướng Dẫn 3 Bước Deploy Lên Web Thật (Vercel Miễn Phí)

### Bước 1: Khởi tạo và đẩy mã nguồn lên GitHub
```bash
git init
git add .
git commit -m "feat: initial crypto dashboard"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/whalepulse-radar.git
git push -u origin main
```

### Bước 2: Kết nối và Deploy trên Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Chọn **Add New...** ➔ **Project** ➔ Chọn repo `whalepulse-radar` vừa đẩy lên.
3. Tại mục **Environment Variables** (Tùy chọn):
   - Thêm `COINGECKO_API_KEY` (nếu có key Demo/Pro) hoặc để trống để sử dụng chế độ Fallback tự động.
   - Thêm `WHALE_ALERT_API_KEY` (nếu có) hoặc để trống.
4. Nhấn **Deploy**.

### Bước 3: Nhận Domain & Hoàn Tất
- Sau khoảng 1–2 phút, Vercel sẽ tự động build và cấp một domain miễn phí dạng:  
  `https://whalepulse-radar.vercel.app` (có sẵn chứng chỉ SSL HTTPS bảo mật toàn cầu).
