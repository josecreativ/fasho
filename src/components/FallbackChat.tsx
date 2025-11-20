import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const FallbackChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! Welcome to Allure Fashion. How can I help you today?",
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Auto-reply after a short delay
      setTimeout(() => {
        const autoReply: Message = {
          id: Date.now() + 1,
          text: "Thank you for your message! Our support team will get back to you shortly. For immediate assistance, please call +234 123 456 7890 or email support@allurefashion.com",
          sender: 'support',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border">
        {/* Header */}
        <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Allure Fashion Support</h3>
            <p className="text-xs opacity-75">We're here to help!</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackChat;