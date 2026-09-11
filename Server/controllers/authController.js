const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const { db }   = require('../config/db');
const { users } = require('../db/schema');
const { eq }   = require('drizzle-orm');

// ─── Helper: sign JWT ─────────────────────────────────────────────────────────
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ─── Helper: send token response ──────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user.id, user.role);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:           user.id,
      name:         user.name,
      email:        user.email,
      role:         user.role,
      photoUrl:     user.photoUrl,
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

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email already exists.',
      });
    }

    // Hash password (replaces Mongoose pre-save hook)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user and return the created row
    const [user] = await db
      .insert(users)
      .values({
        name:     name.trim(),
        email:    normalizedEmail,
        password: hashedPassword,
        role:     'user',
      })
      .returning();

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

    const normalizedEmail = email.toLowerCase().trim();

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with that email already exists.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(users)
      .values({
        name:     name.trim(),
        email:    normalizedEmail,
        password: hashedPassword,
        role:     'admin',
      })
      .returning();

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

    const normalizedEmail = email.toLowerCase().trim();

    // Select password explicitly (it is not auto-excluded in Drizzle)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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

    const normalizedEmail = email.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

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

    const isMatch = await bcrypt.compare(password, user.password);
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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id:           user.id,
        name:         user.name,
        email:        user.email,
        role:         user.role,
        photoUrl:     user.photoUrl,
        languagePref: user.languagePref,
        createdAt:    user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, adminSignup, login, adminLogin, getMe };
