"use client";
import { useEffect, useRef, useState } from 'react';
import { useLenis } from '@/context/LenisContext';

// Hook for scroll-triggered animations
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

// Hook for parallax effects
export function useParallax(speed: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();
  
  useEffect(() => {
    if (!lenis || !ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const scrollPos = window.scrollY;
      const yPos = -scrollPos * speed;
      ref.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
    };

    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, speed]);

  return ref;
}

// Hook for custom cursor effects
export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState('default');

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      const { clientX, clientY } = e;
      cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    };

    window.addEventListener('mousemove', onMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return { cursorRef, cursorType, setCursorType };
}

// Hook for text animations (character by character reveal)
export function useTextReveal() {
  const textRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return { textRef, isRevealed };
}
