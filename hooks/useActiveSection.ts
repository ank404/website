import { useState, useEffect } from 'react';

const useActiveSection = (sectionIds: string[]): string => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(`Section: ${entry.target.id}, isIntersecting: ${entry.isIntersecting}`);
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            console.log(`Active section updated: ${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
        console.log(`Observing section: ${sectionId}`);
      } else {
        console.warn(`Section not found: ${sectionId}`);
      }
    });

    return () => {
      console.log('Disconnecting observer');
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
};

export default useActiveSection;
