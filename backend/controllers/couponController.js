const Coupon = require('../models/Coupon');

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      res.status(400);
      throw new Error('Coupon code is required');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
      res.status(400);
      throw new Error('Coupon is inactive');
    }

    if (new Date() > coupon.expiry) {
      res.status(400);
      throw new Error('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      res.status(400);
      throw new Error('Coupon limit reached');
    }

    if (orderAmount < coupon.minOrder) {
      res.status(400);
      throw new Error(`Minimum order of ₹${coupon.minOrder} is required for this coupon`);
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type,
        minOrder: coupon.minOrder
      },
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, type, minOrder, maxUses, expiry, isActive } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount: Number(discount),
      type,
      minOrder: Number(minOrder || 0),
      maxUses: Number(maxUses || 1000),
      expiry: new Date(expiry),
      isActive: isActive !== undefined ? isActive : true
    });

    const createdCoupon = await coupon.save();
    res.status(201).json({
      success: true,
      data: createdCoupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ expiry: 1 });
    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  createCoupon,
  getCoupons
};
