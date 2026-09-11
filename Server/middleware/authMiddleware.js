const jwt     = require('jsonwebtoken');
const { db }  = require('../config/db');
const { users } = require('../db/schema');
const { eq }  = require('drizzle-orm');

/**
 * protect — Verifies Bearer JWT and attaches decoded user to req.user.
 * Usage: router.get('/me', protect, getMe)
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in to access this resource.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password) to request
    const [currentUser] = await db
      .select({
        id:           users.id,
        name:         users.name,
        email:        users.email,
        role:         users.role,
        photoUrl:     users.photoUrl,
        languagePref: users.languagePref,
        createdAt:    users.createdAt,
      })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Token expired. Please log in again.' });
    }
    next(error);
  }
};

/**
 * isAdmin — Must be used AFTER protect middleware.
 * Allows access only if req.user.role === "admin".
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admins only.',
  });
};

module.exports = { protect, isAdmin };
