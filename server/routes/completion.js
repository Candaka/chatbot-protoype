// server/routes/completions.js
const express = require('express');
const router = express.Router();
const completionController = require('../controllers/completionController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get a completion from the AI
router.post('/', completionController.getCompletion);

module.exports = router;