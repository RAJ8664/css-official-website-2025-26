import React, { useState, useEffect, useRef } from 'react'
import '../../styles/chatbot.css'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isChatStarted, setIsChatStarted] = useState(false)

  // Refs for various elements
  const messagesEndRef = useRef(null)
  const chatWidgetRef = useRef(null)
  const chatLauncherRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  // --- NEW: Effect to handle closing the chat on outside click or scroll ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Proceed only if the chat widget is open
      if (!isOpen) return

      // Check if the click is outside the chat widget AND not on the launcher icon
      if (
        chatWidgetRef.current &&
        !chatWidgetRef.current.contains(event.target) &&
        chatLauncherRef.current &&
        !chatLauncherRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }

    // Add event listeners when the component mounts
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true) // Use capture phase to detect scroll early

    // Cleanup: remove event listeners when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen]) // Re-run the effect if `isOpen` state changes

  const toggleChat = () => setIsOpen(!isOpen)

  const startConversation = () => {
    setIsChatStarted(true)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    const newUserMessage = { text: inputValue, sender: 'user' }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInputValue('') // Simulate bot response

    setTimeout(() => {
      const botResponse = {
        text: 'Thanks for your message! A representative will get back to you shortly.',
        sender: 'bot',
      }
      setMessages((prevMessages) => [...prevMessages, botResponse])
    }, 1200)
  }
  const resetChat = () => {
    setIsChatStarted(false)
    setMessages([])
  }

  return (
    <>
            {/*=============== CHATBOT LAUNCHER ===============*/}     {' '}
      <div className="chat-launcher" onClick={toggleChat} ref={chatLauncherRef}>
               {' '}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
             {' '}
      </div>
            {/*=============== CHATBOT WIDGET ===============*/}     {' '}
      <div
        className={`chat-widget ${isOpen ? 'active' : ''}`}
        ref={chatWidgetRef}
      >
               {' '}
        <div className="chat-header">
                   {' '}
          <div className="header-content">
                        <h3 className="header-title">HelpBot</h3>           {' '}
            {isChatStarted && (
              <button
                className="icon-btn"
                onClick={resetChat}
                title="Start new conversation"
              >
                                   {' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                               {' '}
              </button>
            )}
                     {' '}
          </div>
                   {' '}
          <button
            className="icon-btn close-btn"
            onClick={toggleChat}
            title="Close chat"
          >
            &times;
          </button>
                 {' '}
        </div>
               {' '}
        <div className="chat-body">
                   {' '}
          {!isChatStarted ? (
            <div className="welcome-screen">
                           {' '}
              <div className="robot-icon">
                               {' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8V4H8V8H12Z" />
                  <path d="M16 8V4H20V8H16Z" />
                  <path d="M12 12V10H16V12H12Z" />
                  <path d="M18 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
                  <path d="M12 16h.01" />
                </svg>
                             {' '}
              </div>
                            <h2>Welcome to HelpBot</h2>             {' '}
              <p>How can we assist you today?</p>             {' '}
              <button className="start-convo-btn" onClick={startConversation}>
                Start a convo
              </button>
                         {' '}
            </div>
          ) : (
            <div className="chat-messages">
                           {' '}
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}-message`}>
                                   {' '}
                  <div className="message-bubble">{msg.text}</div>             
                   {' '}
                </div>
              ))}
                            <div ref={messagesEndRef} />           {' '}
            </div>
          )}
                 {' '}
        </div>
                       {' '}
        {isChatStarted && (
          <div className="chat-footer">
                           {' '}
            <form onSubmit={handleSendMessage}>
                                 {' '}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                autoComplete="off"
              />
                                 {' '}
              <button type="submit" className="send-btn">
                                       {' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                                   {' '}
              </button>
                             {' '}
            </form>
                       {' '}
          </div>
        )}
             {' '}
      </div>
         {' '}
    </>
  )
}

export default Chatbot
