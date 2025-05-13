"use client";
import Head from "next/head";
import Nav from "@/components/Nav";
import ExpCard from "@/components/ExpCards";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import ResumeDownload from "@/components/ResumeDownload";
import Terminal from "@/components/Terminal";
import LiveDashboard from "@/components/LiveDashboard";
import CloudArchitecture from "@/components/CloudArchitecture";
import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { useLenis } from "@/context/LenisContext";
import { FadeIn } from "@/components/ui/animations";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const auraRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();

  // Scroll to top on page load/refresh
  useEffect(() => {
    if (lenis) {
      // Use setTimeout to ensure this happens after the page is fully loaded
      setTimeout(() => {
        lenis.scrollTo(0, { immediate: true });
        console.log('Scrolled to top on page load');
      }, 0);
    }
  }, [lenis]);

  useEffect(() => {
    const updateAuraPosition = (e: MouseEvent) => {
      if (auraRef.current) {
        auraRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        auraRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };
    window.addEventListener("pointermove", updateAuraPosition);

    return () => {
      window.removeEventListener("pointermove", updateAuraPosition);
    };
  }, []);  // Add smooth scrolling to anchor links - but only for actual navigation links!
  useEffect(() => {
    if (!lenis) return;
    
    const handleAnchorClick = (e: MouseEvent) => {
      // Emergency check - if this is not a left click, don't handle it
      if (e.button !== 0) return;
      // Check if this is a click within the terminal component
      // If so, don't handle navigation unless explicitly clicking on a navigation link
      const target = e.target as HTMLElement;
      const terminalContent = document.querySelector('.terminal-content');
      if (terminalContent && terminalContent.contains(target)) {
        const isNavigationLink = target.tagName === 'A' || 
                              target.closest('a[href^="#"]');
        if (!isNavigationLink) {
          return; // Don't handle clicks inside terminal unless they're explicit navigation links
        }
      }
      
      // For other clicks, only process navigation links
      const isDirectClickOnAnchor = target.tagName === 'A' &&
                                 target.hasAttribute('href') && 
                                 target.getAttribute('href')?.startsWith('#');
      
      const isClickOnAnchorChild = target.parentElement?.tagName === 'A' && 
                                target.parentElement.hasAttribute('href') && 
                                target.parentElement.getAttribute('href')?.startsWith('#');
                                
      if (!isDirectClickOnAnchor && !isClickOnAnchorChild) {
        return; // Not clicking on a navigation element
      }
      
      // Get the anchor element
      const anchor = isDirectClickOnAnchor ? 
                   target : 
                   (isClickOnAnchorChild ? target.parentElement : null);
      
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      e.stopPropagation(); // Stop event from bubbling up
      
      const id = href;
      if (id && id !== '#') {
        const element = document.querySelector(id) as HTMLElement;
        if (element) {
          lenis.scrollTo(element, { 
            offset: -50,
            duration: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic ease out
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [lenis]);return (
    <>
      <Head>
        <style jsx global>{`
          body {
            font-family: "${inter.style.fontFamily}";
          }
        `}</style>
      </Head>
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-2] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-background via-background to-background/95"></div>
      <div ref={auraRef} className="mouse-aura" />
      
      {/* Decorative grid lines */}
      <div className="fixed inset-0 z-[-1] grid grid-cols-6 md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="border-r border-foreground/[0.03] last:border-r-0"></div>
        ))}
      </div>
      
      <div className="mx-auto min-h-screen max-w-screen-2xl px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-8">
          <Nav />
          
          <main className="flex flex-col pt-6 lg:pt-24 lg:w-3/5 lg:py-24 gap-16">
            <About />
            <ExpCard />
            <Projects />            <Skills />            <div className="flex flex-col gap-20">
              <Terminal />
              <LiveDashboard />            </div>
            <CloudArchitecture />
            <Certifications />
            <ResumeDownload />
            
            <footer className="mt-24 text-sm text-muted-foreground">
              <div className="border-t border-border pt-6">
                <p>© {new Date().getFullYear()} Anup Khanal. All rights reserved.</p>
                <p className="mt-1">Built with Next.js, Tailwind CSS and React</p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
