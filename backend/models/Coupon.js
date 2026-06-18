const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true }, // percentage amount (e.g. 10 for 10%) or flat amount (e.g. 200 for ₹200)
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  expiry: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
