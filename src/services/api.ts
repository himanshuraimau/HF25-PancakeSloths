/**
 * Base API service with common functionality for all API requests
 */

import type { ApiResponse, ApiError, PaginationParams, FilterParams } from "@/types"

// Base API URL - replace with your actual API URL in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.unityvault.com/v1"

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export class ApiService {
  private token: string | null = null

  /**
   * Set the authentication token for API requests
   */
  setToken(token: string | null): void {
    this.token = token
    // Optionally store in localStorage for persistence
    if (token) {
      localStorage.setItem("auth_token", token)
    } else {
      localStorage.removeItem("auth_token")
    }
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    if (!this.token) {
      // Try to get from localStorage if not set
      this.token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    }
    return this.token
  }

  /**
   * Make an API request with proper error handling
   */
  async request<T>(
    endpoint: string,
    method: HttpMethod = HttpMethod.GET,
    data?: any,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const url = `${options.baseUrl || API_BASE_URL}${endpoint}`
    const token = this.getToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token && !options.skipAuth) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT)

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        credentials: options.withCredentials ? "include" : "same-origin",
      })

      clearTimeout(timeoutId)

      const contentType = response.headers.get("content-type")
      let responseData: any

      // Check if response is JSON
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        // Handle non-JSON responses
        const text = await response.text()
        responseData = { success: response.ok, data: text }
      }

      // Handle API-specific error format
      if (!response.ok) {
        const error: ApiError = responseData.error || {
          code: response.status.toString(),
          message: responseData.message || response.statusText,
        }

        return {
          success: false,
          error,
        }
      }

      return responseData as ApiResponse<T>
    } catch (error: any) {
      clearTimeout(timeoutId)

      // Handle network errors, timeouts, etc.
      const apiError: ApiError = {
        code: "network_error",
        message: error.message || "Network error occurred",
        details: { name: error.name },
      }

      if (error.name === "AbortError") {
        apiError.code = "timeout"
        apiError.message = "Request timed out"
      }

      return {
        success: false,
        error: apiError,
      }
    }
  }

  /**
   * Helper method for GET requests
   */
  async get<T>(
    endpoint: string,
    params?: PaginationParams & FilterParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(this.cleanParams(params) as any).toString()}` : ""
    return this.request<T>(`${endpoint}${queryString}`, HttpMethod.GET, undefined, options)
  }

  /**
   * Helper method for POST requests
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.POST, data, options)
  }

  /**
   * Helper method for PUT requests
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.PUT, data, options)
  }

  /**
   * Helper method for PATCH requests
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.PATCH, data, options)
  }

  /**
   * Helper method for DELETE requests
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, HttpMethod.DELETE, undefined, options)
  }

  /**
   * Clean params by removing undefined and null values
   */
  private cleanParams(params: Record<string, any>): Record<string, string> {
    return Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            acc[key] = value.join(",")
          } else {
            acc[key] = String(value)
          }
        }
        return acc
      },
      {} as Record<string, string>,
    )
  }
}

export interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  baseUrl?: string
  skipAuth?: boolean
  withCredentials?: boolean
}

// Create and export a singleton instance
export const apiService = new ApiService()
