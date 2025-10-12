import React, { useState, useEffect, useRef } from 'react';
import '../../styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const messagesEndRef = useRef(null);
  const chatWidgetRef = useRef(null);
  const chatLauncherRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendToDialogflow = async (text, isEvent = false) => {
    try {
      const response = await fetch('/api/dialogflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId, isEvent: isEvent }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Dialogflow Error:', error);
      return 'Sorry, I am having trouble connecting. Please try again later.';
    }
  };

  const startConversation = async () => {
    setIsChatStarted(true);
    try {
      const response = await sendToDialogflow('WELCOME', true);
      if (response) {
        setMessages([{ text: response, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Start conversation error:', error);
      setMessages([{ text: 'Welcome! How can I help you today?', sender: 'bot' }]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isTyping) return;
    
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await sendToDialogflow(userMessage, false);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
      }, 800);
    } catch (error) {
      console.error('Send message error:', error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' }]);
    }
  };

  const resetChat = () => {
    setIsChatStarted(false);
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <>
      <div className="chat-launcher" onClick={toggleChat} ref={chatLauncherRef}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      <div className={`chat-widget ${isOpen ? 'active' : ''}`} ref={chatWidgetRef}>
        <div className="chat-header">
          <div className="header-content">
            <h3 className="header-title">HelpBot</h3>
            {isChatStarted && (
              <button className="icon-btn" onClick={resetChat} title="Start new conversation">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </button>
            )}
          </div>
          <button className="icon-btn close-btn" onClick={toggleChat} title="Close chat">&times;</button>
        </div>

        <div className="chat-body">
          {!isChatStarted ? (
            <div className="welcome-screen">
              <div className="robot-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8V8H12Z" />
                  <path d="M16 8V4H20V8H16Z" />
                  <path d="M12 12V10H16V12H12Z" />
                  <path d="M18 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h2>Welcome to HelpBot</h2>
              <p>How can we assist you today?</p>
              <button className="start-convo-btn" onClick={startConversation}>Start a convo</button>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}-message`}>
                  <div className="message-bubble">{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="message bot-message">
                  <div className="message-bubble typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {isChatStarted && (
          <div className="chat-footer">
            <form onSubmit={handleSendMessage}>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Type your message..." 
                autoComplete="off" 
                disabled={isTyping} 
              />
              <button type="submit" className="send-btn" disabled={isTyping}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;