"use client";

import { useState } from "react";
import { FadeIn } from "./ui/animations";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formState.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would send the form data to your server
      // For demo purposes, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success response
      setSubmitSuccess(true);
      setSubmitMessage("Thank you for your message! I'll get back to you soon.");
      setFormState({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitSuccess(false);
      setSubmitMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-primary lg:sr-only">
          Contact
        </h2>
      </div>      
      <div className="grid grid-cols-1 gap-6">
        <FadeIn direction="up" delay={100}>
          <div className="mb-8 relative">
            {/* Decorative element */}
            <div className="absolute left-0 top-0 h-12 w-1 bg-gradient-to-b from-primary/80 to-primary/0 rounded-full hidden lg:block"></div>
            
            <div className="lg:pl-8">
              <h3 className="text-2xl font-bold mb-3 font-heading">Contact Information</h3>
              <p className="text-muted-foreground">
                Interested in hiring me or have a project in mind? I'd love to hear from you! 
                Feel free to reach out through any of the channels below.
              </p>
            </div>
          </div>
            <Card className="h-full border border-border/80 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5 space-y-5 flex flex-col">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-colors border border-border/40 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-full flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-primary/30 transition-all">
                      <FaEnvelope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium font-heading">Email</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <a href="mailto:anupkhanal17@gmail.com" className="hover:text-primary hover:underline underline-offset-4 block transition-colors">
                      anupkhanal17@gmail.com
                    </a>
                  </div>
                </div>                <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-colors border border-border/40 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-full flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-primary/30 transition-all">
                      <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium font-heading">Location</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <p>Kathmandu, Nepal</p>
                  </div>
                </div>
                
                <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-colors border border-border/40 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-full flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-primary/30 transition-all">
                      <FaLinkedin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium font-heading">LinkedIn</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <a 
                      href="https://www.linkedin.com/in/anupkhanal/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline underline-offset-4 block transition-colors"
                    >
                      linkedin.com/in/anupkhanal
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-colors border border-border/40 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-full flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-primary/30 transition-all">
                      <FaGithub className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium font-heading">GitHub</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <a 
                      href="https://github.com/ank404" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline underline-offset-4 block transition-colors"
                    >
                      github.com/ank404
                    </a>
                  </div>
                </div>
              </div>
                <div className="pt-6 border-t border-border/30 mt-6">
                <p className="text-sm text-muted-foreground text-center px-4 py-3 bg-primary/5 rounded-lg">
                  Available for remote or on-site opportunities in the Kathmandu area.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
