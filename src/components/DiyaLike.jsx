import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import { useAuth } from '/src/context/AuthContext.jsx';

const DiyaLike = ({ messageId, initialLikeCount = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkIfLiked();
    fetchLikeCount();
  }, [messageId, user]);

  const checkIfLiked = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('message_likes')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const { count, error } = await supabase
        .from('message_likes')
        .select('*', { count: 'exact', head: true })
        .eq('message_id', messageId);

      if (!error && count !== null) {
        setLikeCount(count);
      }
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      showToast('Please login to like messages!', 'info');
      return;
    }

    if (isAnimating) return;

    setIsAnimating(true);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('message_likes')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id);

        if (!error) {
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          animateUnlike();
        }
      } else {
        // Like
        const { error } = await supabase
          .from('message_likes')
          .insert([
            {
              message_id: messageId,
              user_id: user.id
            }
          ]);

        if (!error) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          animateLike();
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const animateLike = () => {
    const diyaElement = document.getElementById(`diya-${messageId}`);
    const flameElement = document.getElementById(`flame-${messageId}`);
    
    if (diyaElement && flameElement) {
      const tl = gsap.timeline();
      
      tl.to(diyaElement, {
        scale: 1.3,
        duration: 0.2,
        ease: "back.out(1.7)"
      })
      .to(diyaElement, {
        scale: 1,
        duration: 0.1
      })
      .fromTo(flameElement,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        "-=0.2"
      );

      // Sparkle effect
      const sparkles = document.querySelectorAll(`.sparkle-${messageId}`);
      sparkles.forEach((sparkle, index) => {
        gsap.fromTo(sparkle,
          { scale: 0, opacity: 0, x: 0, y: 0 },
          {
            scale: 1,
            opacity: 1,
            x: (Math.random() - 0.5) * 30,
            y: -Math.random() * 40,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out"
          }
        );
      });
    }
  };

  const animateUnlike = () => {
    const flameElement = document.getElementById(`flame-${messageId}`);
    
    if (flameElement) {
      gsap.to(flameElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      });
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg font-poppins text-white font-medium shadow-lg transform translate-x-full ${
      type === 'info' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    gsap.to(toast, {
      x: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

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
    <div className="flex items-center gap-2">
      {/* Diya Like Button */}
      <button
        onClick={handleLike}
        disabled={isAnimating}
        className={`relative p-2 rounded-full transition-all duration-300 ${
          isLiked 
            ? 'bg-orange-500/20 border border-orange-500/30' 
            : 'bg-gray-500/20 border border-gray-500/30 hover:bg-orange-500/10'
        } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Diya Base */}
        <div 
          id={`diya-${messageId}`}
          className="relative w-6 h-4 flex items-center justify-center"
        >
          {/* Diya Body */}
          <div className={`w-5 h-3 rounded-b-full ${
            isLiked 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700'
          }`}>
            {/* Diya Top */}
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 rounded-t-full ${
              isLiked 
                ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}></div>
            
            {/* Wick */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-400 rounded-t"></div>
          </div>

          {/* Flame */}
          <div
            id={`flame-${messageId}`}
            className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-3 ${
              isLiked ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(ellipse at center, #ffffff 0%, #ffeb3b 30%, #ff9800 60%, #ff5722 100%)',
              borderRadius: '50% 50% 20% 20% / 60% 60% 40% 40%',
              filter: 'blur(0.5px)',
              transformOrigin: 'center bottom'
            }}
          ></div>

          {/* Sparkles */}
          {isLiked && (
            <>
              <div className={`sparkle-${messageId} absolute -top-6 left-1/4 w-1 h-1 bg-yellow-300 rounded-full`}></div>
              <div className={`sparkle-${messageId} absolute -top-5 right-1/4 w-1 h-1 bg-orange-300 rounded-full`}></div>
              <div className={`sparkle-${messageId} absolute -top-7 left-1/2 w-0.5 h-0.5 bg-yellow-200 rounded-full`}></div>
            </>
          )}
        </div>

        {/* Glow Effect when liked */}
        {isLiked && (
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm animate-pulse"></div>
        )}
      </button>

      {/* Like Count */}
      <span className={`text-sm font-medium min-w-[20px] text-center ${
        isLiked ? 'text-orange-400' : 'text-gray-400'
      }`}>
        {likeCount}
      </span>
    </div>
  );
};

export default DiyaLike;