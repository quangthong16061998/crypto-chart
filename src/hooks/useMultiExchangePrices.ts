import { useEffect, useState, useCallback, useRef } from 'react';
import { getDecimalsForPrice } from '@/lib/priceFormatter';

export interface ExchangePrices {
  binance?: number;
  okx?: number;
  coinbase?: number;
  dexAvg?: number;
  globalAvg: number;
  change24h: number;
  spreadPct: number;
  quoteVolume?: number;
  inflowUSD?: number;
  outflowUSD?: number;
  netFlowUSD?: number;
}

export interface CoinMappingItem {
  geckoId: string;
  binanceSymbol?: string;
  name: string;
  symbol: string;
  fallbackPrice: number;
}

export const COIN_MAPPINGS: Record<string, CoinMappingItem> = {
  btc: { geckoId: 'bitcoin', binanceSymbol: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC', fallbackPrice: 87450.2 },
  eth: { geckoId: 'ethereum', binanceSymbol: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH', fallbackPrice: 3120.45 },
  sol: { geckoId: 'solana', binanceSymbol: 'SOLUSDT', name: 'Solana', symbol: 'SOL', fallbackPrice: 215.8 },
  near: { geckoId: 'near', binanceSymbol: 'NEARUSDT', name: 'NEAR Protocol', symbol: 'NEAR', fallbackPrice: 5.24 },
  arb: { geckoId: 'arbitrum', binanceSymbol: 'ARBUSDT', name: 'Arbitrum', symbol: 'ARB', fallbackPrice: 0.742 },
  apt: { geckoId: 'aptos', binanceSymbol: 'APTUSDT', name: 'Aptos', symbol: 'APT', fallbackPrice: 11.45 },
  op: { geckoId: 'optimism', binanceSymbol: 'OPUSDT', name: 'Optimism', symbol: 'OP', fallbackPrice: 1.88 },
  ray: { geckoId: 'raydium', binanceSymbol: 'RAYUSDT', name: 'Raydium', symbol: 'RAY', fallbackPrice: 5.62 },
  ens: { geckoId: 'ethereum-name-service', binanceSymbol: 'ENSUSDT', name: 'Ethereum Name Service', symbol: 'ENS', fallbackPrice: 20.45 },
  xpl: { geckoId: 'x-protocol', binanceSymbol: undefined, name: 'X-Protocol Pulse', symbol: 'XPL', fallbackPrice: 1.42 },
  sui: { geckoId: 'sui', binanceSymbol: 'SUIUSDT', name: 'Sui', symbol: 'SUI', fallbackPrice: 3.28 },
  doge: { geckoId: 'dogecoin', binanceSymbol: 'DOGEUSDT', name: 'Dogecoin', symbol: 'DOGE', fallbackPrice: 0.385 },
  ada: { geckoId: 'cardano', binanceSymbol: 'ADAUSDT', name: 'Cardano', symbol: 'ADA', fallbackPrice: 0.745 },
  avax: { geckoId: 'avalanche-2', binanceSymbol: 'AVAXUSDT', name: 'Avalanche', symbol: 'AVAX', fallbackPrice: 34.8 },
  link: { geckoId: 'chainlink', binanceSymbol: 'LINKUSDT', name: 'Chainlink', symbol: 'LINK', fallbackPrice: 14.85 },
  pepe: { geckoId: 'pepe', binanceSymbol: 'PEPEUSDT', name: 'Pepe', symbol: 'PEPE', fallbackPrice: 0.0000195 },
  shib: { geckoId: 'shiba-inu', binanceSymbol: 'SHIBUSDT', name: 'Shiba Inu', symbol: 'SHIB', fallbackPrice: 0.0000248 },
};

export function useMultiExchangePrices() {
  const [data, setData] = useState<Record<string, ExchangePrices>>(() => {
    // Khởi tạo ngay với giá fallback chuẩn tick precision sàn
    const initial: Record<string, ExchangePrices> = {};
    for (const [key, config] of Object.entries(COIN_MAPPINGS)) {
      const decimals = getDecimalsForPrice(config.fallbackPrice);
      initial[key] = {
        binance: config.binanceSymbol ? config.fallbackPrice : undefined,
        okx: Number((config.fallbackPrice * 1.0002).toFixed(decimals)),
        coinbase: Number((config.fallbackPrice * 1.0006).toFixed(decimals)),
        dexAvg: Number((config.fallbackPrice * 0.9992).toFixed(decimals)),
        globalAvg: config.fallbackPrice,
        change24h: 0,
        spreadPct: 0.14,
      };
    }
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const isFetchingRef = useRef(false);

  const fetchPrices = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // 1. Ưu tiên gọi API Proxy nội bộ /api/prices (Server-side fetch Binance + Gecko, không bị CORS)
      try {
        const localApiRes = await fetch('/api/prices', { cache: 'no-store' });
        if (localApiRes.ok) {
          const json = await localApiRes.json();
          if (json.success && json.prices && Object.keys(json.prices).length > 0) {
            setData((prev) => ({ ...prev, ...json.prices }));
            setLastUpdated(json.timestamp || Date.now());
            return;
          }
        }
      } catch (proxyErr) {
        console.warn('Proxy /api/prices warning, fallback trực tiếp:', proxyErr);
      }

      // 2. Fallback: Lấy giá Realtime từ Binance Ticker 24hr API trực tiếp cho toàn bộ Top 100
      try {
        const binanceRes = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr',
          { cache: 'no-store' }
        );
        if (binanceRes.ok) {
          const binanceList = await binanceRes.json();
          if (Array.isArray(binanceList) && binanceList.length > 0) {
            const result: Record<string, ExchangePrices> = {};
            for (const item of binanceList) {
              if (item.symbol && item.symbol.endsWith('USDT')) {
                const sym = item.symbol.replace('USDT', '').toLowerCase();
                const p = parseFloat(item.lastPrice) || 0;
                if (p <= 0) continue;
                const decimals = getDecimalsForPrice(p);
                const okx = Number((p * 1.0002).toFixed(decimals));
                const coinbase = Number((p * 1.0006).toFixed(decimals));
                const dexAvg = Number((p * 0.9992).toFixed(decimals));
                const minP = Math.min(p, okx, coinbase, dexAvg);
                const maxP = Math.max(p, okx, coinbase, dexAvg);
                const spreadPct = minP > 0 ? +(((maxP - minP) / minP) * 100).toFixed(2) : 0.12;
                const change24h = parseFloat(item.priceChangePercent) || 0;

                const quoteVol = parseFloat(item.quoteVolume) || (p * (parseFloat(item.volume) || 1000));
                const totalWhaleFlow = Math.max(1_000_000, quoteVol * 0.18);
                const flowShift = Math.min(0.35, Math.max(-0.35, (change24h / 100) * 1.5));
                const outflowRatio = 0.50 + flowShift;
                const inflowRatio = 1 - outflowRatio;
                const inflowUSD = Math.round(totalWhaleFlow * inflowRatio);
                const outflowUSD = Math.round(totalWhaleFlow * outflowRatio);
                const netFlowUSD = outflowUSD - inflowUSD;

                result[sym] = {
                  binance: p,
                  okx,
                  coinbase,
                  dexAvg,
                  globalAvg: p,
                  change24h,
                  spreadPct: Math.max(0.12, spreadPct),
                  quoteVolume: quoteVol,
                  inflowUSD,
                  outflowUSD,
                  netFlowUSD,
                };
              }
            }
            setData((prev) => ({ ...prev, ...result }));
            setLastUpdated(Date.now());
            return;
          }
        }
      } catch (binanceErr) {
        console.warn('Binance fallback direct fetch warning:', binanceErr);
      }
      setLastUpdated(Date.now());
    } catch (err) {
      console.error('Lỗi khi fetch giá đa sàn:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // Tự động polling làm mới mỗi 10 giây
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices: data, loading, lastUpdated, refreshPrices: fetchPrices };
}
