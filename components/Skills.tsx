"use client";
import { useState } from 'react';
import { FadeIn } from "./ui/animations";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

type SkillCategory = 'system' | 'cloud' | 'devops' | 'networking' | 'security' | 'other';

interface Skill {
  name: string;
  level: number; // 1-10
  category: SkillCategory;
  description: string;
}

const skills: Skill[] = [
  // System Administration
  { name: "Linux Administration", level: 9, category: "system", description: "Expert in Linux server management, shell scripting, and system optimization" },
  { name: "Windows Server", level: 8, category: "system", description: "Proficient in managing Windows Server environments, Active Directory, and Group Policy" },
  { name: "VMware vSphere", level: 9, category: "system", description: "Advanced virtualization management, HA/DRS configuration, and ESXi optimization" },
  { name: "Server Hardware", level: 8, category: "system", description: "Expert knowledge of server hardware, RAID configurations, and troubleshooting" },
  
  // Cloud Computing
  { name: "AWS", level: 7, category: "cloud", description: "EC2, S3, RDS, Lambda, CloudFormation, and VPC configuration" },
  { name: "Azure", level: 6, category: "cloud", description: "Virtual Machines, Blob Storage, Azure AD, and networking" },
  { name: "GCP", level: 5, category: "cloud", description: "Compute Engine, Cloud Storage, and basic GCP services" },
  
  // DevOps
  { name: "Docker", level: 8, category: "devops", description: "Container creation, management, and optimization" },
  { name: "Kubernetes", level: 7, category: "devops", description: "Orchestration, deployment strategies, and cluster management" },
  { name: "CI/CD", level: 7, category: "devops", description: "Pipeline creation with GitHub Actions, Jenkins, and GitLab CI" },
  { name: "Infrastructure as Code", level: 6, category: "devops", description: "Terraform, Ansible, and CloudFormation" },
  { name: "Git", level: 8, category: "devops", description: "Version control workflow, branching strategies, and collaboration" },
  
  // Networking
  { name: "Network Management", level: 8, category: "networking", description: "IP networking, subnetting, routing, and troubleshooting" },
  { name: "Firewall Configuration", level: 8, category: "networking", description: "Rule management, security policies, and traffic filtering" },
  { name: "Load Balancing", level: 7, category: "networking", description: "Traffic distribution, high availability, and failover configuration" },
  
  // Security
  { name: "Security Hardening", level: 8, category: "security", description: "System hardening, security best practices, and vulnerability management" },
  { name: "SSL/TLS", level: 7, category: "security", description: "Certificate management, implementation, and troubleshooting" },
  { name: "Monitoring", level: 7, category: "security", description: "System monitoring, alerting, and performance optimization" },
  
  // Other
  { name: "Bash/PowerShell", level: 8, category: "other", description: "Automation scripting, task scheduling, and process optimization" },
  { name: "Problem Solving", level: 9, category: "other", description: "Analytical thinking and complex problem resolution" },
  { name: "Documentation", level: 8, category: "other", description: "Technical documentation and knowledge base management" },
];

const categoryLabels: Record<SkillCategory, string> = {
  system: "System Administration",
  cloud: "Cloud Computing",
  devops: "DevOps",
  networking: "Networking",
  security: "Security",
  other: "Other Skills"
};

const categoryColors: Record<SkillCategory, string> = {
  system: "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
  cloud: "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100",
  devops: "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100",
  networking: "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100",
  security: "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100",
  other: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  
  const categories: (SkillCategory | 'all')[] = ['all', 'system', 'cloud', 'devops', 'networking', 'security', 'other'];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Skills
        </h2>
      </div>
      
      <FadeIn direction="up" delay={100}>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Technical Expertise</h3>
          <p className="text-muted-foreground">
            My technical skills span system administration, DevOps practices, cloud platforms, and security. 
            Click on any category below to filter or on a specific skill to see more details.
          </p>
        </div>
      </FadeIn>
      
      <FadeIn direction="up" delay={200}>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category, index) => (
            <Badge 
              key={category} 
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer text-sm px-3 py-1"
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'All Skills' : categoryLabels[category]}
            </Badge>
          ))}
        </div>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill, index) => (
          <FadeIn key={skill.name} direction="up" delay={300 + index * 50} className="h-full">
            <Card 
              className={`cursor-pointer h-full border-l-4 hover:shadow-md transition-all ${
                activeSkill?.name === skill.name 
                ? `border-l-primary ${categoryColors[skill.category]}` 
                : `border-l-muted-foreground/20 hover:border-l-primary/50`
              }`}
              onClick={() => setActiveSkill(activeSkill?.name === skill.name ? null : skill)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{skill.name}</h4>
                  <Badge variant="outline" className={`${categoryColors[skill.category]} border-none`}>
                    {skill.level}/10
                  </Badge>
                </div>
                
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${skill.level * 10}%` }}
                  />
                </div>
                
                {activeSkill?.name === skill.name && (
                  <p className="mt-3 text-sm text-muted-foreground">{skill.description}</p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
