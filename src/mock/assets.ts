/**
 * Mock data for assets
 */

import type { Asset } from "@/types"

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Skyline Tower",
    symbol: "SKY",
    type: AssetType.REAL_ESTATE,
    description: "A premium commercial real estate property in downtown New York.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 1.05,
    priceChangePercentage24h: 3.2,
    marketCap: 10500000,
    volume24h: 125430,
    circulatingSupply: 10000000,
    totalSupply: 10000000,
    maxSupply: 10000000,
    isVerified: true,
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2024-04-10T08:30:00Z",
    chainId: "ethereum-1",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    decimals: 18,
    tags: ["real-estate", "commercial", "new-york"],
  },
  {
    id: "2",
    name: "Digital Masterpiece",
    symbol: "DGART",
    type: AssetType.NFT,
    description: "A tokenized digital art masterpiece by renowned artist Digital Visionary.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 0.95,
    priceChangePercentage24h: -1.2,
    marketCap: 4750000,
    volume24h: 87250,
    circulatingSupply: 5000000,
    totalSupply: 5000000,
    maxSupply: 5000000,
    isVerified: true,
    createdAt: "2023-02-20T15:30:00Z",
    updatedAt: "2024-04-09T14:45:00Z",
    chainId: "ethereum-1",
    contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    decimals: 18,
    tags: ["art", "digital", "collectible"],
  },
  {
    id: "3",
    name: "Carbon Credits",
    symbol: "CARB",
    type: AssetType.COMMODITY,
    description: "Tokenized carbon credits representing verified carbon offset projects.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 1.12,
    priceChangePercentage24h: 5.7,
    marketCap: 5600000,
    volume24h: 56780,
    circulatingSupply: 5000000,
    totalSupply: 10000000,
    maxSupply: null,
    isVerified: true,
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2024-04-11T10:20:00Z",
    chainId: "ethereum-1",
    contractAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    decimals: 18,
    tags: ["environmental", "carbon", "sustainability"],
  },
  {
    id: "4",
    name: "Tech Patent",
    symbol: "TPAT",
    type: AssetType.SECURITY_TOKEN,
    description: "Tokenized intellectual property rights for renewable energy technology.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 1.03,
    priceChangePercentage24h: 0.8,
    marketCap: 8500000,
    volume24h: 98320,
    circulatingSupply: 8250000,
    totalSupply: 10000000,
    maxSupply: 10000000,
    isVerified: true,
    createdAt: "2023-04-05T11:45:00Z",
    updatedAt: "2024-04-10T16:30:00Z",
    chainId: "ethereum-1",
    contractAddress: "0xdef1234567890abcdef1234567890abcdef123456",
    decimals: 18,
    tags: ["intellectual-property", "technology", "renewable-energy"],
  },
  {
    id: "5",
    name: "Luxury Apartment",
    symbol: "LUXAP",
    type: AssetType.REAL_ESTATE,
    description: "A luxury apartment complex in Miami with ocean views.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 1.08,
    priceChangePercentage24h: 2.1,
    marketCap: 9500000,
    volume24h: 45670,
    circulatingSupply: 8800000,
    totalSupply: 10000000,
    maxSupply: 10000000,
    isVerified: true,
    createdAt: "2023-05-12T14:20:00Z",
    updatedAt: "2024-04-09T09:15:00Z",
    chainId: "ethereum-1",
    contractAddress: "0x567890abcdef1234567890abcdef1234567890ab",
    decimals: 18,
    tags: ["real-estate", "residential", "miami"],
  },
  {
    id: "6",
    name: "Rare Collectible",
    symbol: "RCOL",
    type: AssetType.NFT,
    description: "A rare collectible item from 1985 with historical significance.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 0.87,
    priceChangePercentage24h: 4.3,
    marketCap: 2850000,
    volume24h: 32450,
    circulatingSupply: 3275000,
    totalSupply: 5000000,
    maxSupply: 5000000,
    isVerified: true,
    createdAt: "2023-06-18T08:30:00Z",
    updatedAt: "2024-04-11T11:45:00Z",
    chainId: "ethereum-1",
    contractAddress: "0x90abcdef1234567890abcdef1234567890abcdef",
    decimals: 18,
    tags: ["collectible", "historical", "rare"],
  },
  {
    id: "7",
    name: "Water Rights",
    symbol: "WATER",
    type: AssetType.COMMODITY,
    description: "Tokenized water rights for the Colorado River basin.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 0.92,
    priceChangePercentage24h: -0.5,
    marketCap: 4200000,
    volume24h: 76890,
    circulatingSupply: 4565000,
    totalSupply: 5000000,
    maxSupply: 5000000,
    isVerified: true,
    createdAt: "2023-07-22T16:40:00Z",
    updatedAt: "2024-04-10T13:20:00Z",
    chainId: "ethereum-1",
    contractAddress: "0x34567890abcdef1234567890abcdef1234567890",
    decimals: 18,
    tags: ["environmental", "water", "resource"],
  },
  {
    id: "8",
    name: "Music Royalties",
    symbol: "MUSIC",
    type: AssetType.SECURITY_TOKEN,
    description: "Tokenized music royalties from a portfolio of popular songs.",
    imageUrl: "/placeholder.svg?height=80&width=80",
    currentPrice: 1.15,
    priceChangePercentage24h: 1.9,
    marketCap: 6350000,
    volume24h: 54320,
    circulatingSupply: 5520000,
    totalSupply: 10000000,
    maxSupply: 10000000,
    isVerified: true,
    createdAt: "2023-08-15T10:10:00Z",
    updatedAt: "2024-04-11T09:30:00Z",
    chainId: "ethereum-1",
    contractAddress: "0x67890abcdef1234567890abcdef1234567890abc",
    decimals: 18,
    tags: ["intellectual-property", "music", "royalties"],
  },
]

