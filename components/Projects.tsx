"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaArrowRight } from "react-icons/fa";

const jobProjects = [
  {
    imagePath: "/cicd.png",
    title: "Automated CI/CD Pipeline for Dockerized Applications",
    description:
      "Developed a CI/CD pipeline to automate the build, test, and deployment processes for a Node.js application, using GitHub Actions and Docker.",
    skills: [
      "GitHub Actions",
      "Docker",
      "Node.js",
      "AWS",
      "Terraform",
    ],
    link: "https://github.com/ank404/node-docker-CI-CD.git",
  },
  {
    imagePath: "/serverstat.png",
    title: "Server Stats - System Monitoring Tool",
    description:
      "The Server Stats project is a simple yet powerful Bash script designed to monitor and display essential server performance metrics. It provides real-time insights into system health, making it a valuable tool for administrators and enthusiasts managing Linux-based servers.",
    skills: [
      "Bash scripting",
      "Linux-based",
      "Linux tools",
    ],
    link: "https://github.com/ank404/server-stats.git",
  },
  {
    imagePath: "/swoop-og-banner.webp",
    title: "Dummy content",
    description:
      "Dummy content",
    skills: [
      "Next.js",
      "Framer",
      "Shadcn/ui",
      "Typescript",
      "JavaScript",
      "Vercel",
      "Figma",
    ],
    link: "https://github.com/ank404",
  },
  {
    imagePath: "/app-front-1.png",
    title: "Nonsense change",
    description:
      "Dummy content",
    skills: [
      "Next.js",
      "Typescript",
      "JavaScript",
      "MUI",
      "Tailwind CSS",
      "Vercel",
      "Figma",
    ],
    link: "https://github.com/ank404",
  },
  {
    imagePath: "/meikopoulos.com_PC.png",
    title: "Nonsense change",
    description:
      "Nonsense change",
    skills: ["Typescript", "JavaScript", "Tailwind CSS", "Vercel"],
    link: "https://github.com/ank404",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Projects
        </h2>
      </div>
      <>
        {jobProjects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:cursor-pointer"
          >
            <Card className="group lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200">
              <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
                <Image
                  src={project.imagePath}
                  alt={`Screenshot of ${project.title}`}
                  width={1920}
                  height={1080}
                  priority
                  className="bg-[#141414] mt-2 border border-muted-foreground rounded-[0.5rem]"
                />
              </CardHeader>
              <CardContent className="flex flex-col p-0 w-full lg:w-2/3">
                <p className="text-primary font-bold">
                  {project.title}{" "}
                  <FaArrowRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                </p>
                <CardDescription className="py-3 text-slate-950">
                  {project.description}
                </CardDescription>
                <CardFooter className="p-0 flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
                </CardFooter>
              </CardContent>
            </Card>
          </a>
        ))}
      </>
    </section>
  );
}
