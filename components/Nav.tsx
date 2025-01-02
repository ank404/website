"use client";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { ModeToggle } from "./ui/toggle-mode";
import useActiveSection from "@/hooks/useActiveSection";

type NavItem = {
  name: string;
  href: string;
};

export default function Nav() {
  const activeSection = useActiveSection([
    "about",
    "experience",
    "projects",
  ]);

  const navItems: NavItem[] = [
    { name: "About", href: "#about" },
    { name: "Experience / Education", href: "#experience" },
    { name: "Projects", href: "#projects" },
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
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 flex flex-col lg:gap-4">
      <div className="flex flex-col gap-4 lg:pr-24 mt-6 lg:mt-0">
        <div className="w-full flex lg:items-center lg:justify-start">
        </div>
        <h1 className="text-[38px] font-bold lg:text-start">
          Anup Khanal
        </h1>
        <h3 className="text-lg lg:text-start page-text">
        System Administrator & Aspiring DevOps Engineer.
        </h3>
        <p className="text-base lg:text-start page-text">
          With over five years of experience in data center operations, server
          management, and virtualization, I specialize in building secure,
          scalable, and efficient IT infrastructures. Currently expanding my
          expertise in cloud migration, containerization, and DevOps practices.
        </p>
      </div>
      <nav className="lg:flex hidden">
        <ul className="flex flex-col w-max text-start gap-6 uppercase text-xs font-medium">
          {navItems.map((item: NavItem) => {
            const { linkClass, indicatorClass, textClass } = getNavItemClasses(
              item.href
            );
            return (
              <li key={item.name} className="group">
                <a href={item.href} className={`py-3 ${linkClass}`}>
                  <span className={indicatorClass}></span>
                  <span className={textClass}>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <ul className="flex flex-row gap-6 mt-6 lg:mt-0">
        <Button variant="outline" size="icon">
          <a
            href="https://github.com/ank404"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="h-[1.2rem] w-[1.2rem]" />
          </a>
        </Button>
        <Button variant="outline" size="icon">
          <a
            href="https://linkedin.com/in/anup-khanal-9587b3169"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="h-[1.2rem] w-[1.2rem]" />
          </a>
        </Button>
        <ModeToggle />
      </ul>
    </header>
  );
}
