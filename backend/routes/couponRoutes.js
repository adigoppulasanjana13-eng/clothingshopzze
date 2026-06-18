const express = require('express');
const {
  validateCoupon,
  createCoupon,
  getCoupons
} = require('../controllers/couponController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.route('/validate')
  .post(protect, validateCoupon);

module.exports = router;
