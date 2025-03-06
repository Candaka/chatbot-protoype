// server/models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'New Conversation',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Method to add a message to the conversation
ConversationSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content });
  
  // Update title based on first user message if not already set
  if (this.title === 'New Conversation' && role === 'user' && this.messages.length <= 2) {
    this.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
  }
  
  return this.save();
};

module.exports = mongoose.model('Conversation', ConversationSchema);