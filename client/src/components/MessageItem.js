// client/src/components/MessageItem.js
import React from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';
import ReactMarkdown from 'react-markdown';

const MessageItem = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-primary text-white'
            : 'bg-gray-100 dark:bg-dark-light text-gray-800 dark:text-gray-200'
        }`}
      >
        <div className="flex items-start space-x-2">
          {!isUser && (
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium mb-1">
              {isUser ? 'You' : 'AI Assistant'}
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;