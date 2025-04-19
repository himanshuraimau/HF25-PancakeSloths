import mongoose from 'mongoose';

const tradingPositionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  assetId: {
    type: String,
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  averageEntryPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  unrealizedPnl: {
    type: Number,
    required: true,
  },
  unrealizedPnlPercentage: {
    type: Number,
    required: true,
  },
  realizedPnl: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'liquidated'],
    default: 'open',
  },
  leverage: Number,
  liquidationPrice: Number,
  margin: Number,
  marginType: {
    type: String,
    enum: ['isolated', 'cross'],
  },
  openedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
tradingPositionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for common queries
tradingPositionSchema.index({ userId: 1, status: 1 });
tradingPositionSchema.index({ assetId: 1, status: 1 });
tradingPositionSchema.index({ openedAt: -1 });

const TradingPosition = mongoose.models.TradingPosition || mongoose.model('TradingPosition', tradingPositionSchema);

export default TradingPosition; 