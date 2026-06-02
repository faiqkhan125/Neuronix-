"use client";

// Mock Store Integration
// This uses localStorage for a purely client-side experience without a backend.

export const PROJECT_CATEGORIES = [
  "AI Models & Chatbots",
  "SaaS Templates",
  "UI/UX Kits",
  "Web Applications",
  "Mobile Apps",
  "E-commerce Solutions",
  "Data Visualization",
  "Blockchain & Web3",
  "Automation Tools",
  "API Integrations",
  "Plugins, Scripts & Add-ons",
  "Full Websites & Multi-Page Sites",
  "Other / Niche Templates"
];

let memoryStore: any = {
  users: [],
  profiles: [],
  projects: [],
  currentUser: null,
  announcements: [],
  orders: [],
  notifications: [],
  saasPlatforms: [],
  categories: [],
  reviews: [],
  messages: []
};

export const getStore = () => {
  return memoryStore;
};

export const saveStore = (data: { users?: any[], profiles?: any[], projects?: any[], currentUser?: any, announcements?: any[], orders?: any[], notifications?: any[], saasPlatforms?: any[], categories?: any[], reviews?: any[], messages?: any[] }) => {
  memoryStore = { ...memoryStore, ...data };
};


export const mockAuth = {
  signup: async (email: string, password: string, username: string, fullName: string, role: 'buyer' | 'seller') => {
    const store = getStore();
    const existingUser = store.users.find((u: any) => u.username === username || u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists with this email or username.');
    }

    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      username,
      fullName,
      role,
      joinedAt: new Date().toISOString()
    };

    const updatedUsers = [...store.users, newUser];
    const userSession = { user: newUser, profile: newUser };
    
    saveStore({ users: updatedUsers, currentUser: userSession });
    window.dispatchEvent(new Event('auth-change'));
    return userSession;
  },
  
  login: async (email: string, password: string) => {
    const store = getStore();
    const user = store.users.find((u: any) => u.email === email);
    
    if (user) {
      const userSession = { user, profile: user };
      saveStore({ currentUser: userSession });
      window.dispatchEvent(new Event('auth-change'));
      return userSession;
    }
    
    throw new Error('Invalid credentials');
  },
  
  logout: async () => {
    saveStore({ currentUser: null });
    window.dispatchEvent(new Event('auth-change'));
  },
  
  getCurrentUser: async () => {
    const store = getStore();
    return store.currentUser;
  }
};

