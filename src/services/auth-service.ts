/**
 * Authentication service for handling user login, registration, and session management
 */

import { apiService } from "./api"
import type {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  TwoFactorAuthVerify,
  TwoFactorAuthSetup,
  ApiResponse,
  User,
} from "@/types"

class AuthService {
  /**
   * Log in a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>("/auth/login", credentials)
  }

  /**
   * Register a new user
   */
  async signup(userData: SignupCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>("/auth/signup", userData)
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiService.post<void>("/auth/logout")
    if (response.success) {
      apiService.setToken(null)
    }
    return response
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>("/auth/me")
  }

  /**
   * Request a password reset email
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>("/auth/password-reset", data)
  }

  /**
   * Confirm a password reset with token
   */
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>("/auth/password-reset/confirm", data)
  }

  /**
   * Set up two-factor authentication
   */
  async setupTwoFactorAuth(): Promise<ApiResponse<TwoFactorAuthSetup>> {
    return apiService.post<TwoFactorAuthSetup>("/auth/2fa/setup")
  }

  /**
   * Verify two-factor authentication
   */
  async verifyTwoFactorAuth(data: TwoFactorAuthVerify): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>("/auth/2fa/verify", data)
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactorAuth(code: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>("/auth/2fa/disable", { code })
  }

  /**
   * Verify email address with token
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>("/auth/verify-email", { token })
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresAt: number }>> {
    return apiService.post<{ token: string; expiresAt: number }>("/auth/refresh-token", { refreshToken })
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiService.getToken()
  }
}

// Create and export a singleton instance
export const authService = new AuthService()
