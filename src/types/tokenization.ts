/**
 * Tokenization process and token related types
 */

export interface TokenizationProject {
  id: string
  name: string
  description: string
  assetType: TokenizedAssetType
  status: TokenizationStatus
  owner: string // User ID
  createdAt: string
  updatedAt: string
  targetRaise: number
  minimumInvestment: number
  tokenPrice: number
  totalTokens: number
  soldTokens: number
  startDate?: string
  endDate?: string
  documents: TokenizationDocument[]
  legalStructure: string
  jurisdiction: string
  riskLevel: RiskLevel
  expectedReturn?: number
  fees: TokenizationFees
  tags: string[]
  images: string[]
}

export enum TokenizedAssetType {
  REAL_ESTATE = "real_estate",
  EQUITY = "equity",
  DEBT = "debt",
  COMMODITY = "commodity",
  ART = "art",
  INTELLECTUAL_PROPERTY = "intellectual_property",
  INFRASTRUCTURE = "infrastructure",
  OTHER = "other",
}

export enum TokenizationStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  ACTIVE = "active",
  FUNDED = "funded",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

export interface TokenizationDocument {
  id: string
  name: string
  description?: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
  uploadedBy: string // User ID
  documentType: TokenizationDocumentType
  isVerified: boolean
  verifiedAt?: string
  verifiedBy?: string // User ID
}

export enum TokenizationDocumentType {
  LEGAL = "legal",
  FINANCIAL = "financial",
  TECHNICAL = "technical",
  MARKETING = "marketing",
  REGULATORY = "regulatory",
  OTHER = "other",
}

export interface TokenizationFees {
  platformFee: number
  managementFee: number
  performanceFee: number
  entryFee: number
  exitFee: number
  otherFees: {
    name: string
    amount: number
    description?: string
  }[]
}

export interface TokenizationStep {
  id: string
  name: string
  description: string
  status: TokenizationStepStatus
  order: number
  requiredDocuments: TokenizationDocumentType[]
  completedAt?: string
}

export enum TokenizationStepStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface TokenDistribution {
  projectId: string
  publicSale: number // Percentage
  privateSale: number // Percentage
  team: number // Percentage
  advisors: number // Percentage
  marketing: number // Percentage
  reserve: number // Percentage
  ecosystem: number // Percentage
  other: {
    name: string
    percentage: number
  }[]
}

export interface TokenVesting {
  id: string
  projectId: string
  beneficiary: string // User ID or wallet address
  amount: number
  startDate: string
  endDate: string
  cliff: number // In days
  schedule: VestingSchedule
  releasedAmount: number
  nextReleaseDate?: string
  createdAt: string
}

export enum VestingSchedule {
  LINEAR = "linear",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  CUSTOM = "custom",
}

export interface TokenizationApplication {
  id: string
  projectId: string
  userId: string
  status: TokenizationApplicationStatus
  amount: number
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string // User ID
  rejectionReason?: string
  kycVerified: boolean
  accreditedInvestor: boolean
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  transactionHash?: string
}

export enum TokenizationApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CRYPTO = "crypto",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
  WIRE_TRANSFER = "wire_transfer",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}
