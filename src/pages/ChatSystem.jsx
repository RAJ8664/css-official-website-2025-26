// import React, { useState, useEffect, useRef } from 'react';
// import { supabase } from '/src/supabaseClient.js';
// import { useAuth } from '/src/context/AuthContext.jsx';

// const ChatSystem = () => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [username, setUsername] = useState('Anonymous');
//     const [room, setRoom] = useState('general');
//     const [isConnected, setIsConnected] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [showRoomDropdown, setShowRoomDropdown] = useState(false);
//     const [showSidebar, setShowSidebar] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const messagesEndRef = useRef(null);
//     const subscriptionRef = useRef(null);
//     const adminSubscriptionRef = useRef(null);
//     const { user } = useAuth();

//     // Available chat rooms
//     const rooms = [
//         { id: 'general', name: 'General Chat', icon: '💬' },
//         { id: 'events', name: 'Events Discussion', icon: '🎪' },
//         { id: 'tech', name: 'Tech Talk', icon: '💻' },
//         { id: 'help', name: 'Help & Support', icon: '🤝' },
//         { id: 'random', name: 'Random', icon: '🎲' }
//     ];

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     useEffect(() => {
//         // Generate random username
//         const adjectives = ['Swift', 'Clever', 'Mysterious', 'Digital', 'Cyber', 'Quantum', 'Neon', 'Cosmic'];
//         const nouns = ['Phoenix', 'Wolf', 'Dragon', 'Tiger', 'Eagle', 'Fox', 'Hawk', 'Panther'];
//         const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
//         setUsername(randomName);

//         checkAdminStatus();
//         loadMessages();
//         setupRealtimeSubscription();

//         return () => {
//             if (subscriptionRef.current) {
//                 supabase.removeChannel(subscriptionRef.current);
//             }
//             if (adminSubscriptionRef.current) {
//                 supabase.removeChannel(adminSubscriptionRef.current);
//             }
//         };
//     }, [user]);

//     useEffect(() => {
//         loadMessages();
//         setupRealtimeSubscription();
//     }, [room]);

//     const checkAdminStatus = async () => {
//         if (!user) {
//             setIsAdmin(false);
//             return;
//         }
        
//         try {
//             const { data: profile, error } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .eq('user_id', user.id)
//                 .single();

//             if (error) {
//                 console.error('Error fetching profile:', error);
//                 setIsAdmin(false);
//                 return;
//             }

//             // Check multiple possible admin fields
//             const adminStatus = 
//                 profile?.role === 'admin' || 
//                 profile?.is_admin === true ||
//                 profile?.admin === true ||
//                 (profile?.email && profile.email.includes('admin')) ||
//                 (user?.email && user.email.includes('admin'));

//             setIsAdmin(adminStatus);

//             // Setup admin subscription if user is admin
//             if (adminStatus) {
//                 setupAdminRealtimeSubscription();
//             }

//         } catch (error) {
//             console.error('Error checking admin status:', error);
//             setIsAdmin(false);
//         }
//     };

//     const loadMessages = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('chat_messages')
//                 .select('*')
//                 .eq('room', room)
//                 .order('created_at', { ascending: true })
//                 .limit(100);

//             if (error) {
//                 console.error('Error loading messages:', error);
//                 return;
//             }

//             setMessages(data || []);
//         } catch (error) {
//             console.error('Error in loadMessages:', error);
//         }
//     };

//     const setupRealtimeSubscription = async () => {
//         try {
//             if (subscriptionRef.current) {
//                 supabase.removeChannel(subscriptionRef.current);
//             }

//             const subscription = supabase
//                 .channel(`room-${room}`)
//                 .on(
//                     'postgres_changes',
//                     {
//                         event: 'INSERT',
//                         schema: 'public',
//                         table: 'chat_messages',
//                         filter: `room=eq.${room}`
//                     },
//                     (payload) => {
//                         setMessages(prev => {
//                             const exists = prev.some(msg => msg.id === payload.new.id);
//                             if (!exists) {
//                                 return [...prev, payload.new];
//                             }
//                             return prev;
//                         });
//                     }
//                 )
//                 .on(
//                     'postgres_changes',
//                     {
//                         event: 'DELETE',
//                         schema: 'public',
//                         table: 'chat_messages',
//                         filter: `room=eq.${room}`
//                     },
//                     (payload) => {
//                         setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
//                     }
//                 )
//                 .subscribe((status) => {
//                     setIsConnected(status === 'SUBSCRIBED');
//                 });

//             subscriptionRef.current = subscription;

//         } catch (error) {
//             console.error('Error setting up real-time subscription:', error);
//         }
//     };

//     const setupAdminRealtimeSubscription = async () => {
//         if (!isAdmin) return;

//         try {
//             if (adminSubscriptionRef.current) {
//                 supabase.removeChannel(adminSubscriptionRef.current);
//             }


//             const adminSubscription = supabase
//                 .channel('admin-global-chat')
//                 .on(
//                     'postgres_changes',
//                     {
//                         event: '*',
//                         schema: 'public',
//                         table: 'chat_messages'
//                         // No filter - listens to ALL rooms and ALL events
//                     },
//                     (payload) => {
                        
//                         // Handle different event types
//                         if (payload.eventType === 'DELETE') {
//                             // Remove message from current view if it exists
//                             setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
//                         } else if (payload.eventType === 'INSERT' && payload.new.room === room) {
//                             // Add message if it's for the current room
//                             setMessages(prev => {
//                                 const exists = prev.some(msg => msg.id === payload.new.id);
//                                 if (!exists) {
//                                     return [...prev, payload.new];
//                                 }
//                                 return prev;
//                             });
//                         }
//                     }
//                 )
//                 .subscribe((status) => {
//                 });

//             adminSubscriptionRef.current = adminSubscription;

//         } catch (error) {
//             console.error('Error setting up admin subscription:', error);
//         }
//     };

//     const sendMessage = async (e) => {
//         e.preventDefault();
        
//         if (!newMessage.trim()) return;

//         setLoading(true);
//         const messageText = newMessage.trim();
//         const userIdentifier = user ? `user_${user.id}` : `anon_${Date.now()}`;

//         try {
//             const tempMessage = {
//                 id: `temp_${Date.now()}`,
//                 username: username,
//                 message: messageText,
//                 room: room,
//                 user_id: userIdentifier,
//                 created_at: new Date().toISOString(),
//                 isSending: true
//             };

//             setMessages(prev => [...prev, tempMessage]);
//             setNewMessage('');
//             scrollToBottom();

//             const { data, error } = await supabase
//                 .from('chat_messages')
//                 .insert([
//                     {
//                         username: username,
//                         message: messageText,
//                         room: room,
//                         user_id: userIdentifier
//                     }
//                 ])
//                 .select();

//             if (error) {
//                 setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
//                 alert('Failed to send message: ' + error.message);
//                 return;
//             }

//             if (data && data[0]) {
//                 setMessages(prev => 
//                     prev.map(msg => 
//                         msg.id === tempMessage.id ? { ...data[0], isSending: false } : msg
//                     )
//                 );
//             }

//         } catch (error) {
//             console.error('Error sending message:', error);
//             alert('Failed to send message. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteMessage = async (messageId) => {
//         if (!isAdmin) {
//             alert('Only admins can delete messages.');
//             return;
//         }

//         if (!window.confirm('Are you sure you want to delete this message?')) return;

//         try {
            
//             // Remove from local state immediately for better UX
//             setMessages(prev => prev.filter(msg => msg.id !== messageId));
            
//             const { error } = await supabase
//                 .from('chat_messages')
//                 .delete()
//                 .eq('id', messageId);

//             if (error) throw error;

            
//         } catch (error) {
//             console.error('Error deleting message:', error);
//             alert('Failed to delete message.');
//             // Reload messages if deletion failed
//             loadMessages();
//         }
//     };

//     const clearChat = async () => {
//         if (!isAdmin) {
//             alert('Only admins can clear the chat.');
//             return;
//         }

//         if (window.confirm('Are you sure you want to clear all messages in this room? This action cannot be undone.')) {
//             try {
//                 const { error } = await supabase
//                     .from('chat_messages')
//                     .delete()
//                     .eq('room', room);

//                 if (error) throw error;
                
//                 setMessages([]);
//             } catch (error) {
//                 console.error('Error clearing chat:', error);
//                 alert('Failed to clear chat.');
//             }
//         }
//     };

//     const clearAllChats = async () => {
//         if (!isAdmin) {
//             alert('Only admins can clear all chats.');
//             return;
//         }

//         if (window.confirm('Are you sure you want to clear ALL messages in ALL rooms? This action cannot be undone.')) {
//             try {
//                 const { error } = await supabase
//                     .from('chat_messages')
//                     .delete()
//                     .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all messages

//                 if (error) throw error;
                
//                 setMessages([]);
//             } catch (error) {
//                 console.error('Error clearing all chats:', error);
//                 alert('Failed to clear all chats.');
//             }
//         }
//     };

//     const formatTime = (timestamp) => {
//         return new Date(timestamp).toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const currentRoom = rooms.find(r => r.id === room);

//     return (
//         <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white">
//             {/* Mobile Header - Fixed */}
//             <div className="sticky top-0 z-1 bg-black/90 border-b border-cyan-500/30 backdrop-blur-lg md:hidden">
//                 <div className="p-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
//                             <h1 className="text-lg font-bold text-cyan-300">CSS Chat</h1>
//                             {isAdmin && (
//                                 <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/30">
//                                     Admin
//                                 </span>
//                             )}
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => setShowSidebar(!showSidebar)}
//                                 className="p-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30"
//                             >
//                                 ℹ️
//                             </button>
//                         </div>
//                     </div>
                    
//                     {/* Room Dropdown for Mobile */}
//                     <div className="mt-3 relative">
//                         <select
//                             value={room}
//                             onChange={(e) => setRoom(e.target.value)}
//                             className="w-full p-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white appearance-none cursor-pointer"
//                             style={{
//                                 backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
//                                 backgroundRepeat: 'no-repeat',
//                                 backgroundPosition: 'right 12px center',
//                                 backgroundSize: '16px',
//                                 paddingRight: '40px'
//                             }}
//                         >
//                             {rooms.map(roomItem => (
//                                 <option 
//                                     key={roomItem.id} 
//                                     value={roomItem.id}
//                                     className="bg-gray-800 text-white"
//                                 >
//                                     {roomItem.icon} {roomItem.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="pt-0 md:pt-8 px-4 pb-4 max-w-6xl mx-auto">
//                 {/* Desktop Header */}
//                 <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//                     <div className="text-center md:text-left">
//                         <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Goldman, sans-serif" }}>
//                             CSS Community Chat
//                         </h1>
//                         <p className="text-cyan-300 text-lg">
//                             Anonymous real-time chat - No registration required!
//                         </p>
//                     </div>
                    
//                     {/* Admin Controls - Only show for admins and only on desktop */}
//                     {isAdmin && (
//                         <div className="flex flex-col gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
//                             <h3 className="text-red-300 font-bold text-sm mb-2">🛡️ Admin Controls</h3>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={clearChat}
//                                     className="px-3 py-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 hover:bg-red-600/30 transition-all text-sm"
//                                 >
//                                     Clear Room
//                                 </button>
//                                 <button
//                                     onClick={clearAllChats}
//                                     className="px-3 py-2 bg-red-700/20 border border-red-600/30 rounded text-red-400 hover:bg-red-700/30 transition-all text-sm"
//                                     title="Clear ALL chat rooms"
//                                 >
//                                     Clear All
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     <div className="flex justify-center items-center gap-4 text-sm">
//                         <div className={`flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
//                             <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
//                             {isConnected ? 'Real-time Connected' : 'Real-time Disconnected'}
//                         </div>
//                         <div className="text-cyan-400">
//                             💬 {messages.length} messages
//                         </div>
//                         {isAdmin && (
//                             <div className="text-red-400 flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-red-400"></div>
//                                 Admin Mode
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className=" bg-black/70 border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg overflow-hidden">
//                     {/* Desktop Room Selection */}
//                     <div className="hidden md:block border-b border-cyan-500/20 p-4 bg-gray-900/50">
//                         <div className="flex flex-wrap gap-2 justify-center">
//                             {rooms.map(roomItem => (
//                                 <button
//                                     key={roomItem.id}
//                                     onClick={() => setRoom(roomItem.id)}
//                                     className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
//                                         room === roomItem.id
//                                             ? 'bg-cyan-600 border-cyan-400 text-white'
//                                             : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500'
//                                     }`}
//                                 >
//                                     <span>{roomItem.icon}</span>
//                                     {roomItem.name}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[600px]">
//                         {/* Chat Messages */}
//                         <div className="flex-1 flex flex-col">
//                             {/* Messages Header */}
//                             <div className="border-b border-cyan-500/20 p-3 md:p-4 bg-gray-900/30 flex justify-between items-center">
//                                 <h3 className="text-sm md:text-lg font-bold text-cyan-300 flex items-center gap-2">
//                                     <span className="hidden md:inline">{currentRoom?.icon}</span>
//                                     <span>{currentRoom?.name}</span>
//                                 </h3>
//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={loadMessages}
//                                         className="px-2 py-1 md:px-3 md:py-1 bg-cyan-600/20 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-600/30 transition-all text-xs md:text-sm"
//                                     >
//                                         🔄
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Messages Container */}
//                             <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-900/10">
//                                 {messages.length === 0 ? (
//                                     <div className="text-center text-gray-400 py-8">
//                                         <div className="text-4xl mb-2">💬</div>
//                                         <p className="text-sm md:text-base">No messages yet. Start the conversation!</p>
//                                     </div>
//                                 ) : (
//                                     messages.map((msg) => (
//                                         <div
//                                             key={msg.id}
//                                             className={`group p-3 rounded-lg border transition-all relative ${
//                                                 msg.username === username
//                                                     ? 'bg-cyan-900/20 border-cyan-500/30 md:ml-8'
//                                                     : 'bg-gray-800/20 border-gray-600/30 md:mr-8'
//                                             } ${msg.isSending ? 'opacity-70 animate-pulse' : ''}`}
//                                         >
//                                             {/* Admin Delete Button - Shows for ALL messages when admin */}
//                                             {isAdmin && !msg.isSending && (
//                                                 <button
//                                                     onClick={() => deleteMessage(msg.id)}
//                                                     className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs border border-red-400 shadow-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
//                                                     title="Delete message (Admin)"
//                                                 >
//                                                     ×
//                                                 </button>
//                                             )}
                                            
