/**
 * Mock data for users
 */

import type { User, Wallet, KYCDocument } from "@/types"

export const mockCurrentUser: User = {
  id: "user-123",
  email: "john.doe@example.com",
  fullName: "John Doe",
  username: "johndoe",
  avatar: "/placeholder.svg?height=40&width=40",
  createdAt: "2023-01-15T12:00:00Z",
  updatedAt: "2024-04-10T08:30:00Z",
  isEmailVerified: true,
  hasTwoFactorAuth: false,
  role: UserRole.USER,
  preferences: {
    theme: "light",
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketingEmails: false,
      securityAlerts: true,
      transactionUpdates: true,
      priceAlerts: true,
    },
    language: "en",
    currency: "USD",
    timezone: "America/New_York",
  },
  wallets: [
    {
      id: "wallet-1",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      type: WalletType.ETHEREUM,
      label: "Main Wallet",
      isDefault: true,
      createdAt: "2023-01-16T14:30:00Z",
    },
    {
      id: "wallet-2",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      type: WalletType.POLYGON,
      label: "Polygon Wallet",
      isDefault: false,
      createdAt: "2023-03-22T09:15:00Z",
    },
  ],
  kycStatus: KYCStatus.APPROVED,
}

export const mockWallets: Wallet[] = [
  {
    id: "wallet-1",
    address: "0x1234567890abcdef1234567890abcdef12345678",
    type: WalletType.ETHEREUM,
    label: "Main Wallet",
    isDefault: true,
    createdAt: "2023-01-16T14:30:00Z",
  },
  {
    id: "wallet-2",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    type: WalletType.POLYGON,
    label: "Polygon Wallet",
    isDefault: false,
    createdAt: "2023-03-22T09:15:00Z",
  },
  {
    id: "wallet-3",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    type: WalletType.BITCOIN,
    label: "Bitcoin Wallet",
    isDefault: false,
    createdAt: "2023-05-10T11:45:00Z",
  },
]

export const mockKycDocuments: KYCDocument[] = [
  {
    id: "doc-1",
    type: KYCDocumentType.PASSPORT,
    status: KYCDocumentStatus.APPROVED,
    uploadedAt: "2023-01-18T10:30:00Z",
    reviewedAt: "2023-01-20T14:15:00Z",
    fileUrl: "/documents/passport.jpg",
  },
  {
    id: "doc-2",
    type: KYCDocumentType.PROOF_OF_ADDRESS,
    status: KYCDocumentStatus.APPROVED,
    uploadedAt: "2023-01-18T10:35:00Z",
    reviewedAt: "2023-01-20T14:20:00Z",
    fileUrl: "/documents/address_proof.pdf",
  },
  {
    id: "doc-3",
    type: KYCDocumentType.SELFIE,
    status: KYCDocumentStatus.APPROVED,
    uploadedAt: "2023-01-18T10:40:00Z",
    reviewedAt: "2023-01-20T14:25:00Z",
    fileUrl: "/documents/selfie.jpg",
  },
]

export const mockUserActivity = [
  {
    type: "login",
    description: "Logged in from New York, USA",
    timestamp: "2024-04-15T09:30:00Z",
    metadata: {
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      location: "New York, USA",
    },
  },
  {
    type: "order_created",
    description: "Created buy order for 1000 SKY",
    timestamp: "2024-04-14T15:45:00Z",
    metadata: {
      orderId: "order-1",
      assetId: "1",
      type: "limit",
      side: "buy",
      quantity: 1000,
      price: 1.03,
    },
  },
  {
    type: "trade_executed",
    description: "Bought 1000 SKY at $1.03",
    timestamp: "2024-04-14T15:50:00Z",
    metadata: {
      tradeId: "trade-1",
      orderId: "order-1",
      assetId: "1",
      quantity: 1000,
      price: 1.03,
    },
  },
  {
    type: "order_created",
    description: "Created sell order for 500 DGART",
    timestamp: "2024-04-13T10:15:00Z",
    metadata: {
      orderId: "order-2",
      assetId: "2",
      type: "market",
      side: "sell",
      quantity: 500,
    },
  },
  {
    type: "trade_executed",
    description: "Sold 500 DGART at $0.96",
    timestamp: "2024-04-13T10:15:05Z",
    metadata: {
      tradeId: "trade-2",
      orderId: "order-2",
      assetId: "2",
      quantity: 500,
      price: 0.96,
    },
  },
  {
    type: "wallet_added",
    description: "Added new wallet",
    timestamp: "2024-04-12T14:20:00Z",
    metadata: {
      walletId: "wallet-3",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      type: "bitcoin",
    },
  },
  {
    type: "profile_updated",
    description: "Updated profile information",
    timestamp: "2024-04-11T11:30:00Z",
    metadata: {
      fields: ["username", "timezone"],
    },
  },
]

export const mockNotifications = [
  {
    id: "notif-1",
    type: "trade_executed",
    message: "Your order to buy 1000 SKY has been filled at $1.03",
    read: false,
    createdAt: "2024-04-14T15:50:00Z",
    data: {
      tradeId: "trade-1",
      orderId: "order-1",
      assetId: "1",
    },
  },
  {
    id: "notif-2",
    type: "trade_executed",
    message: "Your order to sell 500 DGART has been filled at $0.96",
    read: true,
    createdAt: "2024-04-13T10:15:05Z",
    data: {
      tradeId: "trade-2",
      orderId: "order-2",
      assetId: "2",
    },
  },
  {
    id: "notif-3",
    type: "price_alert",
    message: "SKY price has increased by 3% in the last 24 hours",
    read: false,
    createdAt: "2024-04-15T08:30:00Z",
    data: {
      assetId: "1",
      priceChange: 3.2,
    },
  },
  {
    id: "notif-4",
    type: "security_alert",
    message: "New login detected from New York, USA",
    read: true,
    createdAt: "2024-04-15T09:30:00Z",
    data: {
      ip: "192.168.1.1",
      location: "New York, USA",
    },
  },
  {
    id: "notif-5",
    type: "system",
    message: "Platform maintenance scheduled for April 20, 2024",
    read: false,
    createdAt: "2024-04-14T12:00:00Z",
    data: {
      maintenanceDate: "2024-04-20T02:00:00Z",
      duration: "2 hours",
    },
  },
]
