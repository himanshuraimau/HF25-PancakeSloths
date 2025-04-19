/**
 * Mock data for lending
 */

import type { LendingPool, LendingPosition, InterestRateModel, LiquidationEvent } from "@/types"

export const mockLendingPools: LendingPool[] = [
  {
    id: "pool-1",
    assetId: "1", // SKY
    name: "Skyline Tower Lending Pool",
    description: "Earn interest by lending SKY tokens or borrow against your SKY holdings",
    totalSupplied: 2450000,
    totalBorrowed: 1200000,
    utilizationRate: 48.98,
    supplyApy: 5.2,
    borrowApy: 8.5,
    reserveFactor: 10,
    liquidationThreshold: 82.5,
    liquidationPenalty: 10,
    collateralFactor: 70,
    isActive: true,
    createdAt: "2023-06-15T12:00:00Z",
    updatedAt: "2024-04-15T08:30:00Z",
    minSupplyAmount: 100,
    minBorrowAmount: 500,
    protocol: LendingProtocol.CUSTOM,
  },
  {
    id: "pool-2",
    assetId: "2", // DGART
    name: "Digital Art Lending Pool",
    description: "Earn interest by lending DGART tokens or borrow against your DGART holdings",
    totalSupplied: 875000,
    totalBorrowed: 450000,
    utilizationRate: 51.43,
    supplyApy: 3.8,
    borrowApy: 6.2,
    reserveFactor: 15,
    liquidationThreshold: 75,
    liquidationPenalty: 12,
    collateralFactor: 50,
    isActive: true,
    createdAt: "2023-07-10T15:30:00Z",
    updatedAt: "2024-04-14T14:45:00Z",
    minSupplyAmount: 50,
    minBorrowAmount: 250,
    protocol: LendingProtocol.CUSTOM,
  },
  {
    id: "pool-3",
    assetId: "3", // CARB
    name: "Carbon Credits Lending Pool",
    description: "Earn interest by lending CARB tokens or borrow against your CARB holdings",
    totalSupplied: 1100000,
    totalBorrowed: 650000,
    utilizationRate: 59.09,
    supplyApy: 6.5,
    borrowApy: 9.8,
    reserveFactor: 10,
    liquidationThreshold: 80,
    liquidationPenalty: 10,
    collateralFactor: 60,
    isActive: true,
    createdAt: "2023-08-05T09:15:00Z",
    updatedAt: "2024-04-15T10:20:00Z",
    minSupplyAmount: 100,
    minBorrowAmount: 500,
    protocol: LendingProtocol.CUSTOM,
  },
  {
    id: "pool-4",
    assetId: "4", // TPAT
    name: "Tech Patent Lending Pool",
    description: "Earn interest by lending TPAT tokens or borrow against your TPAT holdings",
    totalSupplied: 1800000,
    totalBorrowed: 950000,
    utilizationRate: 52.78,
    supplyApy: 4.2,
    borrowApy: 7.5,
    reserveFactor: 12,
    liquidationThreshold: 78,
    liquidationPenalty: 11,
    collateralFactor: 65,
    isActive: true,
    createdAt: "2023-09-12T11:45:00Z",
    updatedAt: "2024-04-14T16:30:00Z",
    minSupplyAmount: 100,
    minBorrowAmount: 500,
    protocol: LendingProtocol.CUSTOM,
  },
]

export const mockLendingPositions: LendingPosition[] = [
  {
    id: "position-1",
    userId: "user-123",
    poolId: "pool-1", // SKY
    type: LendingPositionType.SUPPLY,
    amount: 5000,
    interestEarned: 65.75,
    apy: 5.2,
    startDate: "2024-03-15T14:30:00Z",
    status: LendingPositionStatus.ACTIVE,
  },
  {
    id: "position-2",
    userId: "user-123",
    poolId: "pool-4", // TPAT
    type: LendingPositionType.BORROW,
    amount: 2500,
    interestPaid: 31.25,
    apy: 7.5,
    startDate: "2024-03-28T10:15:00Z",
    status: LendingPositionStatus.ACTIVE,
    healthFactor: 1.6,
    collateralAmount: 4000,
    collateralAssetId: "1", // SKY
  },
]

