import mongoose from 'mongoose';

const assetPriceHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  price: { type: Number, required: true },
  volume: Number,
});

const assetMetadataSchema = new mongoose.Schema({
  website: String,
  whitepaper: String,
  github: String,
  twitter: String,
  reddit: String,
  discord: String,
  telegram: String,
  explorer: String,
  launchDate: Date,
  algorithm: String,
  proofType: String,
  consensusMechanism: String,
});

const assetStatsSchema = new mongoose.Schema({
  allTimeHigh: {
    price: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  allTimeLow: {
    price: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  roi: {
    "1d": { type: Number, default: 0 },
    "7d": { type: Number, default: 0 },
    "30d": { type: Number, default: 0 },
    "90d": { type: Number, default: 0 },
    "1y": { type: Number, default: 0 },
    ytd: { type: Number, default: 0 },
  },
  volatility: { type: Number, default: 0 },
  liquidityScore: { type: Number, default: 0 },
  developerScore: Number,
  communityScore: Number,
});

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ['cryptocurrency', 'token', 'nft', 'security_token', 'real_estate', 'commodity'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: String,
  currentPrice: {
    type: Number,
    required: true,
  },
  priceChangePercentage24h: {
    type: Number,
    default: 0,
  },
  marketCap: {
    type: Number,
    required: true,
  },
  volume24h: {
    type: Number,
    default: 0,
  },
  circulatingSupply: {
    type: Number,
    required: true,
  },
  totalSupply: {
    type: Number,
    required: true,
  },
  maxSupply: Number,
  isVerified: {
    type: Boolean,
    default: false,
  },
  chainId: {
    type: String,
    required: true,
  },
  contractAddress: String,
  decimals: {
    type: Number,
    required: true,
  },
  tags: [String],
  metadata: {
    type: assetMetadataSchema,
    default: () => ({}),
  },
  stats: {
    type: assetStatsSchema,
    default: () => ({}),
  },
  priceHistory: {
    "1h": [assetPriceHistorySchema],
    "1d": [assetPriceHistorySchema],
    "1w": [assetPriceHistorySchema],
    "1m": [assetPriceHistorySchema],
    "1y": [assetPriceHistorySchema],
    "all": [assetPriceHistorySchema],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
assetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for common queries
assetSchema.index({ symbol: 1 });
assetSchema.index({ type: 1 });
assetSchema.index({ chainId: 1 });
assetSchema.index({ contractAddress: 1 }, { sparse: true });

const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

export default Asset; 