//                                             <div className="flex justify-between items-start mb-1">
//                                                 <div className="flex items-center gap-2">
//                                                     <span className={`font-bold text-sm md:text-base ${
//                                                         msg.username === username 
//                                                             ? 'text-cyan-300' 
//                                                             : msg.username === 'System'
//                                                             ? 'text-purple-300'
//                                                             : 'text-green-300'
//                                                     }`}>
//                                                         {msg.username}
//                                                     </span>
//                                                     {msg.username === username && (
//                                                         <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
//                                                             {msg.isSending ? 'Sending...' : 'You'}
//                                                         </span>
//                                                     )}
//                                                     {msg.room !== room && (
//                                                         <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
//                                                             {rooms.find(r => r.id === msg.room)?.icon} {msg.room}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <span className="text-xs text-gray-400">
//                                                     {formatTime(msg.created_at)}
//                                                 </span>
//                                             </div>
//                                             <p className="text-gray-200 text-sm whitespace-pre-wrap break-words">
//                                                 {msg.message}
//                                             </p>
//                                         </div>
//                                     ))
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>

//                             {/* Message Input */}
//                             <div className="border-t border-cyan-500/20 p-3 md:p-4 bg-gray-900/30">
//                                 <form onSubmit={sendMessage} className="flex gap-2">
//                                     <input
//                                         type="text"
//                                         value={newMessage}
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                         placeholder="Type your message..."
//                                         className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gray-800 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-gray-400 text-sm md:text-base"
//                                         maxLength={500}
//                                         disabled={loading}
//                                     />
//                                     <button
//                                         type="submit"
//                                         disabled={!newMessage.trim() || loading}
//                                         className="px-4 py-2 md:px-6 md:py-3 bg-cyan-600 border border-cyan-400 rounded-lg text-white font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
//                                     >
//                                         {loading ? '⏳' : 'Send'}
//                                     </button>
//                                 </form>
//                                 <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
//                                     <div>
//                                         You: <span className="text-cyan-300">{username}</span>
//                                         {isAdmin && <span className="text-red-300 ml-2">• Admin</span>}
//                                     </div>
//                                     <div>
//                                         {newMessage.length}/500
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Sidebar - Mobile Overlay */}
//                         {(showSidebar || window.innerWidth >= 768) && (
//                             <div className={`fixed inset-0 z-40 md:relative md:z-auto bg-black/95 md:bg-gray-900/50 ${
//                                 showSidebar ? 'block' : 'hidden md:block'
//                             }`}>
//                                 <div className="absolute top-0 right-0 bottom-0 w-80 max-w-full bg-gray-900 border-l border-cyan-500/30 md:border-l-0 md:border-cyan-500/20 md:relative md:w-80">
//                                     {/* Mobile Close Button */}
//                                     <div className="md:hidden p-4 border-b border-cyan-500/20 flex justify-between items-center">
//                                         <h4 className="font-bold text-cyan-300">Chat Info</h4>
//                                         <button
//                                             onClick={() => setShowSidebar(false)}
//                                             className="p-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>

