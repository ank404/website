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
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Certifications
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Professional Certifications</h3>
          <p className="text-muted-foreground">
            Credentials that validate my expertise and commitment to professional development.
          </p>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={200}>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className="cursor-pointer text-sm px-3 py-1"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCertificates.map((cert, index) => (
          <FadeIn key={cert.id} direction="up" delay={300 + index * 50}>
            <Card 
              className={`cursor-pointer transition-all ${
                expandedCert === cert.id ? 'border-primary shadow-lg' : 'hover:border-primary/50'
              }`}
              onClick={() => handleCertClick(cert.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs">{
                        cert.category === "cloud" ? "Cloud" :
                        cert.category === "devops" ? "DevOps" :
                        cert.category === "system" ? "System" : "Other"
                      }</Badge>
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
