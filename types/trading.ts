/**
 * Trading related types for the platform
 */

export interface Order {
  id: string
  userId: string
  assetId: string
  type: OrderType
  side: OrderSide
  quantity: number
  price: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  expiresAt?: string
  filledQuantity: number
  averageFilledPrice?: number
  remainingQuantity: number
  fee: number
  feeAssetId: string
  walletAddress: string
  stopPrice?: number
  limitPrice?: number
  timeInForce: TimeInForce
  cancelReason?: string
  trades: Trade[]
}

export enum OrderType {
  MARKET = "market",
  LIMIT = "limit",
  STOP = "stop",
  STOP_LIMIT = "stop_limit",
  TRAILING_STOP = "trailing_stop",
}

export enum OrderSide {
  BUY = "buy",
  SELL = "sell",
}

export enum OrderStatus {
  OPEN = "open",
  PARTIALLY_FILLED = "partially_filled",
  FILLED = "filled",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export enum TimeInForce {
  GTC = "gtc", // Good Till Cancelled
  IOC = "ioc", // Immediate Or Cancel
  FOK = "fok", // Fill Or Kill
  DAY = "day", // Day Order
}

export interface Trade {
  id: string
  orderId: string
  assetId: string
  price: number
  quantity: number
  side: OrderSide
  fee: number
  feeAssetId: string
  timestamp: string
  counterpartyOrderId: string
  walletAddress: string
  transactionHash?: string
}

export interface OrderBook {
  assetId: string
  timestamp: string
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
  orders: number
}

export interface MarketPair {
  id: string
  baseAssetId: string
  quoteAssetId: string
  lastPrice: number
  priceChangePercent24h: number
  highPrice24h: number
  lowPrice24h: number
  volume24h: number
  quoteVolume24h: number
  openPrice24h: number
  closePrice24h: number
  bidPrice: number
  askPrice: number
  bidQuantity: number
  askQuantity: number
  isActive: boolean
}

export interface TradingChart {
  assetId: string
  interval: ChartInterval
  startTime: string
  endTime: string
  candles: Candle[]
}

export enum ChartInterval {
  ONE_MINUTE = "1m",
  FIVE_MINUTES = "5m",
  FIFTEEN_MINUTES = "15m",
  THIRTY_MINUTES = "30m",
  ONE_HOUR = "1h",
  FOUR_HOURS = "4h",
  ONE_DAY = "1d",
  ONE_WEEK = "1w",
  ONE_MONTH = "1M",
}

export interface Candle {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TradingPosition {
  id: string
  userId: string
  assetId: string
  quantity: number
  averageEntryPrice: number
  currentPrice: number
  unrealizedPnl: number
  unrealizedPnlPercentage: number
  realizedPnl: number
  openedAt: string
  updatedAt: string
  status: PositionStatus
  leverage?: number
  liquidationPrice?: number
  margin?: number
  marginType?: MarginType
}

export enum PositionStatus {
  OPEN = "open",
  CLOSED = "closed",
  LIQUIDATED = "liquidated",
}

export enum MarginType {
  ISOLATED = "isolated",
  CROSS = "cross",
}
