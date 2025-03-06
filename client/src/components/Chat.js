// client/src/components/Chat.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { PaperAirplaneIcon, MoonIcon, SunIcon, MenuIcon } from '@heroicons/react/solid';
import MessageItem from './MessageItem';

const Chat = ({ sidebarOpen, toggleSidebar }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Load conversation history from the database when the component mounts
    const fetchConversation = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/conversations');
        setConversation(res.data);
      } catch (err) {
        console.error('Error fetching conversation history:', err);
      }
    };

    if (currentUser) {
      fetchConversation();
    }
  }, [currentUser]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to the conversation
    const userMessage = { role: 'user', content: message.trim() };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      // Send the message to the backend API
      const response = await axios.post('http://localhost:5000/api/completions', {
        message: message.trim(),
        conversationId: localStorage.getItem('currentConversationId') || null,
      });

      // Add the AI response to the conversation
      const aiMessage = { role: 'assistant', content: response.data.message };
      setConversation(prev => [...prev, aiMessage]);

      // Save the conversation ID if it's a new conversation
      if (response.data.conversationId) {
        localStorage.setItem('currentConversationId', response.data.conversationId);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Add an error message to the conversation
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-dark-dark shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-light">
            <MenuIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">AI Chat</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-500" />
          )}
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-6 max-w-md">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                This is a ChatGPT-like interface. Start by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <MessageItem key={index} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:bg-dark-light dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            className="p-3 bg-primary hover:bg-primary-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || loading}
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;