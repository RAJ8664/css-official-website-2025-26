import React, { useState } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      showToast('Please write a Diwali wish!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            message: message.trim(),
            name: name.trim() || null,
            approved: false
          }
        ]);

      if (error) throw error;

      // Success animation
      gsap.fromTo('.submit-btn',
        { scale: 1 },
        { 
          scale: 1.1, 
          duration: 0.2, 
          yoyo: true, 
          repeat: 1,
          ease: "power2.inOut"
        }
      );

      showToast('Your message has been sent for approval ✨', 'success');
      
      // Reset form
      setMessage('');
      setName('');
      
    } catch (error) {
      console.error('Error submitting message:', error);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg font-poppins text-white font-medium shadow-lg transform translate-x-full ${
      type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    gsap.to(toast, {
      x: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    // Animate out and remove
    setTimeout(() => {
      gsap.to(toast, {
        x: 300,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          document.body.removeChild(toast);
        }
      });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-orange-200 text-sm font-medium mb-2 font-inter">
          Your Diwali Wish *
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your heartfelt Diwali message or a secret wish for someone..."
          className="w-full h-32 px-3 py-2 bg-purple-800/50 border border-orange-500/30 rounded-lg text-orange-100 placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none font-inter"
          required
        />
      </div>

      <div>
        <label className="block text-orange-200 text-sm font-medium mb-2 font-inter">
          Your Name (Optional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anonymous"
          className="w-full px-3 py-2 bg-purple-800/50 border border-orange-500/30 rounded-lg text-orange-100 placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-inter"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-btn w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-purple-900 disabled:opacity-50 disabled:cursor-not-allowed font-poppins shadow-lg"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Sending...
          </span>
        ) : (
          '🪔 Send with Light'
        )}
      </button>

      <p className="text-xs text-orange-300/60 text-center font-inter">
        Your message will be visible after approval by the admin team.
      </p>
    </form>
  );
};

export default MessageForm;