"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null, base64: string | null) => void;
  value?: string | null;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  previewClassName?: string;
}

export const FileUpload = ({ 
  onFileSelect, 
  value, 
  label = "Upload Image", 
  className,
  accept = "image/*",
  maxSizeMB = 5,
  previewClassName = "aspect-video"
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Max size is ${maxSizeMB}MB`);
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onFileSelect(file, base64);
      setLoading(false);
    };
    reader.onerror = () => {
      setLoading(false);
      alert("Failed to read file");
    };
    reader.readAsDataURL(file);
  }, [maxSizeMB, onFileSelect]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
          {label}
        </label>
      )}
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          "border-2 border-dashed rounded-3xl overflow-hidden",
          isDragging ? "border-neon-blue bg-neon-blue/10 scale-[1.02]" : "border-white/10 bg-white/5 hover:border-white/20",
          value ? "border-solid" : "hover:scale-[1.01]"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept={accept}
          className="hidden"
        />

        {value ? (
          <div className={cn("relative w-full overflow-hidden group/preview", previewClassName)}>
            <SafeImage 
              src={value} 
              alt="Uploaded file" 
              fill 
              className="object-cover" 
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
              <Upload className="text-white mb-2" size={24} />
              <p className="text-white text-xs font-bold font-black uppercase tracking-widest">Change Image</p>
            </div>

            {/* Clear Button */}
            <button
              onClick={clearFile}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-20"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className={cn("flex flex-col items-center justify-center p-8 sm:p-12 text-center", previewClassName)}>
            {loading ? (
              <Loader2 className="text-neon-blue animate-spin mb-4" size={40} />
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-neon-blue/50 group-hover:bg-neon-blue/10 transition-all">
                  <Upload className="text-white/20 group-hover:text-neon-blue transition-colors" size={28} />
                </div>
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight mb-1">Click or Drag & Drop</h3>
                <p className="text-[10px] sm:text-xs text-white/40 max-w-[200px] mx-auto leading-relaxed">
                  Support JPEG, PNG, WEBP. Max {maxSizeMB}MB.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
