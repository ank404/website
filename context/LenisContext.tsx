"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType>({ lenis: null });

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });    // Add event listeners for handling scroll position
    if (typeof window !== 'undefined') {
      // Ensure manual scroll restoration
      window.history.scrollRestoration = 'manual';
      
      // Reset scroll position on page unload
      window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
      });
      
      // Ensure we start at the top on page load
      window.addEventListener('load', () => {
        // Immediate scroll
        window.scrollTo(0, 0);
        lenisInstance.scrollTo(0, { immediate: true, force: true });
        
        // Remove any hash to prevent automatic scrolling to anchors
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        
        // Delayed scroll to ensure it happens after everything else
        setTimeout(() => {
          window.scrollTo(0, 0);
          lenisInstance.scrollTo(0, { immediate: true, force: true });
        }, 100);
      });
      
      // Override any automatic browser scroll restoration
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    }

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
};
