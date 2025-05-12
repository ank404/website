"use client";
import { useState } from "react";
import { FadeIn } from "./ui/animations";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FaDownload, FaEye } from "react-icons/fa";

export default function ResumeDownload() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const resumeFormats = [
    { name: "PDF Format", icon: "pdf", path: "/resume-anup-khanal.pdf" },
    { name: "Word Format", icon: "docx", path: "/resume-anup-khanal.docx" }
  ];

  return (
    <section id="resume" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Resume
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <Card className="overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold">Download My Resume</h3>
                <p className="text-muted-foreground mt-2">
                  Get a comprehensive overview of my skills, experience, and qualifications.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {resumeFormats.map(format => (
                  <a 
                    key={format.icon}
                    href={format.path} 
                    download 
                    className="no-underline"
                  >
                    <Button variant="outline" className="gap-2 border-primary/20 transition-all hover:border-primary hover:shadow-sm">
                      <FaDownload className="h-4 w-4" />
                      {format.name}
                    </Button>
                  </a>
                ))}
                
                <Button 
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <FaEye className="h-4 w-4" />
                  Preview Resume
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Last updated: May 1, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
      
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Resume Preview</h3>
              <Button
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-1">
              <iframe
                src="/resume-anup-khanal.pdf"
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
