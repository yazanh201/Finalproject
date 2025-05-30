const express = require('express');
const router = express.Router();

// ייבוא הפונקציות מהבקר
const { registerUser, loginUser } = require('../controllers/auth.controller');

// POST - רישום משתמש
router.post('/register', registerUser);

// POST - התחברות
router.post('/login', loginUser);

module.exports = router;
