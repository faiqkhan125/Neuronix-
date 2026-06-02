"use client";

import React, { useState, useMemo } from 'react';
import Image, { ImageProps } from 'next/image';
import { getSafeImageUrl } from '@/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: any;
  fallbackSeed?: string;
  width?: number;
  height?: number;
}

export const SafeImage = React.memo(({ 
  src, 
  alt, 
  fallbackSeed, 
  className, 
  width, 
  height, 
  priority = false,
  ...props 
}: SafeImageProps) => {
  const [error, setError] = useState(false);
  
  const safeSrc = useMemo(() => {
    // If error, use fallback
    if (error) return getSafeImageUrl(null, fallbackSeed || alt);
    
    // Pass width/height to getSafeImageUrl for optimization (e.g. picsum resizing)
    return getSafeImageUrl(src, fallbackSeed || alt, { width, height });
  }, [src, error, fallbackSeed, alt, width, height]);

  // If fill is true, we should not pass width or height to the Image component
  const imageProps = {
    ...props,
    src: safeSrc,
    alt,
    priority,
    className,
    onError: () => {
      console.warn(`SafeImage: Failed to load ${src}, using fallback.`);
      setError(true);
    },
    referrerPolicy: "no-referrer" as const,
  };

  if (!props.fill) {
    (imageProps as any).width = width;
    (imageProps as any).height = height;
  }

  return (
    <Image {...imageProps} alt={alt || ""} />
  );
});

SafeImage.displayName = 'SafeImage';
