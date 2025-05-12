"use client";
import { useState, useEffect } from "react";
import { FadeIn } from "./ui/animations";
import { Card, CardContent } from "./ui/card";
import { FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image: string;
  relationship: "colleague" | "client" | "manager";
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "Development Team Lead",
    company: "Tech Innovations Inc.",
    testimonial: "Anup is one of the most reliable system administrators I've worked with. His deep knowledge of server infrastructure and quick problem-solving skills have saved us countless hours of downtime. He's always willing to go the extra mile to ensure our systems are running smoothly.",
    image: "/testimonials/person1.jpg",
    relationship: "colleague"
  },
  {
    id: "2",
    name: "David Chen",
    position: "CTO",
    company: "CloudNest Solutions",
    testimonial: "Working with Anup on our cloud migration was a seamless experience. His methodical approach to planning and executing complex infrastructure projects is impressive. He has an exceptional ability to anticipate potential issues and address them before they become problems.",
    image: "/testimonials/person2.jpg",
    relationship: "manager"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    position: "Product Manager",
    company: "DataStream Corp",
    testimonial: "As a product manager, having a responsive and knowledgeable system administrator like Anup makes all the difference. He not only maintains our infrastructure flawlessly but also provides valuable insights for improving our deployment processes. His DevOps skills have significantly enhanced our product delivery pipeline.",
    image: "/testimonials/person3.jpg",
    relationship: "colleague"
  },
  {
    id: "4",
    name: "Michael Patel",
    position: "CEO",
    company: "WebSphere Hosting",
    testimonial: "We hired Anup as a consultant to help optimize our hosting infrastructure. His recommendations led to a 30% reduction in server costs while improving overall system performance. His expertise in both traditional system administration and modern DevOps practices is truly remarkable.",
    image: "/testimonials/person4.jpg",
    relationship: "client"
  }
];

export default function Testimonials() {
  const [activeTestimonials, setActiveTestimonials] = useState<Testimonial[]>(testimonials);
  const [activeFilter, setActiveFilter] = useState<"all" | "colleague" | "client" | "manager">("all");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeFilter === "all") {
      setActiveTestimonials(testimonials);
    } else {
      setActiveTestimonials(testimonials.filter(t => t.relationship === activeFilter));
    }
    setCurrentIndex(0);
  }, [activeFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % activeTestimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeTestimonials.length]);

  const currentTestimonial = activeTestimonials[currentIndex] || testimonials[0];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleFilterChange = (filter: "all" | "colleague" | "client" | "manager") => {
    setActiveFilter(filter);
  };
  return (
    <section id="testimonials" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary lg:sr-only">
          Testimonials
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-8 relative">
          {/* Decorative element */}
          <div className="absolute left-0 top-0 h-12 w-1 bg-gradient-to-b from-primary/80 to-primary/0 rounded-full hidden lg:block"></div>
          
          <div className="lg:pl-8">
            <h3 className="text-2xl font-bold mb-3 font-heading">What People Say</h3>
            <p className="text-muted-foreground">
              Feedback from colleagues, clients, and managers I've had the pleasure of working with.
            </p>
          </div>
        </div>
      </FadeIn>      <div className="mb-8 flex flex-wrap gap-3 p-4 border border-border bg-card/50 backdrop-blur-sm rounded-lg">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-muted/50 text-muted-foreground hover:bg-primary/10"
          }`}
        >
          All Testimonials
        </button>
        <button
          onClick={() => handleFilterChange("colleague")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === "colleague"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-primary/10"
          }`}
        >
          From Colleagues
        </button>
        <button
          onClick={() => handleFilterChange("client")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === "client"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-primary/10"
          }`}
        >
          From Clients
        </button>
        <button
          onClick={() => handleFilterChange("manager")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === "manager"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-primary/10"
          }`}
        >
          From Managers
        </button>
      </div>      <div className="relative">
        <FadeIn direction="up" delay={200} key={currentTestimonial.id}>
          <Card className="border border-border/40 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent shadow-sm">
            <CardContent className="p-8 relative">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-40">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/10">
                  <path d="M0 30.0005V60.0005H30H60V30.0005V0.000488281H30H0V30.0005ZM50 10.0005V20.0005H40H30V30.0005V40.0005H40H50V30.0005V20.0005H60H70V10.0005V0.000488281H60H50V10.0005ZM20 30.0005V40.0005H10H0V30.0005V20.0005H10H20V30.0005Z" fill="currentColor"/>
                </svg>
              </div>
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FaQuoteLeft className="text-primary h-6 w-6" />
                  </div>
                </div>
                
                <p className="text-lg italic leading-relaxed">"{currentTestimonial.testimonial}"</p>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted flex items-center justify-center text-muted-foreground shadow-sm border-2 border-white dark:border-gray-800">
                    {currentTestimonial.image ? (
                      <Image
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">{currentTestimonial.name.charAt(0)}</span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold font-heading">{currentTestimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentTestimonial.position}, {currentTestimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
          {activeTestimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {activeTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-primary/80 w-8 shadow-sm" 
                    : "bg-muted w-2 hover:bg-primary/40 hover:w-4"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Testimonials are collected from my previous work experiences and collaborations.
        </p>
      </div>
    </section>
  );
}
