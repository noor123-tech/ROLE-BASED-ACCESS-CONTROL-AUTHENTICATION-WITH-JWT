const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Assuming you still need to use your db pool

const router = express.Router();

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from header

  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Add user info to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
}

// Middleware to authorize admin role
function authorizeAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();  // Proceed to the next middleware or route handler
}

// Export functions directly
module.exports = { authenticateToken, authorizeAdmin };
