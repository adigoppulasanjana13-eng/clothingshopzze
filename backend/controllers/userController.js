const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    // Find all users with role 'user'
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    
    // Enrich users with order counts and total spends
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id, orderStatus: { $ne: 'Cancelled' } });
        const ordersCount = orders.length;
        const totalSpend = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          ageGroup: user.ageGroup,
          gender: user.gender,
          ordersCount,
          totalSpend,
          createdAt: user.createdAt,
          addresses: user.addresses
        };
      })
    );

    res.json({
      success: true,
      data: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      const orders = await Order.find({ user: user._id });
      res.json({
        success: true,
        data: {
          user,
          orders
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin users');
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUser
};
