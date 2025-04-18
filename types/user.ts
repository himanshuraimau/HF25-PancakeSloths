/**
 * User profile and account related types
 */

export interface User {
  id: string
  email: string
  fullName: string
  username?: string
  avatar?: string
  createdAt: string
  updatedAt: string
  isEmailVerified: boolean
  hasTwoFactorAuth: boolean
  role: UserRole
  preferences: UserPreferences
  wallets: Wallet[]
  kycStatus: KYCStatus
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

export enum KYCStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: NotificationPreferences
  language: string
  currency: string
  timezone: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  transactionUpdates: boolean
  priceAlerts: boolean
}

export interface Wallet {
  id: string
  address: string
  type: WalletType
  label?: string
  isDefault: boolean
  createdAt: string
}

export enum WalletType {
  ETHEREUM = "ethereum",
  BITCOIN = "bitcoin",
  SOLANA = "solana",
  POLYGON = "polygon",
  BINANCE = "binance",
}

export interface KYCDocument {
  id: string
  type: KYCDocumentType
  status: KYCDocumentStatus
  uploadedAt: string
  reviewedAt?: string
  rejectionReason?: string
  fileUrl: string
}

export enum KYCDocumentType {
  PASSPORT = "passport",
  DRIVERS_LICENSE = "drivers_license",
  ID_CARD = "id_card",
  PROOF_OF_ADDRESS = "proof_of_address",
  SELFIE = "selfie",
}

export enum KYCDocumentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
