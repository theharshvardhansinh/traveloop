const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: sign JWT ─────────────────────────────────────────────────────────
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ─── Helper: send token response ──────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
      languagePref: user.languagePref,
    },
  });
};

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
/**
 * Register a new regular user (role: "user")
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email already exists.',
      });
    }

    // Create user (password hashed by pre-save hook)
    const user = await User.create({ name, email, password, role: 'user' });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/admin/signup ──────────────────────────────────────────────
/**
 * Register a new admin user.
 * Requires `adminSecret` in request body matching ADMIN_SECRET env var.
 */
const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Validate admin secret
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or missing admin secret. Access denied.',
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email already exists.',
      });
    }

    // Create admin user (password hashed by pre-save hook)
    const user = await User.create({ name, email, password, role: 'admin' });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * Unified login — works for both user and admin.
 * Returns JWT with role embedded so frontend can redirect appropriately.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Explicitly select password (it has select:false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/admin/login ───────────────────────────────────────────────
/**
 * Admin-specific login endpoint.
 * Same as login but enforces role === "admin" before issuing token.
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This endpoint is for admins only.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
/**
 * Returns the currently authenticated user's profile.
 * Requires protect middleware.
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is already populated by protect middleware
    const user = await User.findById(req.user._id).populate('savedDestinations', 'name country imageUrl');

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
        languagePref: user.languagePref,
        savedDestinations: user.savedDestinations,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, adminSignup, login, adminLogin, getMe };
