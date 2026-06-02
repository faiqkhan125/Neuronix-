"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, User, MapPin, Link as LinkIcon, Plus, X, Loader2, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { mockAuth, saveStore, getStore, mockUsers } from '@/lib/store';
import { FileUpload } from '@/components/FileUpload';

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  
  // Form State
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [socialLinks, setSocialLinks] = useState<string[]>(['']);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const data = await mockAuth.getCurrentUser();
      if (!data) {
        router.push('/auth/signin');
        return;
      }
      setUser(data.user);
    };
    checkUser();
  }, [router]);

  const handleAvatarChange = (file: File | null, base64: string | null) => {
    setAvatarFile(file);
    setAvatarUrl(base64);
  };

  const addSocialLink = () => {
    if (socialLinks.length < 5) {
      setSocialLinks([...socialLinks, '']);
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, val: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = val;
    setSocialLinks(newLinks);
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const current = await mockAuth.getCurrentUser();
      if (!current) throw new Error('No user found');

      const updatedProfile = await mockUsers.updateProfile(current.user.id, {
        username,
        bio,
        location,
        avatar_url: avatarUrl,
        social_links: socialLinks.filter(l => l.trim() !== ''),
        skills,
        onboarding_complete: true,
      });
      
      router.push('/');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-dark-bg py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-neon-blue' : 'bg-white/10'}`} />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8 md:p-12"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Identity</h2>
                <p className="text-white/50">How should others know you?</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <FileUpload 
                  onFileSelect={handleAvatarChange}
                  value={avatarUrl}
                  label="Profile Picture"
                  previewClassName="w-32 h-32 rounded-full"
                  className="w-32 h-32"
                />

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className={`w-full bg-white/5 border ${usernameError ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-neon-blue transition-colors`}
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">About You</h2>
                <p className="text-white/50">Tell us a bit about yourself and your skills.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Bio</label>
                    <span className="text-xs text-white/20">{bio.length}/300</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 300))}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-neon-blue transition-colors resize-none"
                    placeholder="Tell the world what you do..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon-blue transition-colors"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Skills & Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map(skill => (
                      <span key={skill} className="bg-neon-blue/10 text-neon-blue text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                        {skill}
                        <button onClick={() => removeSkill(skill)}><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="Type a skill and press Enter"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Social Presence</h2>
                <p className="text-white/50">Where else can people find your work?</p>
              </div>

              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-grow">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateSocialLink(index, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon-blue transition-colors"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    {socialLinks.length > 1 && (
                      <button 
                        onClick={() => removeSocialLink(index)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                
                {socialLinks.length < 5 && (
                  <button 
                    onClick={addSocialLink}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add Link
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-12">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!username || !!usernameError)}
                className="px-8 py-3 bg-neon-blue text-black font-bold rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-neon-blue text-black font-bold rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Complete Setup</>}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
