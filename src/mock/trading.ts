/**
 * Mock data for trading
 */

import type { Order, Trade, MarketPair, Candle, ChartInterval } from "@/types"

export const mockMarketPairs: MarketPair[] = [
  {
    id: "SKY-USDC",
    baseAssetId: "1", // SKY
    quoteAssetId: "USDC",
    lastPrice: 1.05,
    priceChangePercent24h: 3.2,
    highPrice24h: 1.08,
    lowPrice24h: 1.01,
    volume24h: 125430,
    quoteVolume24h: 131701.5,
    openPrice24h: 1.02,
    closePrice24h: 1.05,
    bidPrice: 1.04,
    askPrice: 1.06,
    bidQuantity: 1800,
    askQuantity: 2000,
    isActive: true,
  },
  {
    id: "DGART-USDC",
    baseAssetId: "2", // DGART
    quoteAssetId: "USDC",
    lastPrice: 0.95,
    priceChangePercent24h: -1.2,
    highPrice24h: 0.98,
    lowPrice24h: 0.94,
    volume24h: 87250,
    quoteVolume24h: 82887.5,
    openPrice24h: 0.96,
    closePrice24h: 0.95,
    bidPrice: 0.94,
    askPrice: 0.96,
    bidQuantity: 1200,
    askQuantity: 1500,
    isActive: true,
  },
  {
    id: "CARB-USDC",
    baseAssetId: "3", // CARB
    quoteAssetId: "USDC",
    lastPrice: 1.12,
    priceChangePercent24h: 5.7,
    highPrice24h: 1.15,
    lowPrice24h: 1.06,
    volume24h: 56780,
    quoteVolume24h: 63593.6,
    openPrice24h: 1.06,
    closePrice24h: 1.12,
    bidPrice: 1.11,
    askPrice: 1.13,
    bidQuantity: 900,
    askQuantity: 1500,
    isActive: true,
  },
  {
    id: "TPAT-USDC",
    baseAssetId: "4", // TPAT
    quoteAssetId: "USDC",
    lastPrice: 1.03,
    priceChangePercent24h: 0.8,
    highPrice24h: 1.05,
    lowPrice24h: 1.02,
    volume24h: 98320,
    quoteVolume24h: 101269.6,
    openPrice24h: 1.02,
    closePrice24h: 1.03,
    bidPrice: 1.02,
    askPrice: 1.04,
    bidQuantity: 1500,
    askQuantity: 1800,
    isActive: true,
  },
]

export const mockOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-123",
    assetId: "1", // SKY
    type: OrderType.LIMIT,
    side: OrderSide.BUY,
    quantity: 1000,
    price: 1.03,
    status: OrderStatus.FILLED,
    createdAt: "2024-04-10T14:30:00Z",
    updatedAt: "2024-04-10T14:35:00Z",
    filledQuantity: 1000,
    averageFilledPrice: 1.03,
    remainingQuantity: 0,
    fee: 2.06,
    feeAssetId: "USDC",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timeInForce: TimeInForce.GTC,
    trades: [],
  },
  {
    id: "order-2",
    userId: "user-123",
    assetId: "2", // DGART
    type: OrderType.MARKET,
    side: OrderSide.SELL,
    quantity: 500,
    price: 0,
    status: OrderStatus.FILLED,
    createdAt: "2024-04-09T10:15:00Z",
    updatedAt: "2024-04-09T10:15:05Z",
    filledQuantity: 500,
    averageFilledPrice: 0.96,
    remainingQuantity: 0,
    fee: 0.96,
    feeAssetId: "USDC",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timeInForce: TimeInForce.IOC,
    trades: [],
  },
  {
    id: "order-3",
    userId: "user-123",
    assetId: "3", // CARB
    type: OrderType.LIMIT,
    side: OrderSide.BUY,
    quantity: 750,
    price: 1.1,
    status: OrderStatus.OPEN,
    createdAt: "2024-04-11T09:45:00Z",
    updatedAt: "2024-04-11T09:45:00Z",
    filledQuantity: 0,
    remainingQuantity: 750,
    fee: 0,
    feeAssetId: "USDC",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    timeInForce: TimeInForce.GTC,
    trades: [],
  },
  {
    id: "order-4",
    userId: "user-123",
    assetId: "1", // SKY
    type: OrderType.STOP_LIMIT,
    side: OrderSide.SELL,
    quantity: 500,
    price: 1.0,
    status: OrderStatus.OPEN,
    createdAt: "2024-04-11T11:20:00Z",
    updatedAt: "2024-04-11T11:20:00Z",
    filledQuantity: 0,
    remainingQuantity: 500,
    fee: 0,
    feeAssetId: "USDC",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    stopPrice: 1.01,
    limitPrice: 1.0,
    timeInForce: TimeInForce.GTC,
    trades: [],
  },
]

