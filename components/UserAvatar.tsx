"use client";

import React from 'react';
import { SafeImage } from './SafeImage';

interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: number | string;
  className?: string;
  textClassName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  name = "User", 
  size = 40, 
  className = "",
  textClassName = ""
}) => {
  const firstLetter = name.trim().charAt(0).toUpperCase();
  const dimension = typeof size === 'number' ? `${size}px` : size;

  const hasImage = src && src.trim() !== '' && !src.includes('api.dicebear.com');

  if (hasImage) {
    return (
      <div 
        className={`relative overflow-hidden shrink-0 ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        <SafeImage 
          src={src} 
          alt={name} 
          fill 
          className="object-cover" 
        />
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center shrink-0 bg-gradient-to-br from-neon-blue to-neon-purple text-black font-black uppercase tracking-tighter ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <span className={textClassName || (typeof size === 'number' && size < 40 ? 'text-sm' : 'text-xl')}>
        {firstLetter}
      </span>
    </div>
  );
};
