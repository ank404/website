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
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Contact
        </h2>
      </div>      
      <div className="grid grid-cols-1 gap-6">
        <FadeIn direction="up" delay={100}>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Contact Information</h3>
            <p className="text-muted-foreground">
              Interested in hiring me or have a project in mind? I'd love to hear from you! 
              Feel free to reach out through any of the channels below.
            </p>
          </div>
          
          <Card className="h-full">
            <CardContent className="p-3 space-y-3 flex flex-col">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <FaEnvelope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium">Email</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <a href="mailto:anupkhanal17@gmail.com" className="hover:text-primary block">
                      anupkhanal17@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium">Location</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <p>Kathmandu, Nepal</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <FaLinkedin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium">LinkedIn</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <a 
                      href="https://www.linkedin.com/in/anupkhanal/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary block"
                    >
                      linkedin.com/in/anupkhanal
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                      <FaGithub className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium">GitHub</h5>
                    </div>
                  </div>
                  <div className="ml-12">
                    <a 
                      href="https://github.com/ank404" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary block"
                    >
                      github.com/ank404
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 mt-4">
                <p className="text-sm text-muted-foreground text-center">
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
