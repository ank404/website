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
    "certifications",
    "testimonials",
    "resume",
    "contact",
  ]);

  const navItems: NavItem[] = [
    { name: "About", href: "#about" },
    { name: "Experience / Education", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Certifications", href: "#certifications" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Resume", href: "#resume" },
    { name: "Contact", href: "#contact" },
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
        <div className="w-full flex lg:items-center lg:justify-start"></div>
        <FadeIn direction="down" delay={200}>
          <h1 className="text-[38px] font-bold lg:text-start">Anup Khanal</h1>
        </FadeIn>
        <FadeIn direction="down" delay={400}>
          <h3 className="text-lg lg:text-start page-text">
            System Administrator & Aspiring DevOps Engineer.
          </h3>
        </FadeIn>
        <FadeIn delay={600}>
          <p className="mt-4 lg:text-start text-muted-foreground">
            I bring stability and innovation to IT infrastructure, specializing
            in system administration and cloud solutions. Currently advancing
            into DevOps to bridge traditional practices with modern automation.
          </p>
        </FadeIn>

        <nav className="nav hidden lg:block">
          <ul className="mt-16 flex flex-col space-y-5">
            {navItems.map((navItem, index) => (
              <FadeIn
                key={navItem.href}
                direction="left"
                delay={800 + index * 100}
              >
                <li>
                  <a
                    href={navItem.href}
                    className={`group flex items-center py-1 ${
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
      </div>

      <FadeIn
        direction="left"
        delay={1200}
        className="socials mt-8 flex flex-row items-center gap-4"
      >
        <ModeToggle />
        <a
          href="https://github.com/ank404"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <Button
            size="icon"
            variant="outline"
            aria-label="Github"
            className="rounded-full"
          >
            <FaGithub className="h-5 w-5" />
          </Button>
        </a>
        <a
          href="https://www.linkedin.com/in/anupkhanal/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110"
        >
          <Button
            size="icon"
            variant="outline"
            aria-label="LinkedIn"
            className="rounded-full"
          >
            <FaLinkedin className="h-5 w-5" />
          </Button>
        </a>
      </FadeIn>
    </header>
  );
}
