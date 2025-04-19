/**
 * API related types for requests, responses, and error handling
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  path?: string
  timestamp?: string
}

export interface ApiMeta {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
  hasMore?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | null
}

export interface ApiRequest<T> {
  data: T
  meta?: Record<string, any>
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface ApiEndpoint {
  path: string
  method: HttpMethod
  requiresAuth: boolean
  rateLimit?: {
    requests: number
    period: number // in seconds
  }
  version: string
  deprecated?: boolean
  successResponseCode: number
}

export interface WebhookEvent<T> {
  id: string
  type: WebhookEventType
  createdAt: string
  data: T
  signature: string
}

export enum WebhookEventType {
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  ASSET_PRICE_CHANGED = "asset.price_changed",
  ORDER_CREATED = "order.created",
  ORDER_UPDATED = "order.updated",
  TRADE_EXECUTED = "trade.executed",
  PROPOSAL_CREATED = "proposal.created",
  PROPOSAL_UPDATED = "proposal.updated",
  VOTE_CAST = "vote.cast",
  PROJECT_CREATED = "project.created",
  PROJECT_UPDATED = "project.updated",
  CONTRIBUTION_MADE = "contribution.made",
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number // Unix timestamp
}

export interface ApiKey {
  id: string
  userId: string
  name: string
  key: string // Partial, masked
  permissions: ApiPermission[]
  createdAt: string
  expiresAt?: string
  lastUsedAt?: string
  ipRestrictions?: string[]
  referrerRestrictions?: string[]
}

export enum ApiPermission {
  READ = "read",
  WRITE = "write",
  TRADE = "trade",
  WITHDRAW = "withdraw",
  ADMIN = "admin",
}
