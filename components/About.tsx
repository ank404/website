"use client";
/* eslint-disable */

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 ">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          About
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-start page-text lg:px-6">
        Throughout my career in system administration, I’ve been driven by a commitment to stability, 
        efficiency, and innovation in IT infrastructure. 
        My focus has always been on creating:{" "}
          <span className="text-black dark:text-white font-bold">
          robust and secure systems that empower businesses to operate seamlessly.
          </span>{" "}
        </p>
        <p className="text-start page-text lg:px-6">
        With over five years of experience managing data centers and server infrastructures, 
        I’ve honed my skills in virtualization, automation, and cloud computing. Currently, 
        I’m expanding my expertise into the world of DevOps, mastering tools like Docker, 
        Kubernetes, and CI/CD pipelines to drive automation and scalability in modern IT 
        environments. At{" "}
          <a
            className="no-wrap text-primary text-black dark:text-white font-bold"
            href="https://silverlining.com.np"
            target="blank"
            rel="noopener noreferrer"
          >
            Silver Lining Pvt. Ltd
          </a>
          , I’ve managed over 100 physical and virtual servers, optimized web hosting
          environments, and implemented proactive monitoring systems to ensure high availability and
          performance. My journey has been one of continuous learning—bridging traditional system
          administration with emerging DevOps practices to build infrastructures that are both efficient and
          future-ready.
        </p>
        <p className="text-start page-text lg:px-6">
        I believe in simplifying the complex—designing IT solutions that prioritize user needs, security, and
        scalability. Whether it’s enhancing email server security, streamlining Linux deployments, or
        exploring new automation tools, I strive to make technology a reliable partner in solving real-world
        challenges.
        </p>
      </div>
    </section>
  );
}
