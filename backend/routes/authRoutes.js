const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logoutUser);

module.exports = router;
