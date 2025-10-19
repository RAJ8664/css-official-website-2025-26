import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import DiyaLike from './DiyaLike';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const tapTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages and likes
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages'
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.approved) {
            fetchMessages(); // Refresh to get proper like count and sorting
          }
        }
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_likes'
        },
        () => {
          // Refresh messages when likes change to maintain sorting
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  const fetchMessages = async () => {
    try {
      // Get all approved messages with their like counts
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('approved', true);

      if (messagesError) throw messagesError;

      // Get like counts for each message
      const messagesWithLikes = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { count, error: likesError } = await supabase
            .from('message_likes')
            .select('*', { count: 'exact', head: true })
            .eq('message_id', message.id);

          return {
            ...message,
            like_count: likesError ? 0 : count || 0
          };
        })
      );

      // Sort by like count (highest first), then by timestamp (newest first)
      const sortedMessages = messagesWithLikes.sort((a, b) => {
        if (b.like_count !== a.like_count) {
          return b.like_count - a.like_count;
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setMessages(sortedMessages);
      
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

  // Double tap handler for message cards
  const handleDoubleTap = (messageId, event) => {
    // Prevent triggering on like button clicks
    if (event.target.closest('.diya-like-button')) {
      return;
    }

    // Find the like button for this message and trigger like
    const likeButton = document.querySelector(`[data-message-id="${messageId}"] .diya-like-button button`);
    if (likeButton) {
      likeButton.click();
      
      // Show double tap animation
      showDoubleTapAnimation(event);
    }
  };

  // Show heart animation on double tap (like Instagram)
  const showDoubleTapAnimation = (event) => {
    const heart = document.createElement('div');
    heart.innerHTML = '🪔';
    heart.className = 'fixed text-4xl z-50 pointer-events-none';
    heart.style.left = `${event.clientX - 20}px`;
    heart.style.top = `${event.clientY - 20}px`;
    
    document.body.appendChild(heart);

    // Animation
    gsap.fromTo(heart, 
      { scale: 0, opacity: 0 },
      { 
        scale: 1.5, 
        opacity: 1, 
        duration: 0.3,
        ease: "back.out(1.7)"
      }
    );
    
    gsap.to(heart, {
      scale: 2,
      opacity: 0,
      y: -50,
      duration: 0.5,
      delay: 0.3,
      ease: "power2.out",
      onComplete: () => {
        document.body.removeChild(heart);
      }
    });
  };

  // Tap handler for message cards
  const handleMessageTap = (messageId, event) => {
    if (event.target.closest('.diya-like-button')) {
      return;
    }

    const currentTime = new Date().getTime();
    const lastTap = event.currentTarget.lastTap || 0;
    const timeSinceLastTap = currentTime - lastTap;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) { // Double tap within 300ms
      handleDoubleTap(messageId, event);
      event.currentTarget.lastTap = 0;
    } else {
      event.currentTarget.lastTap = currentTime;
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
            data-message-id={message.id}
            className="message-card bg-gradient-to-r from-purple-800/40 to-pink-800/40 border border-orange-500/20 rounded-xl p-4 shadow-lg backdrop-blur-sm hover:border-orange-500/40 transition-all duration-300 cursor-pointer select-none"
            onClick={(e) => handleMessageTap(message.id, e)}
            onTouchStart={(e) => handleMessageTap(message.id, e)}
          >
            <p className="text-orange-100 text-sm leading-relaxed font-inter mb-3">
              {message.message}
            </p>
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-orange-500/20">
              <div className="flex items-center gap-4">
                <span className="text-orange-300/70 text-xs font-medium font-poppins">
                  {message.name || 'Anonymous'}
                </span>
                
                {/* Diya Like Component */}
                <div className="diya-like-button">
                  <DiyaLike 
                    messageId={message.id} 
                    initialLikeCount={message.like_count || 0}
                  />
                </div>
              </div>
              
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