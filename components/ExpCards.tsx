"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";
import { FadeIn, RevealText } from "./ui/animations";

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
    <section className="relative" id="exp">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Experience
        </h2>
      </div>
      <div className="flex flex-col lg:px-6">
        {jobPositions.map((job, index) => (
          <FadeIn 
            key={job.currentPosition} 
            direction="up" 
            delay={index * 200}
            className="mb-10 lg:mb-4 group"
          >
            <Card className="border-none shadow-none overflow-hidden transition-all duration-500 hover:translate-y-[-5px]">
              <CardHeader className="p-0 space-y-1 mb-3 group-hover:text-primary transition-colors duration-300">
                <div className="flex justify-between">
                  <CardTitle className="text-base font-semibold tracking-tight">
                    {job.currentPosition}
                  </CardTitle>
                  <Badge className="rounded-full">{job.timeline}</Badge>
                </div>
                <CardDescription className="flex text-sm leading-7">
                  <span>{job.place}</span>
                  <span className="text-primary">
                    <MoveRight className="ml-1" size={15} />
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 text-sm">
                <p className="text-muted-foreground mb-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="animate-in hover:bg-primary/20 hover:text-primary transition-colors duration-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
