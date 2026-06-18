const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price mrp discount images hoverImage stock sizes category ageGroup brand'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { product, quantity, size } = req.body;

    if (!product || !quantity || !size) {
      res.status(400);
      throw new Error('Product ID, quantity, and size are required');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if the exact product ID and size combination already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product.toString() && item.size === size
    );

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Item does not exist, push to array
      cart.items.push({ product, quantity: Number(quantity), size });
    }

    await cart.save();
    
    // Populate product details for response
    await cart.populate({
      path: 'items.product',
      select: 'name price mrp discount images hoverImage stock sizes category ageGroup brand'
    });

    res.status(201).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity or size
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, size } = req.body;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const item = cart.items.id(itemId);
    if (!item) {
      res.status(404);
      throw new Error('Cart item not found');
    }

    if (quantity !== undefined) item.quantity = Number(quantity);
    if (size !== undefined) item.size = size;

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price mrp discount images hoverImage stock sizes category ageGroup brand'
    });

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const deleteCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price mrp discount images hoverImage stock sizes category ageGroup brand'
    });

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem
};