export const mockProjects = {
  getAll: async () => {
    const store = getStore();
    return store.projects;
  },
  getById: async (id: string) => {
    const store = getStore();
    return store.projects.find((p: any) => p.id === id) || null;
  },
  create: async (projectData: any, userId?: string) => {
    const store = getStore();
    const newProject = {
      ...projectData,
      id: Math.random().toString(36).substring(7),
      sellerId: userId,
      sales: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedProjects = [newProject, ...store.projects];
    saveStore({ projects: updatedProjects });
    return newProject;
  },
  delete: async (id: string, userId?: string) => {
    const store = getStore();
    const updatedProjects = store.projects.filter((p: any) => p.id !== id);
    saveStore({ projects: updatedProjects });
    return { success: true };
  },
  update: async (id: string, updates: any, userId?: string) => {
    const store = getStore();
    const updatedProjects = store.projects.map((p: any) => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    saveStore({ projects: updatedProjects });
    return updatedProjects.find((p: any) => p.id === id);
  },
};

export const mockAnnouncements = {
  getAll: async () => {
    const store = getStore();
    return store.announcements;
  },
  create: async (announcementData: any) => {
    const store = getStore();
    const newAnn = {
      ...announcementData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    const updatedAnn = [newAnn, ...store.announcements];
    saveStore({ announcements: updatedAnn });
    return newAnn;
  },
  delete: async (id: string) => {
    const store = getStore();
    const updatedAnn = store.announcements.filter((a: any) => a.id !== id);
    saveStore({ announcements: updatedAnn });
    return { success: true };
  }
};

export const mockSaasPlatforms = {
  getAll: async () => {
    const store = getStore();
    return store.saasPlatforms;
  },
  create: async (platformData: any) => {
    const store = getStore();
    const newPlatform = {
      ...platformData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    const updatedPlatforms = [newPlatform, ...store.saasPlatforms];
    saveStore({ saasPlatforms: updatedPlatforms });
    return newPlatform;
  },
  delete: async (id: string) => {
    const store = getStore();
    const updatedPlatforms = store.saasPlatforms.filter((p: any) => p.id !== id);
    saveStore({ saasPlatforms: updatedPlatforms });
    return { success: true };
  }
};

export const mockOrders = {
  getAll: async () => {
    const store = getStore();
    return store.orders;
  },
  getById: async (id: string) => {
    const store = getStore();
    return store.orders.find((o: any) => o.id === id) || null;
  },
  create: async (orderData: any) => {
    const store = getStore();
    const newOrder = {
      ...orderData,
      id: Math.random().toString(36).substring(7),
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedOrders = [newOrder, ...store.orders];
    saveStore({ orders: updatedOrders });
    return newOrder;
  },
  update: async (id: string, updates: any) => {
    const store = getStore();
    const updatedOrders = store.orders.map((o: any) => 
      o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
    );
    saveStore({ orders: updatedOrders });
    return updatedOrders.find((o: any) => o.id === id);
  },
  getByUserAndProject: async (userId: string, projectId: string) => {
    const store = getStore();
    return store.orders.find((o: any) => o.buyerId === userId && o.projectId === projectId) || null;
  }
};

export const mockReviews = {
  getAll: async () => {
    const store = getStore();
    return store.reviews || [];
  },
  create: async (reviewData: any) => {
    const store = getStore();
    const newReview = {
      ...reviewData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    const updatedReviews = [newReview, ...(store.reviews || [])];
    saveStore({ reviews: updatedReviews });
    return newReview;
  },
  delete: async (id: string) => {
    const store = getStore();
    const updatedReviews = (store.reviews || []).filter((r: any) => r.id !== id);
    saveStore({ reviews: updatedReviews });
    return { success: true };
  }
};

export const mockCategories = {
  getAll: async () => {
    const store = getStore();
    return store.categories || [];
  },
  create: async (categoryData: any) => {
    const store = getStore();
    const newCat = {
      ...categoryData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    const updatedCats = [...(store.categories || []), newCat];
    saveStore({ categories: updatedCats });
    return newCat;
  },
  delete: async (id: string) => {
    const store = getStore();
    const updatedCats = (store.categories || []).filter((c: any) => c.id !== id);
    saveStore({ categories: updatedCats });
    return { success: true };
  }
};

export const mockUsers = {
  getAll: async () => {
    const store = getStore();
    return store.users;
  },
  updateProfile: async (userId: string, updates: any) => {
    const store = getStore();
    const updatedUsers = store.users.map((u: any) => 
      u.id === userId ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
    );
    
    // Update current user if it's the one being updated
    if (store.currentUser?.user?.id === userId) {
      const updatedUser = updatedUsers.find((u: any) => u.id === userId);
      saveStore({ users: updatedUsers, currentUser: { user: updatedUser, profile: updatedUser } });
    } else {
      saveStore({ users: updatedUsers });
    }
    
    return updatedUsers.find((u: any) => u.id === userId);
  },
  getById: async (id: string) => {
    const store = getStore();
    return store.users.find((u: any) => u.id === id) || null;
  }
};

export const mockMessages = {
  getConversations: async (userId: string) => {
    const store = getStore();
    const userMessages = (store.messages || []).filter((m: any) => m.senderId === userId || m.receiverId === userId);
    
    // Group by conversation partner
    const conversations: any = {};
    userMessages.forEach((m: any) => {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
      if (!conversations[partnerId] || new Date(m.createdAt) > new Date(conversations[partnerId].lastMessage.createdAt)) {
        conversations[partnerId] = {
          partnerId,
          lastMessage: m,
          unreadCount: m.receiverId === userId && !m.read ? (conversations[partnerId]?.unreadCount || 0) + 1 : (conversations[partnerId]?.unreadCount || 0)
        };
      } else if (m.receiverId === userId && !m.read) {
        conversations[partnerId].unreadCount = (conversations[partnerId].unreadCount || 0) + 1;
      }
    });

    return Object.values(conversations).sort((a: any, b: any) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  },

  getMessages: async (userId: string, partnerId: string) => {
    const store = getStore();
    return (store.messages || [])
      .filter((m: any) => 
        (m.senderId === userId && m.receiverId === partnerId) || 
        (m.senderId === partnerId && m.receiverId === userId)
      )
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  send: async (msg: { senderId: string; receiverId: string; content: string; projectId?: string }) => {
    const store = getStore();
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      ...msg,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedMessages = [...(store.messages || []), newMessage];
    saveStore({ messages: updatedMessages });
    return newMessage;
  },

  markAsRead: async (userId: string, partnerId: string) => {
    const store = getStore();
    const updatedMessages = (store.messages || []).map((m: any) => {
      if (m.senderId === partnerId && m.receiverId === userId) {
        return { ...m, read: true };
      }
      return m;
    });
    saveStore({ messages: updatedMessages });
  }
};
