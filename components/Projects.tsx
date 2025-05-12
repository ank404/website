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
import { FadeIn } from "./ui/animations";

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
    imagePath: "/powercli.png",
    title: "PowerCLI - VMware Automation",
    description:
      "A collection of PowerCLI scripts for automating VMware vSphere ESXi and vCenter management tasks.",
    skills: [
      "Automation",
      "vmware",
      "esxi",
      "Powercli",
      "vcenter",
    ],
    link: "https://github.com/ank404/esxi-vcenter-scripts.git",
  },
  {
    imagePath: "/spotify-dashboard.png",
    title: "Spotify Session Dashboard",
    description:
      "A web application that provides insights into your Spotify listening habits, displaying top tracks, top artists, and personalized statistics.",
    skills: [
      "React",
      "Typescript",
      "Vite",
      "Tailwind CSS",
      "Radix UI",
      "Spotify Web API",
    ],
    link: "https://music.anupkhanal.info.np",
  },
  {
    imagePath: "/cicd.png",
    title: "Dummy Project",
    description:
      "Dummy project description",
    skills: ["Typescript", "JavaScript", "Tailwind CSS", "Vercel"],
    link: "https://github.com/ank404",
  },
];

export default function Projects() {
  return (
    <section className="relative" id="projects">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Projects
        </h2>
      </div>
      <div className="flex flex-col lg:px-6">
        {jobProjects.map((project, index) => (
          <FadeIn 
            key={project.title}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={200 + index * 100}
            className="group mb-10 last:mb-0"
          >
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover:cursor-pointer border-none shadow-none overflow-hidden transform transition-all duration-500 hover:translate-y-[-5px]">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={project.imagePath}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-700 scale-100 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <CardHeader className="p-0 space-y-1 mt-4">
                  <h3 className="text-base font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="hover:bg-primary/20 hover:text-primary transition-colors duration-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-0 mt-4">
                  <div className="flex items-center text-sm text-primary group-hover:underline">
                    View Project
                    <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
