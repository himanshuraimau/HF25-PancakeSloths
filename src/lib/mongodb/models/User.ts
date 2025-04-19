import mongoose from 'mongoose';

const notificationPreferencesSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  marketingEmails: { type: Boolean, default: true },
  securityAlerts: { type: Boolean, default: true },
  transactionUpdates: { type: Boolean, default: true },
  priceAlerts: { type: Boolean, default: true },
});

const userPreferencesSchema = new mongoose.Schema({
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  notifications: { type: notificationPreferencesSchema, default: () => ({}) },
  language: { type: String, default: 'en' },
  currency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'UTC' },
});

const walletSchema = new mongoose.Schema({
  address: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ethereum', 'bitcoin', 'solana', 'polygon', 'binance'],
    required: true 
  },
  label: String,
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const kycDocumentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['passport', 'drivers_license', 'id_card', 'proof_of_address', 'selfie'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  uploadedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  rejectionReason: String,
  fileUrl: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  avatar: String,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  hasTwoFactorAuth: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  preferences: {
    type: userPreferencesSchema,
    default: () => ({}),
  },
  wallets: [walletSchema],
  kycStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'pending_review', 'approved', 'rejected'],
    default: 'not_started',
  },
  kycDocuments: [kycDocumentSchema],
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
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 