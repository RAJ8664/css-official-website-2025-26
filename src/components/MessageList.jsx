import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: 'approved=eq.true'
        }, 
        (payload) => {
          setMessages(prev => [payload.new, ...prev]);
          animateNewMessage(payload.new.id);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('approved', true)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      
      // Animate messages in
      setTimeout(() => {
        gsap.fromTo('.message-card',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }
        );
      }, 100);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateNewMessage = (messageId) => {
    const newMessageElement = document.getElementById(`message-${messageId}`);
    if (newMessageElement) {
      gsap.fromTo(newMessageElement,
        { 
          scale: 0.8,
          backgroundColor: '#f59e0b'
        },
        { 
          scale: 1,
          backgroundColor: 'transparent',
          duration: 0.6,
          ease: "back.out(1.7)"
        }
      );
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🪔</div>
          <p className="text-orange-300/70 font-inter">
            No wishes yet. Be the first to share your Diwali wishes!
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            id={`message-${message.id}`}
            className="message-card bg-gradient-to-r from-purple-800/40 to-pink-800/40 border border-orange-500/20 rounded-xl p-4 shadow-lg backdrop-blur-sm"
          >
            <p className="text-orange-100 text-sm leading-relaxed font-inter">
              {message.message}
            </p>
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-orange-500/20">
              <span className="text-orange-300/70 text-xs font-medium font-poppins">
                {message.name || 'Anonymous'}
              </span>
              <span className="text-orange-400/60 text-xs font-inter">
                {formatDate(message.timestamp)}
              </span>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-orange-400 rounded-full opacity-60"></div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;