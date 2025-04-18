/**
 * Authentication related types
 */

import type { User } from "./user"

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupCredentials {
  fullName: string
  email: string
  password: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: number
}

export interface AuthError {
  code: string
  message: string
  field?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface TwoFactorAuthSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface TwoFactorAuthVerify {
  code: string
  rememberDevice?: boolean
}
