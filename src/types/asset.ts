/**
 * Asset related types for the platform
 */

export interface Asset {
  id: string
  name: string
  symbol: string
  type: AssetType
  description: string
  imageUrl: string
  currentPrice: number
  priceChangePercentage24h: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  totalSupply: number
  maxSupply?: number
  isVerified: boolean
  createdAt: string
  updatedAt: string
  chainId: string
  contractAddress?: string
  decimals: number
  tags: string[]
}

export enum AssetType {
  CRYPTOCURRENCY = "cryptocurrency",
  TOKEN = "token",
  NFT = "nft",
  SECURITY_TOKEN = "security_token",
  REAL_ESTATE = "real_estate",
  COMMODITY = "commodity",
}

export interface AssetPrice {
  assetId: string
  price: number
  timestamp: string
  volume: number
  marketCap: number
  source: string
}

export interface AssetPriceHistory {
  assetId: string
  interval: PriceInterval
  prices: {
    timestamp: string
    price: number
    volume?: number
  }[]
}

export enum PriceInterval {
  HOUR = "1h",
  DAY = "1d",
  WEEK = "1w",
  MONTH = "1m",
  YEAR = "1y",
  ALL = "all",
}

export interface AssetMetadata {
  assetId: string
  website?: string
  whitepaper?: string
  github?: string
  twitter?: string
  reddit?: string
  discord?: string
  telegram?: string
  explorer?: string
  launchDate?: string
  algorithm?: string
  proofType?: string
  consensusMechanism?: string
}

export interface AssetStats {
  assetId: string
  allTimeHigh: {
    price: number
    date: string
  }
  allTimeLow: {
    price: number
    date: string
  }
  roi: {
    "1d": number
    "7d": number
    "30d": number
    "90d": number
    "1y": number
    ytd: number
  }
  volatility: number
  liquidityScore: number
  developerScore?: number
  communityScore?: number
}
