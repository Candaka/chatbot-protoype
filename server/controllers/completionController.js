// server/controllers/completionController.js
const axios = require('axios');
const Conversation = require('../models/Conversation');

// Get a completion from the AI
exports.getCompletion = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user.id,
      });
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      // Create a new conversation
      conversation = new Conversation({
        user: req.user.id,
      });
    }
    
    // Add user message to conversation
    await conversation.addMessage('user', message);
    
    // Prepare messages for AI
    const messagesForAI = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // Call AI API for completion (placeholder - OpenAI for now)
    let aiResponse;
    
    try {
      // Use OpenAI API as placeholder
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: messagesForAI,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      aiResponse = response.data.choices[0].message.content;
    } catch (apiError) {
      console.error('AI API error:', apiError.response?.data || apiError.message);
      
      // Fallback to mock response if API fails
      aiResponse = mockAIResponse(message);
    }
    
    // Add AI response to conversation
    await conversation.addMessage('assistant', aiResponse);
    
    // Return the AI response and conversation ID
    res.status(200).json({
      message: aiResponse,
      conversationId: conversation._id,
    });
  } catch (err) {
    console.error('Completion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mock AI response function for fallback or testing
function mockAIResponse(userMessage) {
  // Simple mock responses based on keywords
  if (userMessage.toLowerCase().includes('hello') || 
      userMessage.toLowerCase().includes('hi')) {
    return "Hello! How can I help you today?";
  } else if (userMessage.toLowerCase().includes('help')) {
    return "I'm here to help! What do you need assistance with?";
  } else if (userMessage.toLowerCase().includes('bye')) {
    return "Goodbye! Feel free to come back if you have more questions.";
  } else if (userMessage.toLowerCase().includes('?')) {
    return "That's an interesting question. As a simple mock AI, I don't have a comprehensive answer, but I'd be happy to discuss this topic more when connected to a real language model.";
  } else {
    return "I understand you're saying something about '" + 
      userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '') + 
      "'. When connected to a real language model, I'll be able to provide a more meaningful response.";
  }
}