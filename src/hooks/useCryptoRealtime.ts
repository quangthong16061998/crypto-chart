"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RealtimePriceUpdate } from "@/types/crypto";
import { getBinanceStreamSymbols } from "@/config/tokens";

export function useCryptoRealtime(symbols?: string[]) {
  const [prices, setPrices] = useState<Record<string, RealtimePriceUpdate>>({});
  const prevPrices = useRef<Record<string, number>>({});
  const updateBuffer = useRef<Record<string, RealtimePriceUpdate>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Danh sách stream Binance
  const streamPairs = symbols && symbols.length > 0 
    ? symbols.map((s) => `${s.toLowerCase()}usdt@ticker`)
    : getBinanceStreamSymbols().map((s) => `${s}@ticker`);

  useEffect(() => {
    if (streamPairs.length === 0) return;

    let isMounted = true;
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;

    // Buffer flush định kỳ 120ms để tối ưu hóa render (không bị đơ UI khi tick nhanh)
    const startThrottleTimer = () => {
      timerRef.current = setInterval(() => {
        if (Object.keys(updateBuffer.current).length > 0 && isMounted) {
          setPrices((prev) => ({
            ...prev,
            ...updateBuffer.current,
          }));
          updateBuffer.current = {};
        }
      }, 120);
    };

    startThrottleTimer();

    // Kết nối WebSocket Binance Stream
    const connectWS = () => {
      try {
        const streamUrl = `wss://stream.binance.com:9443/ws/${streamPairs.join("/")}`;
        ws = new WebSocket(streamUrl);

        ws.onopen = () => {
          // Connected cleanly
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (!data || !data.s || !data.c) return;

            // data.s = "NEARUSDT", data.c = "6.8500"
            const rawSymbol = data.s.replace(/USDT$/i, "").toLowerCase();
            const currentPrice = parseFloat(data.c);
            const change24h = parseFloat(data.P || "0");
            const high24h = parseFloat(data.h || "0");
            const low24h = parseFloat(data.l || "0");

            if (!rawSymbol || isNaN(currentPrice)) return;

            const oldPrice = prevPrices.current[rawSymbol] ?? currentPrice;
            let direction: RealtimePriceUpdate["direction"] = "same";
            if (currentPrice > oldPrice) direction = "up";
            else if (currentPrice < oldPrice) direction = "down";

            prevPrices.current[rawSymbol] = currentPrice;

            // Đưa vào buffer
            updateBuffer.current[rawSymbol] = {
              symbol: rawSymbol,
              price: currentPrice,
              direction,
              timestamp: Date.now(),
              change24h,
              high24h,
              low24h,
            };

            // Tự động fade direction về 'same' sau 1.5 giây
            if (fadeTimers.current[rawSymbol]) {
              clearTimeout(fadeTimers.current[rawSymbol]);
            }
            fadeTimers.current[rawSymbol] = setTimeout(() => {
              if (isMounted) {
                setPrices((prev) => {
                  if (!prev[rawSymbol]) return prev;
                  return {
                    ...prev,
                    [rawSymbol]: {
                      ...prev[rawSymbol],
                      direction: "same",
                    },
                  };
                });
              }
            }, 1500);
          } catch (err) {
            // Ignored parse error
          }
        };

        ws.onerror = () => {
          ws?.close();
        };

        ws.onclose = () => {
          // Reconnect sau 3 giây
          if (isMounted) {
            reconnectTimeout = setTimeout(connectWS, 3000);
          }
        };
      } catch (err) {
        // Fallback reconnection
        if (isMounted) {
          reconnectTimeout = setTimeout(connectWS, 4000);
        }
      }
    };

    connectWS();

    // Giả lập vi mô cho các token DEX hoặc token chưa trên Binance (như XPL)
    fallbackInterval = setInterval(() => {
      if (!isMounted) return;
      const dexTokens = ["xpl"];
      dexTokens.forEach((sym) => {
        const base = prevPrices.current[sym] || 0.845;
        const delta = (Math.random() - 0.48) * (base * 0.003); // +/- 0.3%
        const newPrice = Math.max(0.001, +(base + delta).toFixed(4));
        const direction = newPrice > base ? "up" : "down";
        prevPrices.current[sym] = newPrice;

        updateBuffer.current[sym] = {
          symbol: sym,
          price: newPrice,
          direction,
          timestamp: Date.now(),
        };
      });
    }, 2500);

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (fallbackInterval) clearInterval(fallbackInterval);
      Object.values(fadeTimers.current).forEach(clearTimeout);
      if (ws) {
        ws.onclose = null;
        ws.onerror = null;
        ws.close();
      }
    };
  }, [streamPairs.join(",")]);

  return prices;
}
