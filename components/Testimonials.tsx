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
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Testimonials
        </h2>
      </div>

      <FadeIn direction="up" delay={100}>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">What People Say</h3>
          <p className="text-muted-foreground">
            Feedback from colleagues, clients, and managers I've had the pleasure of working with.
          </p>
        </div>
      </FadeIn>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("colleague")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            activeFilter === "colleague"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Colleagues
        </button>
        <button
          onClick={() => handleFilterChange("client")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            activeFilter === "client"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Clients
        </button>
        <button
          onClick={() => handleFilterChange("manager")}
          className={`px-4 py-1 rounded-full text-sm transition-all ${
            activeFilter === "manager"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Managers
        </button>
      </div>

      <div className="relative">
        <FadeIn direction="up" delay={200} key={currentTestimonial.id}>
          <Card className="border-none bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <FaQuoteLeft className="text-primary/20 h-8 w-8" />
                </div>
                <p className="text-lg italic">"{currentTestimonial.testimonial}"</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center text-muted-foreground">
                    {currentTestimonial.image ? (
                      <Image
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      currentTestimonial.name.charAt(0)
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">{currentTestimonial.name}</h4>
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
          <div className="flex justify-center gap-2 mt-4">
            {activeTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-6" : "bg-muted hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
