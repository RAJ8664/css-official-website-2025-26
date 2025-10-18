import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import { useAuth } from '/src/context/AuthContext.jsx';

const AdminPanel = () => {
  const [pendingMessages, setPendingMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const { user, profile: authProfile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPendingMessages();
      fetchStats();
    }
  }, [user]);

  const fetchPendingMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('approved', false)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setPendingMessages(data || []);
    } catch (error) {
      console.error('Error fetching pending messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: totalData } = await supabase
        .from('messages')
        .select('id', { count: 'exact' });

      const { data: approvedData } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('approved', true);

      const { data: pendingData } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('approved', false);

      setStats({
        total: totalData?.length || 0,
        approved: approvedData?.length || 0,
        pending: pendingData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproval = async (messageId, approved) => {
    try {
      if (approved) {
        // Approve the message - update approved to true
        const { error } = await supabase
          .from('messages')
          .update({ approved: true })
          .eq('id', messageId);

        if (error) throw error;

        showToast('Message approved successfully! ✨', 'success');
      } else {
        // Reject the message - delete from database
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', messageId);

        if (error) throw error;

        showToast('Message rejected and deleted.', 'success');
      }

      // Animate and remove from pending list
      gsap.to(`#message-${messageId}`, {
        x: approved ? 100 : -100,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setPendingMessages(prev => prev.filter(msg => msg.id !== messageId));
          fetchStats(); // Update stats after action
        }
      });

    } catch (error) {
      console.error('Error processing message:', error);
      showToast('Failed to process message.', 'error');
    }
  };

  // Function to delete multiple rejected messages at once
  const handleBulkReject = async (messageIds) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .in('id', messageIds);

      if (error) throw error;

      showToast(`${messageIds.length} messages rejected and deleted.`, 'success');
      
      // Remove from UI
      setPendingMessages(prev => 
        prev.filter(msg => !messageIds.includes(msg.id))
      );
      fetchStats();

    } catch (error) {
      console.error('Error bulk rejecting messages:', error);
      showToast('Failed to reject messages.', 'error');
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg font-poppins text-white font-medium shadow-lg transform translate-x-full ${
      type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
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
      {/* Admin Header */}
      <div className="text-center mb-4 p-3 bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-xl border border-red-500/20">
        <h3 className="text-lg font-bold text-red-400 font-poppins">Admin Panel</h3>
        <p className="text-red-300/70 text-sm font-inter">
          Welcome, {authProfile?.full_name || user?.email}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.total}</div>
            <div className="text-xs text-orange-300/70">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-xs text-green-300/70">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-xs text-yellow-300/70">Pending</div>
          </div>
        </div>
      </div>

      {/* Pending Messages */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-bold text-yellow-400 font-poppins">
            Pending Approval ({pendingMessages.length})
          </h4>
          {pendingMessages.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to reject all ${pendingMessages.length} pending messages? This action cannot be undone.`)) {
                  const allIds = pendingMessages.map(msg => msg.id);
                  handleBulkReject(allIds);
                }
              }}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-all"
            >
              Reject All
            </button>
          )}
        </div>

        {pendingMessages.length === 0 ? (
          <div className="text-center py-8 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/20">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-green-300/70 font-inter">
              No pending messages to review!
            </p>
            <p className="text-green-400/50 text-sm mt-1">
              All messages are approved and visible to users.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pendingMessages.map((message) => (
              <div
                key={message.id}
                id={`message-${message.id}`}
                className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border border-yellow-500/30 rounded-xl p-4 shadow-lg relative"
              >
                {/* Message Content */}
                <p className="text-orange-100 text-sm leading-relaxed mb-3 font-inter">
                  {message.message}
                </p>
                
                {/* Metadata */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-orange-300/70 text-xs font-poppins">
                    {message.name || 'Anonymous'}
                  </span>
                  <span className="text-yellow-400/60 text-xs font-inter">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproval(message.id, true)}
                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg hover:scale-105 transition-all duration-200 font-poppins flex items-center justify-center gap-1"
                  >
                    <span>✓</span> Approve
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reject this message? It will be permanently deleted.')) {
                        handleApproval(message.id, false);
                      }
                    }}
                    className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-lg hover:scale-105 transition-all duration-200 font-poppins flex items-center justify-center gap-1"
                  >
                    <span>✗</span> Reject
                  </button>
                </div>

                {/* Admin Badge */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="pt-3 border-t border-orange-500/20">
        <button
          onClick={fetchPendingMessages}
          className="w-full py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold rounded-lg hover:scale-105 transition-all duration-200 font-poppins mb-2"
        >
          🔄 Refresh Messages
        </button>
        
        <div className="text-xs text-orange-300/60 text-center font-inter">
          💡 Rejecting a message permanently deletes it from the database.
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;