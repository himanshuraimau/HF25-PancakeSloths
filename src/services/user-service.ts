/**
 * User service for handling user profile and account operations
 */

import { apiService } from "./api"
import type {
  User,
  UserPreferences,
  Wallet,
  KYCDocument,
  KYCDocumentType,
  ApiResponse,
  PaginationParams,
} from "@/types"

class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiService.get<User>("/users/profile")
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>("/users/profile", profileData)
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return apiService.put<UserPreferences>("/users/preferences", preferences)
  }

  /**
   * Get user's wallets
   */
  async getWallets(): Promise<ApiResponse<Wallet[]>> {
    return apiService.get<Wallet[]>("/users/wallets")
  }

  /**
   * Add a new wallet
   */
  async addWallet(walletData: Partial<Wallet>): Promise<ApiResponse<Wallet>> {
    return apiService.post<Wallet>("/users/wallets", walletData)
  }

  /**
   * Update a wallet
   */
  async updateWallet(walletId: string, walletData: Partial<Wallet>): Promise<ApiResponse<Wallet>> {
    return apiService.put<Wallet>(`/users/wallets/${walletId}`, walletData)
  }

  /**
   * Delete a wallet
   */
  async deleteWallet(walletId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/users/wallets/${walletId}`)
  }

  /**
   * Get KYC status
   */
  async getKycStatus(): Promise<ApiResponse<{ status: string; completedSteps: string[]; nextStep?: string }>> {
    return apiService.get<{ status: string; completedSteps: string[]; nextStep?: string }>("/users/kyc/status")
  }

  /**
   * Upload KYC document
   */
  async uploadKycDocument(
    documentType: KYCDocumentType,
    file: File,
    metadata?: Record<string, any>,
  ): Promise<ApiResponse<KYCDocument>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("documentType", documentType)

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata))
    }

    return apiService.post<KYCDocument>("/users/kyc/documents", formData, {
      headers: {
        // Don't set Content-Type here, it will be set automatically with the correct boundary
      },
    })
  }

  /**
   * Get KYC documents
   */
  async getKycDocuments(): Promise<ApiResponse<KYCDocument[]>> {
    return apiService.get<KYCDocument[]>("/users/kyc/documents")
  }

  /**
   * Get user activity
   */
  async getActivity(
    params?: PaginationParams & { type?: string; startDate?: string; endDate?: string },
  ): Promise<ApiResponse<{ type: string; description: string; timestamp: string; metadata?: Record<string, any> }[]>> {
    return apiService.get<{ type: string; description: string; timestamp: string; metadata?: Record<string, any> }[]>(
      "/users/activity",
      params,
    )
  }

  /**
   * Get user notifications
   */
  async getNotifications(
    params?: PaginationParams & { read?: boolean },
  ): Promise<
    ApiResponse<{ id: string; type: string; message: string; read: boolean; createdAt: string; data?: any }[]>
  > {
    return apiService.get<
      { id: string; type: string; message: string; read: boolean; createdAt: string; data?: any }[]
    >("/users/notifications", params)
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.put<{ message: string }>(`/users/notifications/${notificationId}/read`)
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiService.put<{ message: string }>("/users/notifications/read-all")
  }

  /**
   * Get user referrals
   */
  async getReferrals(): Promise<
    ApiResponse<{
      code: string
      url: string
      referrals: { userId: string; status: string; joinedAt: string; reward?: number }[]
      totalRewards: number
    }>
  > {
    return apiService.get<{
      code: string
      url: string
      referrals: { userId: string; status: string; joinedAt: string; reward?: number }[]
      totalRewards: number
    }>("/users/referrals")
  }
}

// Create and export a singleton instance
export const userService = new UserService()