/**
 * Get asset price history mock data
 */
export const getMockAssetPriceHistory = (assetId: string, days = 30) => {
  const prices = []
  const now = new Date()
  const asset = mockAssets.find((a) => a.id === assetId)
  const basePrice = asset?.currentPrice || 1.0

  // Generate price data points
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Random price with trend based on asset's 24h change
    const volatility = 0.02 // 2% daily volatility
    const trend = asset ? asset.priceChangePercentage24h / 100 / days : 0
    const randomChange = (Math.random() - 0.5) * volatility
    const dayChange = randomChange + trend

    // Calculate price based on days from now and random factor
    let price = basePrice * (1 - i * trend) * (1 + randomChange)
    price = Math.max(price, basePrice * 0.5) // Ensure price doesn't go too low

    prices.push({
      timestamp: date.toISOString(),
      price: Number.parseFloat(price.toFixed(4)),
      volume: Math.floor(Math.random() * 100000) + 10000,
    })
  }

  return prices
}

/**
 * Get mock order book data
 */
export const getMockOrderBook = (assetId: string) => {
  const asset = mockAssets.find((a) => a.id === assetId)
  const basePrice = asset?.currentPrice || 1.0

  const asks = []
  const bids = []

  // Generate asks (sell orders)
  for (let i = 1; i <= 10; i++) {
    const price = basePrice * (1 + i * 0.001)
    const amount = Math.floor(Math.random() * 1000) + 500
    asks.push({
      price: Number.parseFloat(price.toFixed(4)),
      quantity: amount,
      total: Number.parseFloat((price * amount).toFixed(2)),
      orders: Math.floor(Math.random() * 5) + 1,
    })
  }

  // Generate bids (buy orders)
  for (let i = 1; i <= 10; i++) {
    const price = basePrice * (1 - i * 0.001)
    const amount = Math.floor(Math.random() * 1000) + 500
    bids.push({
      price: Number.parseFloat(price.toFixed(4)),
      quantity: amount,
      total: Number.parseFloat((price * amount).toFixed(2)),
      orders: Math.floor(Math.random() * 5) + 1,
    })
  }

  return {
    assetId,
    timestamp: new Date().toISOString(),
    asks,
    bids,
  }
}
