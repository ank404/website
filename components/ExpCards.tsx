"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";

const jobPositions = [
  {
    timeline: "2018 – Present",
    currentPosition: "System Administrator",
    place: "Silver Lining Pvt. Ltd",
    previousPositions: [""],
    description:
      "Oversee and maintain a large-scale data center infrastructure, managing over 100 physical and virtual servers to ensure optimal performance and stability. Responsibilities include installation, configuration, and administration of VMware vSphere environments, cPanel hosting, and email servers. Implement proactive monitoring systems and collaborate on disaster recovery planning to ensure seamless IT operations.",
    skills: [
      "Data Center Management",
      "Server Administration",
      "VMware vSphere",
      "cPanel Hosting",
      "Email Server Management",
      "Linux Systems",
      "Disaster Recovery Planning",
      "Proactive Monitoring",
    ],
  },
  {
    timeline: "2019",
    currentPosition: "Bachelors in Information Technology (Network and Security)",
    place: "Islington College, Kamalpokhari, Kathmandu",
    previousPositions: [""],
    description:
      "Completed a comprehensive program focusing on network and security, equipping me with the foundational knowledge and skills essential for managing and securing IT infrastructures.",
    skills: [
      "Network Security",
      "Information Technology",
      "System Administration",
      "Cybersecurity",
      "Technical Support",
    ],
  },
  {
    timeline: "2015",
    currentPosition: "Intermediate: Management",
    place: "Reliance International College, Chabahil, Kathmandu",
    previousPositions: [""],
    description:
      "Developed a strong foundation in management principles, enhancing my ability to effectively oversee IT projects and collaborate with cross-functional teams.",
    skills: [
      "Management Principles",
      "Project Coordination",
      "Team Collaboration",
      "Leadership",
    ],
  },
  {
    timeline: "2013",
    currentPosition: "SLC",
    place: "Bhanubhakta Memorial Higher Secondary School, Panipokhari, Kathmandu",
    previousPositions: [""],
    description:
      "Completed secondary education with a focus on science and mathematics, laying the groundwork for a career in information technology.",
    skills: [
      "Analytical Skills",
      "Problem-Solving",
      "Scientific Knowledge",
      "Mathematical Proficiency",
    ],
  },
];

export default function ExpCard() {
  return (
    <section id="experience" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Experience
        </h2>
      </div>
      <>
        {jobPositions.map((job, index) => (
          <Card
            key={index}
            className="lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200"
          >
            <CardHeader className="h-full w-full p-0">
              <CardTitle className="text-base page-text whitespace-nowrap">
                {job.timeline}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col p-0">
              <p className="text-foreground font-bold">
                {job.currentPosition} • {job.place}
              </p>
              {job.previousPositions.map((position, index) => (
                <p key={index} className="text-slate-400 text-sm font-bold">
                  {position}
                </p>
              ))}
              <CardDescription className="py-3 text-slate-950 dark:text-slate-200">
                {job.description}
              </CardDescription>
              <CardFooter className="p-0 flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index}>{skill}</Badge>
                ))}
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </>
      <div className="lg:px-12 mt-12">
        <a
          href="mailto:anupkhanal40@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-medium leading-tight text-foreground group"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            Reach out for Full Resume
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </a>
      </div>
    </section>
  );
}
