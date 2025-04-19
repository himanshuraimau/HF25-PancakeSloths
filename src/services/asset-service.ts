/**
 * Asset service for handling asset-related operations
 */

import { apiService } from "./api"
import type {
  Asset,
  AssetPrice,
  AssetPriceHistory,
  AssetMetadata,
  AssetStats,
  PriceInterval,
  ApiResponse,
  PaginationParams,
} from "@/types"

class AssetService {
  /**
   * Get a list of assets with optional filtering and pagination
   */
  async getAssets(params?: PaginationParams & { type?: string; search?: string }): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>("/assets", params)
  }

  /**
   * Get a single asset by ID
   */
  async getAsset(assetId: string): Promise<ApiResponse<Asset>> {
    return apiService.get<Asset>(`/assets/${assetId}`)
  }

  /**
   * Get current price for an asset
   */
  async getAssetPrice(assetId: string): Promise<ApiResponse<AssetPrice>> {
    return apiService.get<AssetPrice>(`/assets/${assetId}/price`)
  }

  /**
   * Get price history for an asset
   */
  async getAssetPriceHistory(
    assetId: string,
    interval: PriceInterval = PriceInterval.DAY,
  ): Promise<ApiResponse<AssetPriceHistory>> {
    return apiService.get<AssetPriceHistory>(`/assets/${assetId}/price/history`, { interval })
  }

  /**
   * Get metadata for an asset
   */
  async getAssetMetadata(assetId: string): Promise<ApiResponse<AssetMetadata>> {
    return apiService.get<AssetMetadata>(`/assets/${assetId}/metadata`)
  }

  /**
   * Get statistics for an asset
   */
  async getAssetStats(assetId: string): Promise<ApiResponse<AssetStats>> {
    return apiService.get<AssetStats>(`/assets/${assetId}/stats`)
  }

  /**
   * Get trending assets
   */
  async getTrendingAssets(limit = 10): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>("/assets/trending", { limit })
  }

  /**
   * Get recently added assets
   */
  async getRecentAssets(limit = 10): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>("/assets/recent", { limit })
  }

  /**
   * Get user's watchlist
   */
  async getWatchlist(): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>("/assets/watchlist")
  }

  /**
   * Add asset to watchlist
   */
  async addToWatchlist(assetId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(`/assets/watchlist/${assetId}`)
  }

  /**
   * Remove asset from watchlist
   */
  async removeFromWatchlist(assetId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/assets/watchlist/${assetId}`)
  }
}

// Create and export a singleton instance
export const assetService = new AssetService()
