// client/src/components/Sidebar.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { PlusIcon, LogoutIcon, XIcon } from '@heroicons/react/solid';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/conversations/list');
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    localStorage.removeItem('currentConversationId');
    window.location.reload();
  };

  const selectConversation = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/conversations/${id}`);
      localStorage.setItem('currentConversationId', id);
      window.location.reload();
    } catch (err) {
      console.error('Error selecting conversation:', err);
    }
  };

  return (
    <div
      className={`fixed md:relative z-20 h-full w-72 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col bg-gray-800 text-white`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Chat</h1>
        <button
          onClick={toggleSidebar}
          className="md:hidden rounded-md hover:bg-gray-700 p-2"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={startNewConversation}
        className="mx-3 mb-4 flex items-center justify-center gap-2 border border-gray-600 rounded-md py-2 px-4 hover:bg-gray-700"
      >
        <PlusIcon className="h-5 w-5" />
        <span>New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
            Recent Conversations
          </h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
            </div>
          ) : (
            <ul className="space-y-1">
              {conversations.map((convo) => (
                <li key={convo._id}>
                  <button
                    onClick={() => selectConversation(convo._id)}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 ${
                      localStorage.getItem('currentConversationId') === convo._id
                        ? 'bg-gray-700'
                        : ''
                    }`}
                  >
                    <div className="truncate">{convo.title || 'Untitled Chat'}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(convo.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                </li>
              ))}
              {conversations.length === 0 && (
                <li className="text-gray-400 text-sm py-2">No conversations yet</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {currentUser && (
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="truncate">
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs text-gray-400">{currentUser.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-md hover:bg-gray-700"
              title="Logout"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;