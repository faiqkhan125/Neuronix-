"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, MessageSquare, Filter, 
  Settings, Loader2, Sparkles, User,
  PlusCircle, MoreVertical, ShieldCheck
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { mockMessages, mockAuth, mockUsers } from '@/lib/store';
import { UserAvatar } from '@/components/UserAvatar';
import { ChatWindow } from '@/components/ChatWindow';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialPartnerId = searchParams.get('partner');
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [partners, setPartners] = useState<Record<string, any>>({});
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(initialPartnerId);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = await mockAuth.getCurrentUser();
        if (!session) return;
        setCurrentUser(session.user);
        
        const convs = await mockMessages.getConversations(session.user.id);
        setConversations(convs);
        
        // Fetch partner data
        const partnerData: Record<string, any> = {};
        for (const conv of convs as any[]) {
          const user = await mockUsers.getById(conv.partnerId);
          partnerData[conv.partnerId] = user;
        }

        const currentInitialPartnerId = initialPartnerId;
        // If explicitly requested a partner not in conversations yet
        if (currentInitialPartnerId && !partnerData[currentInitialPartnerId]) {
          const user = await mockUsers.getById(currentInitialPartnerId);
          if (user) {
            partnerData[currentInitialPartnerId] = user;
          }
        }
        setPartners(partnerData);
        
        // Select first conversation by default on tablet/desktop
        if (convs.length > 0 && !selectedPartnerId && typeof window !== 'undefined' && window.innerWidth >= 1024) {
          setSelectedPartnerId((convs as any[])[0].partnerId);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    const interval = setInterval(async () => {
      if (currentUser) {
        const convs = await mockMessages.getConversations(currentUser.id);
        
        setConversations(currentConvs => {
          const hasChanged = convs.length !== currentConvs.length || 
            (convs as any[]).some((c, i) => c.lastMessage.id !== (currentConvs as any[])[i]?.lastMessage?.id);
          
          if (hasChanged) {
            // Update partner data for new conversations
            const fetchNewPartners = async () => {
              const newPartnerData = { ...partners };
              let changed = false;
              for (const conv of convs as any[]) {
                if (!newPartnerData[conv.partnerId]) {
                  const user = await mockUsers.getById(conv.partnerId);
                  newPartnerData[conv.partnerId] = user;
                  changed = true;
                }
              }
              if (changed) setPartners(newPartnerData);
            };
            fetchNewPartners();
            return convs;
          }
          return currentConvs;
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentUser, partners, initialPartnerId, selectedPartnerId]);

  const filteredConversations = conversations.filter(conv => {
    const partner = partners[(conv as any).partnerId];
    if (!partner) return true;
    return partner.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           partner.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full glass-card-premium border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
      
      {/* Sidebar */}
      <div className={`w-full lg:w-96 flex-col border-r border-white/5 bg-black/20 ${selectedPartnerId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neon-blue/10 rounded-2xl text-neon-blue">
                <MessageSquare size={20} />
              </div>
              <h1 className="text-xl font-black uppercase tracking-tight text-white">Directs</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40">
                <Settings size={20} />
              </button>
              <button className="p-2 bg-neon-blue text-black rounded-xl hover:scale-105 active:scale-95 transition-all">
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-blue transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Filter conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon-blue transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <Loader2 className="animate-spin text-neon-blue" size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing Messages...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                <MessageSquare size={32} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-1">No chats yet</h3>
                <p className="text-xs text-white/20 leading-relaxed font-medium">Head over to the marketplace to start a conversation with a freelancer.</p>
              </div>
            </div>
          ) : (
            filteredConversations.map((conv: any) => {
              const partner = partners[conv.partnerId];
              const isActive = selectedPartnerId === conv.partnerId;
              const isUnread = conv.unreadCount > 0;

              return (
                <button 
                  key={conv.partnerId}
                  onClick={() => setSelectedPartnerId(conv.partnerId)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                    isActive 
                      ? 'bg-neon-blue text-black' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative shrink-0">
                    <UserAvatar 
                      src={partner?.avatarUrl} 
                      name={partner?.fullName} 
                      size={48} 
                      className={`rounded-xl ${isActive ? 'bg-black/20' : ''}`} 
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isActive ? 'border-neon-blue' : 'border-[#0a0a0a]'} bg-emerald-500`}></div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm font-black tracking-tight truncate ${isActive ? 'text-black' : 'text-white'}`}>
                        {partner?.fullName || 'User'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-black/60' : 'text-white/20'}`}>
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate font-medium ${isActive ? 'text-black/70' : isUnread ? 'text-white font-bold' : 'text-white/40'}`}>
                      {conv.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  {isUnread && !isActive && (
                    <div className="w-5 h-5 bg-neon-blue rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-black text-black">{conv.unreadCount}</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-black/10 ${!selectedPartnerId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedPartnerId ? (
          <ChatWindow 
            partnerId={selectedPartnerId} 
            fullScreen 
            onClose={typeof window !== 'undefined' && window.innerWidth < 1024 ? () => setSelectedPartnerId(null) : undefined} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-0.5 animate-spin-slow">
                <div className="w-full h-full rounded-[2.5rem] bg-black"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageSquare size={40} className="text-neon-blue" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-neon-purple backdrop-blur-xl animate-bounce">
                <Sparkles size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-4">Neural Messenger</h2>
              <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed font-sm">
                Select a conversation from the left to start chatting with freelancers or clients. 
                Your privacy is protected by end-to-end encrypted neural flows.
              </p>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">AI Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Layout>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-[calc(100vh-80px)]">
        <Suspense fallback={
          <div className="h-full glass-card-premium border-white/5 rounded-[2.5rem] flex items-center justify-center">
            <Loader2 className="animate-spin text-neon-blue" size={32} />
          </div>
        }>
          <MessagesContent />
        </Suspense>
      </div>
    </Layout>
  );
}
