"use client";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { ModeToggle } from "./ui/toggle-mode";
import useActiveSection from "@/hooks/useActiveSection";
import { FadeIn } from "./ui/animations";

type NavItem = {
  name: string;
  href: string;
};

export default function Nav() {  const activeSection = useActiveSection([
    "about",
    "experience",
    "projects",
    "skills",
    "terminal-demo",
    "infrastructure-dashboard",
    "architecture-diagram",
    "certifications",
    "resume",
  ]);const navItems: NavItem[] = [
    { name: "About", href: "#about" },
    { name: "Experience / Education", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Terminal", href: "#terminal-demo" },
    { name: "Infrastructure Dashboard", href: "#infrastructure-dashboard" },
    { name: "Architecture Diagram", href: "#architecture-diagram" },
    { name: "Certifications", href: "#certifications" },
    { name: "Resume", href: "#resume" },
  ];

  const getNavItemClasses = (href: string) => {
    const isActive = activeSection === href.substring(1);
    return {
      linkClass: isActive ? "active" : "",
      indicatorClass: `nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all ${
        isActive
          ? "active w-16 bg-foreground h-2"
          : "group-hover:w-16 group-hover:bg-foreground group-hover:h-px"
      }`,
      textClass: `nav-text text-xs font-bold uppercase tracking-widest ${
        isActive
          ? "page-text"
          : "text-slate-600 group-hover:page-text"
      }`,
    };
  };
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-2/5 lg:flex-col lg:justify-between lg:py-24 flex flex-col lg:gap-4">
      <div className="flex flex-col gap-6 lg:pr-12 mt-6 lg:mt-0 relative group">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
        
        <div className="relative">
          <FadeIn direction="down" delay={200}>
            <h1 className="text-4xl md:text-5xl font-bold lg:text-start font-heading">
              <span className="highlight-gradient">Anup Khanal</span>
            </h1>
          </FadeIn>
          
          <FadeIn direction="down" delay={400}>
            <h3 className="text-xl mt-2 lg:text-start page-text font-medium">
              System Administrator & <span className="highlight-gradient font-semibold">DevOps</span> Engineer
            </h3>
          </FadeIn>
          
          <FadeIn delay={600}>
            <p className="mt-4 lg:text-start text-muted-foreground leading-relaxed">
              I bring stability and innovation to IT infrastructure, specializing
              in system administration and cloud solutions. Currently advancing
              into DevOps to bridge traditional practices with modern automation.
            </p>
          </FadeIn>
          
          <FadeIn delay={700}>
            <div className="flex items-center gap-4 mt-6">
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href="https://github.com/anupkhanal" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FaGithub className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <a href="https://linkedin.com/in/anupkhanal" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </Button>
              <ModeToggle />
            </div>
          </FadeIn>
        </div>

        <nav className="nav hidden lg:block relative">
          <ul className="mt-8 flex flex-col space-y-3">
            {navItems.map((navItem, index) => (
              <FadeIn
                key={navItem.href}
                direction="left"
                delay={800 + index * 100}
              >
                <li>
                  <a
                    href={navItem.href}
                    className={`group flex items-center py-2 px-3 rounded-lg transition-all duration-200 hover:bg-primary/10 ${
                      getNavItemClasses(navItem.href).linkClass
                    }`}
                  >
                    <div className="flex flex-row items-center">
                      <span
                        className={
                          getNavItemClasses(navItem.href).indicatorClass
                        }
                      ></span>
                      <span
                        className={getNavItemClasses(navItem.href).textClass}
                      >
                        {navItem.name}
                      </span>
                    </div>
                  </a>
                </li>
              </FadeIn>
            ))}
          </ul>
        </nav>
      </div>      {/* Mobile Navigation Menu */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
        <div className="flex justify-around items-center p-3">
          {navItems.slice(0, 5).map((item) => (
            <a 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center px-2 py-1 rounded-md ${
                activeSection === item.href.substring(1) 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              <span className="text-xs font-medium">{item.name.split(' ')[0]}</span>
            </a>
          ))}
          
          {/* Dropdown for more sections */}
          <div className="relative group">
            <button className="flex flex-col items-center px-2 py-1 rounded-md text-muted-foreground">
              <span className="text-xs font-medium">More</span>
            </button>
            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full right-0 mb-2 bg-popover border border-border rounded-lg p-2 shadow-lg w-40">
              {navItems.slice(5).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-sm rounded-md ${
                    activeSection === item.href.substring(1)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Footer */}
      <FadeIn
        direction="left"
        delay={1200}
        className="mt-auto hidden lg:block py-4 text-sm text-muted-foreground"
      >
        <p>© {new Date().getFullYear()} Anup Khanal</p>
        <p className="mt-1">All rights reserved</p>
      </FadeIn>
    </header>
  );
}
