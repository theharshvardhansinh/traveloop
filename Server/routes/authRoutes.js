const express = require('express');
const router = express.Router();
const {
  signup,
  adminSignup,
  login,
  adminLogin,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ─── Public routes ────────────────────────────────────────────────────────────
router.post('/signup', signup);
router.post('/admin/signup', adminSignup);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// ─── Protected routes ─────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

module.exports = router;
