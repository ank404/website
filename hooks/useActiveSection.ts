import { useState, useEffect } from 'react';

const useActiveSection = (sectionIds: string[]): string => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // Function to determine which section is currently in view
    const handleScroll = () => {
      // Get all sections we want to track
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(section => section !== null) as HTMLElement[];
      
      if (sections.length === 0) return;

      // Get the position of each section relative to the viewport
      const sectionPositions = sections.map(section => {
        const rect = section.getBoundingClientRect();
        return {
          id: section.id,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          // Calculate how much of the section is in the viewport
          visiblePercentage: (
            Math.min(rect.bottom, window.innerHeight) - 
            Math.max(rect.top, 0)
          ) / rect.height
        };
      });
      
      // Find the section that has the most visibility in the viewport
      let currentSection = sectionPositions.reduce((prev, current) => {
        // If current section is more visible than previous winner
        return current.visiblePercentage > prev.visiblePercentage ? current : prev;
      }, { id: '', visiblePercentage: 0 });
      
      // If top of the page and first section not yet in view, set the first section as active
      if (window.scrollY < 100 && sectionPositions[0]?.top > 0) {
        currentSection = { id: sectionPositions[0].id, visiblePercentage: 1 };
      }
      
      // If bottom of page, set last section as active
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        currentSection = { id: sectionPositions[sectionPositions.length - 1].id, visiblePercentage: 1 };
      }
      
      // Only update if we have a section with decent visibility (at least 20%)
      if (currentSection.visiblePercentage > 0.2) {
        setActiveSection(currentSection.id);
        console.log(`Active section set to: ${currentSection.id} (${(currentSection.visiblePercentage * 100).toFixed(0)}% visible)`);
      }
    };

    // Add event listener for scrolling
    window.addEventListener('scroll', handleScroll);
    
    // Call after a delay to allow page to settle into its initial scroll position
    // This prevents the hook from affecting initial scroll behavior
    let initialSectionSet = false;
    
    const initialScrollTimer = setTimeout(() => {
      if (window.scrollY < 100) {
        // If near the top of the page, set the first section as active without running full detection
        const firstSection = sectionIds[0];
        if (firstSection) {
          setActiveSection(firstSection);
          console.log(`Initial active section set to: ${firstSection} (page top)`);
        }
      } else {
        // Otherwise run the normal detection
        handleScroll();
      }
      initialSectionSet = true;
    }, 500);
    
    // Clean up event listener and timer on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(initialScrollTimer);
    };
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds]);

  return activeSection;
};

export default useActiveSection;