export const mockInterestRateModels: Record<string, InterestRateModel> = {
  "pool-1": {
    id: "model-1",
    poolId: "pool-1",
    name: "SKY Interest Rate Model",
    description: "Dynamic interest rate model for SKY lending pool",
    baseRate: 2.0,
    multiplier: 0.1,
    jumpMultiplier: 0.4,
    kink: 80,
    updateFrequency: "hourly",
    lastUpdated: "2024-04-15T08:30:00Z",
  },
  "pool-2": {
    id: "model-2",
    poolId: "pool-2",
    name: "DGART Interest Rate Model",
    description: "Dynamic interest rate model for DGART lending pool",
    baseRate: 1.5,
    multiplier: 0.12,
    jumpMultiplier: 0.5,
    kink: 75,
    updateFrequency: "hourly",
    lastUpdated: "2024-04-14T14:45:00Z",
  },
  "pool-3": {
    id: "model-3",
    poolId: "pool-3",
    name: "CARB Interest Rate Model",
    description: "Dynamic interest rate model for CARB lending pool",
    baseRate: 3.0,
    multiplier: 0.08,
    jumpMultiplier: 0.3,
    kink: 85,
    updateFrequency: "hourly",
    lastUpdated: "2024-04-15T10:20:00Z",
  },
  "pool-4": {
    id: "model-4",
    poolId: "pool-4",
    name: "TPAT Interest Rate Model",
    description: "Dynamic interest rate model for TPAT lending pool",
    baseRate: 2.5,
    multiplier: 0.09,
    jumpMultiplier: 0.35,
    kink: 80,
    updateFrequency: "hourly",
    lastUpdated: "2024-04-14T16:30:00Z",
  },
}

export const mockInterestRateHistory = (poolId: string, days = 30) => {
  const history = []
  const now = new Date()
  const pool = mockLendingPools.find((p) => p.id === poolId)

  if (!pool) return []

  // Base rates
  const baseSupplyApy = pool.supplyApy
  const baseBorrowApy = pool.borrowApy
  const baseUtilization = pool.utilizationRate

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Random fluctuation
    const supplyFluctuation = (Math.random() - 0.5) * 0.5 // ±0.25%
    const borrowFluctuation = (Math.random() - 0.5) * 0.8 // ±0.4%
    const utilizationFluctuation = (Math.random() - 0.5) * 4 // ±2%

    // Calculate rates with fluctuation
    const supplyApy = Math.max(0.1, baseSupplyApy + supplyFluctuation)
    const borrowApy = Math.max(supplyApy + 1, baseBorrowApy + borrowFluctuation)
    const utilizationRate = Math.min(95, Math.max(5, baseUtilization + utilizationFluctuation))

    history.push({
      poolId,
      timestamp: date.toISOString(),
      supplyApy,
      borrowApy,
      utilizationRate,
    })
  }

  return history
}

export const mockLiquidationEvents: LiquidationEvent[] = [
  {
    id: "liquidation-1",
    positionId: "position-xyz",
    userId: "user-456",
    liquidatorId: "user-789",
    amount: 1500,
    collateralAmount: 2000,
    timestamp: "2024-03-10T08:45:00Z",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    reason: "Health factor below minimum threshold",
    healthFactorBefore: 0.95,
    healthFactorAfter: 1.2,
  },
  {
    id: "liquidation-2",
    positionId: "position-abc",
    userId: "user-567",
    liquidatorId: "user-789",
    amount: 3000,
    collateralAmount: 4200,
    timestamp: "2024-02-25T14:20:00Z",
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    reason: "Health factor below minimum threshold",
    healthFactorBefore: 0.92,
    healthFactorAfter: 1.3,
  },
]
