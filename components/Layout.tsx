"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '@/components/SafeImage';
import { UserAvatar } from '@/components/UserAvatar';
import { 
  Search, ShoppingBag, User, Menu, LogOut, X,
  LayoutDashboard, UserCircle, ChevronDown, 
  Loader2, ShieldCheck, Plus, Heart, Bell,
  Sun, Moon, ArrowRight, Linkedin, Instagram, Facebook, Music2,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockAuth, mockAnnouncements } from '@/lib/store';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/categories', label: 'Categories' },
  { href: '/messages', label: 'Messages' },
  { href: '/seller/dashboard', label: 'Sell' },
];

export const Navbar = React.memo(() => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMounted, setIsMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Close mobile menu on route change
    setShowMobileMenu(false);
  }, [router]);

  useEffect(() => {
    if (!isMounted) return;
    const fetchAnnouncements = async () => {
      try {
        const ann = await mockAnnouncements.getAll();
        setAnnouncements(ann || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };
    fetchAnnouncements();
  }, [isMounted]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await mockAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
          setProfile(currentUser.profile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    
    // Listen for auth changes (custom event)
    const handleAuthChange = () => fetchUser();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = async () => {
    try {
      await mockAuth.logout();
      setUser(null);
      setShowDropdown(false);
      setShowMobileMenu(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnimatePresence mode="wait">
        {isMounted && announcements.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-neon-blue text-black py-2 px-4 text-center text-[10px] sm:text-xs font-black tracking-widest relative z-[60]"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
              <span className="truncate">{announcements[announcements.length - 1].content}</span>
              {announcements[announcements.length - 1].link && (
                <Link href={announcements[announcements.length - 1].link} className="underline hover:opacity-70 transition-opacity shrink-0 font-bold">LEARN MORE</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <nav 
        suppressHydrationWarning 
        className="relative transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <div className="glass-card px-6 sm:px-8 h-16 sm:h-20 flex justify-between items-center border-white/10 backdrop-blur-2xl bg-white/[0.02]">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-10 h-10 bg-gradient-to-br from-neon-blue to-emerald-800 rounded-xl flex items-center justify-center neon-glow-blue relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="text-black font-black text-xl relative z-10">N</span>
              </motion.div>
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-neon-blue transition-colors duration-200">
                NEURONIX<span className="text-neon-blue">AI</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-neon-blue transition-all duration-200 relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-blue transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all text-white/30 hover:text-neon-blue border border-transparent hover:border-white/10"
                >
                  {theme === 'dark' ? <Sun size={18} suppressHydrationWarning /> : <Moon size={18} suppressHydrationWarning />}
                </button>
                <button 
                  aria-label="Search marketplace"
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all text-white/30 hover:text-neon-blue border border-transparent hover:border-white/10"
                >
                  <Search size={18} suppressHydrationWarning />
                </button>
              </div>

              <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
              
              {loading ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin text-white/20" suppressHydrationWarning />
                </div>
              ) : user ? (
                <div className="relative">
                  <button 
                    aria-haspopup="true"
                    aria-expanded={showDropdown}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden relative">
                      <UserAvatar 
                        src={profile?.avatarUrl || profile?.avatar_url} 
                        name={user.fullName || user.username} 
                        size={32}
                        className="rounded-lg" 
                        textClassName="text-[10px]"
                      />
                    </div>
                    <span className="text-xs font-black text-white/70 hidden lg:block uppercase tracking-widest">@{user.username}</span>
                    <ChevronDown size={14} suppressHydrationWarning className={`text-white/30 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-neon-purple' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: 'transform, opacity' }}
                        className="absolute right-0 mt-4 w-64 glass-card p-3 border-white/10 backdrop-blur-3xl bg-black/40 neon-glow-purple/10 hidden md:block"
                      >
                        <div className="px-4 py-3 mb-3 border-b border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Account Status</p>
                            {user.role === 'admin' ? (
                              <span className="text-[8px] px-2 py-0.5 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-md font-black uppercase tracking-tighter">Admin</span>
                            ) : user.role === 'seller' ? (
                              <span className="text-[8px] px-2 py-0.5 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 rounded-md font-black uppercase tracking-tighter">Freelancer</span>
                            ) : (
                              <span className="text-[8px] px-2 py-0.5 bg-white/10 text-white/60 border border-white/20 rounded-md font-black uppercase tracking-tighter">Client</span>
                            )}
                          </div>
                          <p className="text-xs font-black text-white truncate uppercase tracking-widest">{user.email}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <Link 
                            href={user.role === 'seller' || user.role === 'admin' ? '/dashboard/seller' : '/dashboard/buyer'}
                            className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            onClick={() => setShowDropdown(false)}
                          >
                            <LayoutDashboard size={18} suppressHydrationWarning className="group-hover:text-neon-blue transition-colors" /> Dashboard
                          </Link>

                          <Link 
                            href="/messages"
                            className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            onClick={() => setShowDropdown(false)}
                          >
                            <MessageSquare size={18} suppressHydrationWarning className="group-hover:text-neon-blue transition-colors" /> Messages
                          </Link>

                          {user.role === 'admin' && (
                            <Link 
                              href="/admin/dashboard"
                              className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-neon-purple hover:text-white hover:bg-neon-purple/5 rounded-xl transition-all group"
                              onClick={() => setShowDropdown(false)}
                            >
                              <ShieldCheck size={18} suppressHydrationWarning className="group-hover:text-white transition-colors" /> Admin Panel
                            </Link>
                          )}

                          {(user.role === 'seller' || user.role === 'admin') && (
                            <Link 
                              href="/seller/upload"
                              className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-neon-blue hover:text-white hover:bg-neon-blue/5 rounded-xl transition-all group"
                              onClick={() => setShowDropdown(false)}
                            >
                              <Plus size={18} suppressHydrationWarning className="group-hover:text-white transition-colors" /> Upload Project
                            </Link>
                          )}
                          
                          <Link 
                            href={`/@${user.username}`}
                            className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            onClick={() => setShowDropdown(false)}
                          >
                            <UserCircle size={18} suppressHydrationWarning className="group-hover:text-neon-pink transition-colors" /> My Profile
                          </Link>
                        </div>
                        
                        <div className="h-[1px] bg-white/5 my-3"></div>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
                        >
                          <LogOut size={18} suppressHydrationWarning className="group-hover:translate-x-1 transition-transform" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="premium-button bg-neon-blue text-black text-xs px-6 py-2.5 neon-glow-blue flex items-center gap-2"
                >
                  <User size={16} suppressHydrationWarning />
                  <span>Login</span>
                </Link>
              )}
              
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all"
              >
                {showMobileMenu ? <X size={24} suppressHydrationWarning /> : <Menu size={24} suppressHydrationWarning />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ willChange: 'opacity' }}
                onClick={() => setShowMobileMenu(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[55] md:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-black border-l border-white/10 z-[60] md:hidden flex flex-col"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {user ? (
                      <div className="w-12 h-12 rounded-2xl overflow-hidden relative">
                        <UserAvatar 
                          src={profile?.avatarUrl || profile?.avatar_url} 
                          name={user.fullName || user.username} 
                          size={48}
                          className="rounded-2xl" 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <User size={24} className="text-white/20" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tighter">NEURONIX</span>
                      {user && <span className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em]">@{user.username}</span>}
                    </div>
                  </div>
                  <button onClick={() => setShowMobileMenu(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                    <X size={24} suppressHydrationWarning />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Navigation</p>
                    {navLinks.map(link => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className="flex items-center justify-between py-4 text-3xl font-black text-white/40 hover:text-neon-blue transition-all group"
                      >
                        {link.label}
                        <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-neon-blue" />
                      </Link>
                    ))}
                  </div>

                  <div className="h-[1px] bg-white/5"></div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Account</p>
                    {user ? (
                      <div className="grid grid-cols-2 gap-4">
                        <Link 
                          href={user.role === 'seller' || user.role === 'admin' ? '/dashboard/seller' : '/dashboard/buyer'}
                          className="flex flex-col gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-neon-blue/30 transition-all group"
                        >
                          <LayoutDashboard size={24} className="text-white/30 group-hover:text-neon-blue transition-colors" />
                          <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                        </Link>
                        <Link 
                          href={`/@${user.username}`}
                          className="flex flex-col gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-neon-pink/30 transition-all group"
                        >
                          <UserCircle size={24} className="text-white/30 group-hover:text-neon-pink transition-colors" />
                          <span className="text-xs font-black uppercase tracking-widest">Profile</span>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="col-span-2 flex items-center justify-center gap-3 py-5 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/20 transition-all"
                        >
                          <LogOut size={20} suppressHydrationWarning /> Logout
                        </button>
                      </div>
                    ) : (
                      <Link 
                        href="/auth/signin"
                        className="premium-button w-full bg-neon-blue text-black flex items-center justify-center gap-3 py-6 neon-glow-blue"
                      >
                        <User size={24} suppressHydrationWarning />
                        <span className="text-lg uppercase tracking-widest">Login / Sign Up</span>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">© 2026 NEURONIX AI</span>
                    <div className="flex gap-4">
                      <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/30">
                        {theme === 'dark' ? <Sun size={18} suppressHydrationWarning /> : <Moon size={18} suppressHydrationWarning />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export const Footer = React.memo(() => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <footer className="bg-dark-bg border-t border-white/5 pt-20 pb-10 h-96" />;

  return (
    <footer suppressHydrationWarning className="bg-dark-bg border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-emerald-800 rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">N</span>
              </div>
              <span className="text-xl font-bold tracking-tighter">
                NEURONIX<span className="text-neon-blue">AI</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              The world&apos;s most advanced marketplace for premium digital assets. Built for developers, by developers.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.linkedin.com/company/neuronixaicareers" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-neon-blue hover:border-neon-blue/50 transition-all">
                <Linkedin size={20} />
              </Link>
              <Link href="https://www.instagram.com/_neuronix_ai_/" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-neon-blue hover:border-neon-blue/50 transition-all">
                <Instagram size={20} />
              </Link>
              <Link href="https://www.facebook.com/share/1Czq7FP15B/" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-neon-blue hover:border-neon-blue/50 transition-all">
                <Facebook size={20} />
              </Link>
              <Link href="https://www.tiktok.com/@neuronix_ai_123?_r=1&_t=ZS-94zGEUTnJyr" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-neon-blue hover:border-neon-blue/50 transition-all">
                <Music2 size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Marketplace</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/marketplace" className="hover:text-neon-blue transition-colors">All Templates</Link></li>
              <li><Link href="/marketplace?category=UI/UX Kits" className="hover:text-neon-blue transition-colors">UI Kits</Link></li>
              <li><Link href="/marketplace?category=SaaS Templates" className="hover:text-neon-blue transition-colors">SaaS Dashboards</Link></li>
              <li><Link href="/marketplace?category=Web Applications" className="hover:text-neon-blue transition-colors">Components</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/docs" className="hover:text-neon-blue transition-colors">Documentation</Link></li>
              <li><Link href="/license" className="hover:text-neon-blue transition-colors">License</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-white/50 mb-4">Get the latest updates and drops.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                aria-label="Subscribe to newsletter"
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue w-full focus:ring-1 focus:ring-neon-blue/20 transition-all"
              />
              <button 
                aria-label="Join newsletter"
                className="bg-neon-blue text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-neon-blue/90 transition-all hover:scale-105 active:scale-95"
              >
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© 2026 Neuronix AI Marketplace. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-neon-blue selection:text-black">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-2xl bg-neon-blue text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronDown className="rotate-180" size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