export const mockTrades: Trade[] = [
  {
    id: "trade-1",
    orderId: "order-1",
    assetId: "1", // SKY
    price: 1.03,
    quantity: 1000,
    side: OrderSide.BUY,
    fee: 2.06,
    feeAssetId: "USDC",
    timestamp: "2024-04-10T14:35:00Z",
    counterpartyOrderId: "order-xyz",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "trade-2",
    orderId: "order-2",
    assetId: "2", // DGART
    price: 0.96,
    quantity: 500,
    side: OrderSide.SELL,
    fee: 0.96,
    feeAssetId: "USDC",
    timestamp: "2024-04-09T10:15:05Z",
    counterpartyOrderId: "order-abc",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
]

/**
 * Generate mock candle data for a chart
 */
export const generateMockCandles = (
  pairId: string,
  interval: ChartInterval = ChartInterval.ONE_HOUR,
  count = 100,
): Candle[] => {
  const candles: Candle[] = []
  const now = new Date()
  const pair = mockMarketPairs.find((p) => p.id === pairId)
  const basePrice = pair?.lastPrice || 1.0

  // Calculate interval in milliseconds
  let intervalMs: number
  switch (interval) {
    case ChartInterval.ONE_MINUTE:
      intervalMs = 60 * 1000
      break
    case ChartInterval.FIVE_MINUTES:
      intervalMs = 5 * 60 * 1000
      break
    case ChartInterval.FIFTEEN_MINUTES:
      intervalMs = 15 * 60 * 1000
      break
    case ChartInterval.THIRTY_MINUTES:
      intervalMs = 30 * 60 * 1000
      break
    case ChartInterval.ONE_HOUR:
      intervalMs = 60 * 60 * 1000
      break
    case ChartInterval.FOUR_HOURS:
      intervalMs = 4 * 60 * 60 * 1000
      break
    case ChartInterval.ONE_DAY:
      intervalMs = 24 * 60 * 60 * 1000
      break
    case ChartInterval.ONE_WEEK:
      intervalMs = 7 * 24 * 60 * 60 * 1000
      break
    case ChartInterval.ONE_MONTH:
      intervalMs = 30 * 24 * 60 * 60 * 1000
      break
    default:
      intervalMs = 60 * 60 * 1000 // Default to 1 hour
  }

  // Generate candles
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs)

    // Random price movement with trend
    const volatility = 0.01 // 1% volatility per candle
    const trend = pair ? pair.priceChangePercent24h / 100 / (24 * count) : 0

    // Calculate open price based on previous close or base price
    const open = i === count - 1 ? basePrice : candles[candles.length - 1].close

    // Random price movement
    const changePercent = (Math.random() - 0.5) * volatility * 2 + trend
    const close = open * (1 + changePercent)

    // High and low prices
    const amplitude = open * volatility * Math.random()
    const high = Math.max(open, close) + amplitude
    const low = Math.min(open, close) - amplitude

    // Random volume
    const volume = Math.floor(Math.random() * 10000) + 1000

    candles.push({
      timestamp: timestamp.toISOString(),
      open: Number.parseFloat(open.toFixed(4)),
      high: Number.parseFloat(high.toFixed(4)),
      low: Number.parseFloat(low.toFixed(4)),
      close: Number.parseFloat(close.toFixed(4)),
      volume,
    })
  }

  return candles
}
