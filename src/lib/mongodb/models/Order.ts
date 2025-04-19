import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  feeAssetId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  counterpartyOrderId: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  transactionHash: String,
});

const orderSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['market', 'limit', 'stop', 'stop_limit', 'trailing_stop'],
    required: true,
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'partially_filled', 'filled', 'cancelled', 'rejected', 'expired'],
    default: 'open',
  },
  filledQuantity: {
    type: Number,
    default: 0,
  },
  averageFilledPrice: Number,
  remainingQuantity: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  feeAssetId: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  stopPrice: Number,
  limitPrice: Number,
  timeInForce: {
    type: String,
    enum: ['gtc', 'ioc', 'fok', 'day'],
    default: 'gtc',
  },
  cancelReason: String,
  trades: [tradeSchema],
  expiresAt: Date,
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
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for common queries
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ assetId: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order; 