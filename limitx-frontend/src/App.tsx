import React, { useEffect, useRef, useState } from 'react';
// 1. ADD 'AreaSeries' to imports
import { createChart, ColorType, ISeriesApi, AreaSeries } from 'lightweight-charts';
import io from 'socket.io-client';

const CHART_COLORS = {
  background: '#121212',
  textColor: '#d1d4dc',
  areaTop: 'rgba(41, 98, 255, 0.56)',
  areaBottom: 'rgba(41, 98, 255, 0.04)',
  lineColor: 'rgba(41, 98, 255, 1)',
};

const socket = io('http://localhost:3000');

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [tradeLog, setTradeLog] = useState<string[]>([]);
  
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: CHART_COLORS.background },
        textColor: CHART_COLORS.textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
    });

    // --- FIX IS HERE ---
    // Old: chart.addAreaSeries({...})
    // New (v5): chart.addSeries(AreaSeries, {...})
    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: CHART_COLORS.lineColor,
      topColor: CHART_COLORS.areaTop,
      bottomColor: CHART_COLORS.areaBottom,
    });

    seriesRef.current = newSeries;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log("✅ Connected to WebSocket");
    });

    socket.on('trade', (trade: { price: number, quantity: number, time: number }) => {
      setCurrentPrice(trade.price);
      setTradeLog(prev => [`Match: ${trade.quantity} @ $${trade.price}`, ...prev.slice(0, 4)]);

      if (seriesRef.current) {
        seriesRef.current.update({
          time: trade.time / 1000 as any, 
          value: trade.price,
        });
      }
    });

    return () => {
      socket.off('trade');
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1 style={{ fontFamily: 'monospace' }}>🚀 LimitX <span style={{color: '#2962FF'}}>PRO</span></h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 3 }}>
          <div 
            ref={chartContainerRef} 
            style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }} 
          />
        </div>

        <div style={{ flex: 1, fontFamily: 'monospace' }}>
          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#888' }}>LAST PRICE</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
              ${currentPrice.toFixed(2)}
            </div>
          </div>

          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#888', marginBottom: '10px' }}>TRADE FEED</h3>
            {tradeLog.map((log, i) => (
              <div key={i} style={{ borderBottom: '1px solid #222', padding: '8px 0', color: '#00E676' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;