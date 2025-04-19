import mongoose from 'mongoose';

const orderBookEntrySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  orders: {
    type: Number,
    required: true,
  },
});

const orderBookSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  bids: [orderBookEntrySchema],
  asks: [orderBookEntrySchema],
});

const candleSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  open: {
    type: Number,
    required: true,
  },
  high: {
    type: Number,
    required: true,
  },
  low: {
    type: Number,
    required: true,
  },
  close: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
});

const marketPairSchema = new mongoose.Schema({
  baseAssetId: {
    type: String,
    required: true,
  },
  quoteAssetId: {
    type: String,
    required: true,
  },
  lastPrice: {
    type: Number,
    required: true,
  },
  priceChangePercent24h: {
    type: Number,
    default: 0,
  },
  highPrice24h: {
    type: Number,
    required: true,
  },
  lowPrice24h: {
    type: Number,
    required: true,
  },
  volume24h: {
    type: Number,
    default: 0,
  },
  quoteVolume24h: {
    type: Number,
    default: 0,
  },
  openPrice24h: {
    type: Number,
    required: true,
  },
  closePrice24h: {
    type: Number,
    required: true,
  },
  bidPrice: {
    type: Number,
    required: true,
  },
  askPrice: {
    type: Number,
    required: true,
  },
  bidQuantity: {
    type: Number,
    required: true,
  },
  askQuantity: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  orderBook: {
    type: orderBookSchema,
    default: () => ({}),
  },
  candles: {
    "1m": [candleSchema],
    "5m": [candleSchema],
    "15m": [candleSchema],
    "30m": [candleSchema],
    "1h": [candleSchema],
    "4h": [candleSchema],
    "1d": [candleSchema],
    "1w": [candleSchema],
    "1M": [candleSchema],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
marketPairSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for common queries
marketPairSchema.index({ baseAssetId: 1, quoteAssetId: 1 }, { unique: true });
marketPairSchema.index({ isActive: 1 });

const MarketPair = mongoose.models.MarketPair || mongoose.model('MarketPair', marketPairSchema);

export default MarketPair; 