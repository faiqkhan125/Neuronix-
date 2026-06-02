"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, User, X, Maximize2, Minimize2, 
  Smile, Paperclip, MoreVertical, Search,
  ArrowLeft, Loader2
} from 'lucide-react';
import { mockMessages, mockUsers, mockAuth } from '@/lib/store';
import { UserAvatar } from './UserAvatar';

interface ChatWindowProps {
  partnerId: string;
  onClose?: () => void;
  fullScreen?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ partnerId, onClose, fullScreen = false }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [partner, setPartner] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = await mockAuth.getCurrentUser();
        setCurrentUser(session.user);
        
        const partnerData = await mockUsers.getById(partnerId);
        setPartner(partnerData);
        
        const msgs = await mockMessages.getMessages(session.user.id, partnerId);
        setMessages(msgs);
        
        // Mark as read
        await mockMessages.markAsRead(session.user.id, partnerId);
      } catch (err) {
        console.error('Error fetching chat data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Simple polling for real-time feel
    const interval = setInterval(async () => {
      if (currentUser) {
        const msgs = await mockMessages.getMessages(currentUser.id, partnerId);
        setMessages(currentMessages => {
          if (msgs.length !== currentMessages.length) {
            mockMessages.markAsRead(currentUser.id, partnerId);
            return msgs;
          }
          return currentMessages;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [partnerId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    const content = newMessage.trim();
    setNewMessage('');
    
    try {
      const sent = await mockMessages.send({
        senderId: currentUser.id,
        receiverId: partnerId,
        content
      });
      setMessages([...messages, sent]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 ${fullScreen ? 'h-full w-full' : 'h-[500px] w-full max-w-sm rounded-[2rem] shadow-2xl'}`}>
        <Loader2 className="animate-spin text-neon-blue" size={32} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-black/40 backdrop-blur-3xl border border-white/10 overflow-hidden ${fullScreen ? 'h-full w-full' : 'h-[500px] w-full max-w-md rounded-[2rem] shadow-2xl relative z-50'}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {fullScreen && onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full mr-1 lg:hidden">
              <ArrowLeft size={18} />
            </button>
          )}
          <UserAvatar src={partner?.avatarUrl} name={partner?.fullName} size={40} className="rounded-xl" />
          <div>
            <div className="text-sm font-black tracking-tight">{partner?.fullName || 'User'}</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!fullScreen && (
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Maximize2 size={16} className="text-white/40" />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, idx) => {
          const isSender = msg.senderId === currentUser?.id;
          const showAvatar = idx === 0 || messages[idx-1].senderId !== msg.senderId;

          return (
            <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isSender && (
                  <div className="w-6 h-6 shrink-0 mb-1 opacity-60">
                    {showAvatar && <UserAvatar src={partner?.avatarUrl} name={partner?.fullName} size={24} className="rounded-lg" />}
                  </div>
                )}
                <div className={`group relative`}>
                   <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isSender 
                      ? 'bg-neon-blue text-black font-medium rounded-br-none' 
                      : 'bg-white/5 text-white/90 border border-white/10 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`text-[8px] font-bold uppercase tracking-tighter mt-1 opacity-30 ${isSender ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.02] border-t border-white/5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:border-neon-blue transition-colors">
          <button type="button" className="p-2 text-white/20 hover:text-white/60 transition-colors">
            <Smile size={20} />
          </button>
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-white placeholder:text-white/20"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-neon-blue text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
