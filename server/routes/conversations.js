// server/routes/conversations.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get user's conversations (list view with limited info)
router.get('/list', conversationController.getConversationsList);

// Get one conversation with all messages
router.get('/:id', conversationController.getConversation);

// Get current active conversation
router.get('/', conversationController.getCurrentConversation);

// Create a new conversation
router.post('/', conversationController.createConversation);

// Delete a conversation
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;