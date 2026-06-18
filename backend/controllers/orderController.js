const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      subtotal,
      discount,
      deliveryCharge,
      totalAmount
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // 1. Verify stock availability and build validated order items from database details
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.productName || 'item'} not found`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}`);
      }

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity: item.quantity,
        size: item.size,
        price: product.price
      });
    }

    // 2. Adjust coupon usages if code was applied
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        coupon.usedCount += 1;
        if (coupon.usedCount >= coupon.maxUses) {
          coupon.isActive = false;
        }
        await coupon.save();
      }
    }

    // 3. Deduct stock from products
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // 4. Create the order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid', // Pre-assume card/UPI is pre-paid in full-stack simulation
      orderStatus: 'Placed',
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      deliveryCharge: Number(deliveryCharge || 0),
      totalAmount: Number(totalAmount),
      couponCode
    });

    const createdOrder = await order.save();

    // 5. Clear user cart in database
    const Cart = require('../models/Cart');
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus || order.orderStatus;
      
      // If delivery is marked "Delivered" and payment is COD, automatically mark as "Paid"
      if (orderStatus === 'Delivered') {
        order.paymentStatus = 'Paid';
      } else if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      // If order is cancelled, return items back to stock
      if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
          });
        }
      }

      const updatedOrder = await order.save();
      res.json({
        success: true,
        data: updatedOrder
      });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus
};
