"use client";
import { useState } from "react";
import { FadeIn } from "./ui/animations";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Button } from "./ui/button";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialUrl?: string;
  category: "cloud" | "devops" | "system" | "other";
}

const certificates: Certificate[] = [
  {
    id: "aws-cloud-pract",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2023",
    imageUrl: "/aws-certified-cloud-practitioner.png",
    credentialUrl: "https://www.credly.com/badges/aws-certified-cloud-practitioner",
    category: "cloud"
  },
  {
    id: "vmware-vcp",
    title: "VMware Certified Professional - DCV",
    issuer: "VMware",
    date: "2022",
    imageUrl: "/vmware-certified-professional.png",
    credentialUrl: "https://www.credly.com/badges/vmware-certified-professional-datacenter-virtualization",
    category: "system"
  },
  {
    id: "linux-admin",
    title: "LPIC-1 Linux Administrator",
    issuer: "Linux Professional Institute",
    date: "2021",
    imageUrl: "/lpic-1.png",
    credentialUrl: "https://www.lpi.org/our-certifications/lpic-1-overview",
    category: "system"
  },
  {
    id: "docker-certification",
    title: "Docker Certified Associate",
    issuer: "Docker, Inc",
    date: "2022",
    imageUrl: "/docker-certified-associate.png", 
    credentialUrl: "https://credentials.docker.com/docker-certified-associate",
    category: "devops"
  }
];

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedCert, setExpandedCert] = useState<string | null>(null);

  const filteredCertificates = activeCategory === "all" 
    ? certificates 
    : certificates.filter(cert => cert.category === activeCategory);

  const categories = [
    { id: "all", label: "All Certifications" },
    { id: "cloud", label: "Cloud" },
    { id: "devops", label: "DevOps" },
    { id: "system", label: "System" },
    { id: "other", label: "Other" }
  ];

  const handleCertClick = (id: string) => {
    if (expandedCert === id) {
      setExpandedCert(null);
    } else {
      setExpandedCert(id);
    }
  };
  return (
    <section id="certifications" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary lg:sr-only">
          Certifications
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-8 relative">
          {/* Decorative element */}
          <div className="absolute left-0 top-0 h-12 w-1 bg-gradient-to-b from-primary/80 to-primary/0 rounded-full hidden lg:block"></div>
          
          <div className="lg:pl-8">
            <h3 className="text-2xl font-bold mb-3 font-heading">Professional Certifications</h3>
            <p className="text-muted-foreground">
              Credentials that validate my expertise and commitment to professional development.
            </p>
          </div>
        </div>
      </FadeIn>      <FadeIn direction="up" delay={200}>
        <div className="flex flex-wrap gap-2 mb-8 p-4 border border-border bg-card/50 backdrop-blur-sm rounded-lg">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`cursor-pointer text-sm px-3 py-1 transition-all ${
                activeCategory === category.id 
                  ? 'shadow-sm' 
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </FadeIn>      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCertificates.map((cert, index) => (
          <FadeIn key={cert.id} direction="up" delay={300 + index * 50}>
            <Card 
              className={`cursor-pointer transition-all duration-300 overflow-hidden relative group ${
                expandedCert === cert.id 
                  ? 'border-primary shadow-lg bg-card' 
                  : 'hover:border-primary/30 bg-card/50 hover:shadow-md'
              }`}
              onClick={() => handleCertClick(cert.id)}
            >
              {/* Top colored border based on category */}
              <div className={`absolute top-0 left-0 h-1 w-full ${
                cert.category === "cloud" ? 'bg-blue-500/70' :
                cert.category === "devops" ? 'bg-purple-500/70' :
                cert.category === "system" ? 'bg-green-500/70' : 'bg-amber-500/70'
              }`}></div>
              
              <CardContent className="p-5 pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg font-heading">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${
                          cert.category === "cloud" ? 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' :
                          cert.category === "devops" ? 'border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300' :
                          cert.category === "system" ? 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 
                          'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {cert.category === "cloud" ? "Cloud" :
                         cert.category === "devops" ? "DevOps" :
                         cert.category === "system" ? "System" : "Other"}
                      </Badge>
                    </div>
                  </div>

                  {expandedCert === cert.id && (
                    <div className="flex flex-col gap-4">
                      <div className="relative h-40 w-full">
                        <Image 
                          src={cert.imageUrl} 
                          alt={cert.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      
                      {cert.credentialUrl && (
                        <div className="flex justify-end">
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            window.open(cert.credentialUrl, '_blank');
                          }}>
                            <FaExternalLinkAlt className="mr-2 h-4 w-4" />
                            Verify
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn direction="up" delay={500} className="mt-6">
        <p className="text-sm text-muted-foreground text-center">
          Click on any certification to view more details and verify credentials.
        </p>
      </FadeIn>
    </section>
  );
}