//                                     <div className="p-4 h-full overflow-y-auto">
//                                         <h4 className="hidden md:block font-bold text-cyan-300 mb-4">Chat Info</h4>
                                        
//                                         <div className="space-y-4">
//                                             <div className="bg-gray-800/30 rounded-lg p-3 border border-cyan-500/20">
//                                                 <h5 className="font-semibold text-sm mb-2">📝 Chat Rules</h5>
//                                                 <ul className="text-xs text-gray-300 space-y-1">
//                                                     <li>• Be respectful to others</li>
//                                                     <li>• No spam or advertising</li>
//                                                     <li>• Keep conversations appropriate</li>
//                                                     <li>• Have fun! 🎉</li>
//                                                 </ul>
//                                             </div>

//                                             <div className="bg-gray-800/30 rounded-lg p-3 border border-cyan-500/20">
//                                                 <h5 className="font-semibold text-sm mb-2">🌐 Rooms</h5>
//                                                 <div className="text-xs text-gray-300">
//                                                     {rooms.map(roomItem => (
//                                                         <div 
//                                                             key={roomItem.id}
//                                                             className={`flex items-center gap-2 py-1 ${
//                                                                 room === roomItem.id ? 'text-cyan-300' : ''
//                                                             }`}
//                                                         >
//                                                             {roomItem.icon} {roomItem.name}
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>

//                                             <div className="bg-gray-800/30 rounded-lg p-3 border border-cyan-500/20">
//                                                 <h5 className="font-semibold text-sm mb-2">⚡ Real-time Status</h5>
//                                                 <ul className="text-xs text-gray-300 space-y-1">
//                                                     <li className={isConnected ? 'text-green-400' : 'text-red-400'}>
//                                                         • {isConnected ? 'Connected to real-time' : 'Disconnected from real-time'}
//                                                     </li>
//                                                     <li>• Messages update instantly</li>
//                                                     <li>• No page refresh needed</li>
//                                                     <li>• Works across all devices</li>
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Close sidebar when clicking outside on mobile */}
//             {showSidebar && (
//                 <div 
//                     className="fixed inset-0 z-30 bg-black/50 md:hidden"
//                     onClick={() => setShowSidebar(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default ChatSystem;