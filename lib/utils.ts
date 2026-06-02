import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOptimizedImageUrl(url: string, width: number = 800, height: number = 600): string {
  if (!url || typeof url !== 'string') return url;
  
  // Optimize picsum.photos URLs
  if (url.includes('picsum.photos')) {
    // Replace dimensions like /800/600 or /1200/800 with specified width/height
    return url.replace(/\/\d+\/\d+$/, `/${width}/${height}`);
  }
  
  return url;
}

export function getSafeImageUrl(url: any, fallbackSeed?: string, options?: { width?: number, height?: number }): string {
  if (!url || typeof url !== 'string') {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${fallbackSeed || 'default'}`;
  }
  
  // Check for the known invalid string "ffffffffffffffff"
  if (url === "ffffffffffffffff" || url.trim() === "") {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${fallbackSeed || 'invalid'}`;
  }

  let finalUrl = url;

  // Basic URL validation or check for relative paths
  if (url.startsWith('http') || url.startsWith('https') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
    finalUrl = url;
  } else {
    // If it's a broken string that doesn't start with / or http, return fallback
    try {
      new URL(url);
      finalUrl = url;
    } catch (e) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${fallbackSeed || url.slice(0, 10)}`;
    }
  }

  if (options?.width) {
    finalUrl = getOptimizedImageUrl(finalUrl, options.width, options.height || options.width);
  }

  return finalUrl;
}
