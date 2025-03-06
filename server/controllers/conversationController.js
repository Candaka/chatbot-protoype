// server/controllers/conversationController.js
const Conversation = require('../models/Conversation');

// Get user's conversations (list view with limited info)
exports.getConversationsList = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .select('_id title updatedAt')
      .sort({ updatedAt: -1 });
    
    res.status(200).json(conversations);
  } catch (err) {
    console.error('Error fetching conversations list:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get one conversation with all messages
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.status(200).json(conversation);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current active conversation
exports.getCurrentConversation = async (req, res) => {
  try {
    const conversationId = req.query.id;
    
    if (!conversationId) {
      return res.status(200).json({ messages: [] });
    }
    
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user.id,
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.status(200).json(conversation.messages);
  } catch (err) {
    console.error('Error fetching current conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const newConversation = new Conversation({
      user: req.user.id,
    });
    
    await newConversation.save();
    
    res.status(201).json({
      message: 'Conversation created',
      conversationId: newConversation._id,
    });
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const result = await Conversation.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.status(200).json({ message: 'Conversation deleted' });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};