"use client";
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function usePageLoader(options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const {
    minLoadingTime = 300, // Minimum time to show loader (ms)
    enableOnNavigation = true, // Enable automatic loading on navigation
    enableOnSearchParams = true, // Enable loading when search params change
  } = options;

  useEffect(() => {
    if (!enableOnNavigation) return;

    // Set loading when pathname changes
    setIsLoading(true);
    
    // Minimum loading time to prevent flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [pathname, enableOnNavigation, minLoadingTime]);

  useEffect(() => {
    if (!enableOnSearchParams) return;

    // Set loading when search params change
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [searchParams, enableOnSearchParams, minLoadingTime]);

  // Manual control functions
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const setLoading = (loading) => setIsLoading(loading);

  return { 
    isLoading, 
    setIsLoading,
    startLoading,
    stopLoading,
    setLoading
  };
} 