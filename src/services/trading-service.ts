/**
 * Trading service for handling trading operations
 */

import { apiService } from "./api"
import type {
  Order,
  OrderType,
  OrderSide,
  Trade,
  OrderBook,
  MarketPair,
  TradingChart,
  ChartInterval,
  TradingPosition,
  ApiResponse,
  PaginationParams,
} from "@/types"

// Define ChartInterval enum if it's not already defined in "@/types"
// This is a possible fix, assuming ChartInterval is meant to be an enum
// If ChartInterval is defined elsewhere, remove this.
// enum ChartInterval {
//   ONE_MINUTE = "1m",
//   FIVE_MINUTES = "5m",
//   FIFTEEN_MINUTES = "15m",
//   THIRTY_MINUTES = "30m",
//   ONE_HOUR = "1h",
//   FOUR_HOURS = "4h",
//   ONE_DAY = "1d",
//   ONE_WEEK = "1w",
//   ONE_MONTH = "1M",
// }

class TradingService {
  /**
   * Get a list of market pairs
   */
  async getMarketPairs(params?: { baseAsset?: string }): Promise<ApiResponse<MarketPair[]>> {
    return apiService.get<MarketPair[]>("/trading/pairs", params)
  }

  /**
   * Get a single market pair
   */
  async getMarketPair(pairId: string): Promise<ApiResponse<MarketPair>> {
    return apiService.get<MarketPair>(`/trading/pairs/${pairId}`)
  }

  /**
   * Get order book for a market pair
   */
  async getOrderBook(pairId: string, depth = 50): Promise<ApiResponse<OrderBook>> {
    return apiService.get<OrderBook>(`/trading/pairs/${pairId}/orderbook`, { depth })
  }

  /**
   * Get recent trades for a market pair
   */
  async getRecentTrades(pairId: string, limit = 50): Promise<ApiResponse<Trade[]>> {
    return apiService.get<Trade[]>(`/trading/pairs/${pairId}/trades`, { limit })
  }

  /**
   * Get chart data for a market pair
   */
  async getChartData(
    pairId: string,
    interval: ChartInterval = ChartInterval.ONE_HOUR,
    startTime?: string,
    endTime?: string,
  ): Promise<ApiResponse<TradingChart>> {
    return apiService.get<TradingChart>(`/trading/pairs/${pairId}/chart`, {
      interval,
      startTime,
      endTime,
    })
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: {
    pairId: string
    side: OrderSide
    type: OrderType
    quantity: number
    price?: number
    stopPrice?: number
    timeInForce?: string
  }): Promise<ApiResponse<Order>> {
    return apiService.post<Order>("/trading/orders", orderData)
  }

  /**
   * Get a list of user's orders
   */
  async getOrders(params?: PaginationParams & { status?: string; pairId?: string }): Promise<ApiResponse<Order[]>> {
    return apiService.get<Order[]>("/trading/orders", params)
  }

  /**
   * Get a single order by ID
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiService.get<Order>(`/trading/orders/${orderId}`)
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/trading/orders/${orderId}`)
  }

  /**
   * Get user's trading positions
   */
  async getPositions(params?: { assetId?: string }): Promise<ApiResponse<TradingPosition[]>> {
    return apiService.get<TradingPosition[]>("/trading/positions", params)
  }

  /**
   * Get user's trading history
   */
  async getTradingHistory(
    params?: PaginationParams & { assetId?: string; startDate?: string; endDate?: string },
  ): Promise<ApiResponse<Trade[]>> {
    return apiService.get<Trade[]>("/trading/history", params)
  }

  /**
   * Get trading fee structure
   */
  async getFeeStructure(): Promise<
    ApiResponse<{
      makerFee: number
      takerFee: number
      discountTiers: { volume: number; makerDiscount: number; takerDiscount: number }[]
    }>
  > {
    return apiService.get<{
      makerFee: number
      takerFee: number
      discountTiers: { volume: number; makerDiscount: number; takerDiscount: number }[]
    }>("/trading/fees")
  }
}

// Create and export a singleton instance
export const tradingService = new TradingService()
