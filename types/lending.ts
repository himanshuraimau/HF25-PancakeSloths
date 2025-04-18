/**
 * Lending and borrowing related types
 */

export interface LendingPool {
  id: string
  assetId: string
  name: string
  description: string
  totalSupplied: number
  totalBorrowed: number
  utilizationRate: number
  supplyApy: number
  borrowApy: number
  reserveFactor: number
  liquidationThreshold: number
  liquidationPenalty: number
  collateralFactor: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  minSupplyAmount: number
  minBorrowAmount: number
  maxSupplyAmount?: number
  maxBorrowAmount?: number
  protocol: LendingProtocol
}

export enum LendingProtocol {
  AAVE = "aave",
  COMPOUND = "compound",
  MAKER = "maker",
  CUSTOM = "custom",
}

export interface LendingPosition {
  id: string
  userId: string
  poolId: string
  type: LendingPositionType
  amount: number
  interestEarned?: number
  interestPaid?: number
  apy: number
  startDate: string
  endDate?: string
  status: LendingPositionStatus
  healthFactor?: number
  collateralAmount?: number
  collateralAssetId?: string
  liquidationDate?: string
  liquidationAmount?: number
  transactionHash?: string
}

export enum LendingPositionType {
  SUPPLY = "supply",
  BORROW = "borrow",
}

export enum LendingPositionStatus {
  ACTIVE = "active",
  CLOSED = "closed",
  LIQUIDATED = "liquidated",
}

export interface InterestRateModel {
  id: string
  poolId: string
  name: string
  description: string
  baseRate: number
  multiplier: number
  jumpMultiplier?: number
  kink?: number
  updateFrequency: string
  lastUpdated: string
}

export interface InterestRateHistory {
  poolId: string
  timestamp: string
  supplyApy: number
  borrowApy: number
  utilizationRate: number
}

export interface LiquidationEvent {
  id: string
  positionId: string
  userId: string
  liquidatorId: string
  amount: number
  collateralAmount: number
  timestamp: string
  transactionHash: string
  reason: string
  healthFactorBefore: number
  healthFactorAfter: number
}

export interface LendingMarket {
  totalValueLocked: number
  totalSupplied: number
  totalBorrowed: number
  averageSupplyApy: number
  averageBorrowApy: number
  pools: LendingPool[]
  topSuppliers: {
    userId: string
    totalSupplied: number
  }[]
  topBorrowers: {
    userId: string
    totalBorrowed: number
  }[]
  recentLiquidations: LiquidationEvent[]
}
