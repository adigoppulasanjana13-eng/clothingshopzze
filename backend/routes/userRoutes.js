const express = require('express');
const {
  getUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(admin); // All user profile management routes are admin-only

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .delete(deleteUser);

module.exports = router;
