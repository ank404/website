"use client";
import React, { useRef, useState, useEffect } from "react";
import { useScrollReveal, useTextReveal } from "@/hooks/useAnimations";
import { useLenis } from "@/context/LenisContext";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  direction = "up" 
}: FadeInProps) {
  const { ref, isVisible } = useScrollReveal();

  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: ""
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out opacity-0",
        directionClasses[direction],
        isVisible && "opacity-100 translate-x-0 translate-y-0",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export function RevealText({ 
  text, 
  className, 
  delay = 0, 
  staggerDelay = 20,
  tag = 'p'
}: RevealTextProps) {
  const { textRef, isRevealed } = useTextReveal();
  const Tag = tag;

  return (
    <Tag ref={textRef} className={cn("overflow-hidden", className)}>
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={cn(
            "inline-block transition-all duration-500 ease-out opacity-0 translate-y-4",
            isRevealed && "opacity-100 translate-y-0"
          )}
          style={{ 
            transitionDelay: `${delay + (index * staggerDelay)}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className, speed = 0.05 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { lenis } = useLenis();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  return (
    <div ref={ref} className={cn(className)}>
      <div 
        className={cn(
          "transition-all duration-700 ease-out opacity-0 translate-y-4",
          isVisible && "opacity-100 translate-y-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
