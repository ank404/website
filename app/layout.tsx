import type { Metadata } from "next";
import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./animations.css";
import "./terminal.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { LenisProvider } from "@/context/LenisContext";

// Font definitions
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anupkhanal.info.np"),
  alternates: {
    canonical: "https://anupkhanal.info.np",
  },
  title: "Anup Khanal | System Administrator & Aspiring DevOps Engineer",
  description:
    "Anup Khanal | System Administrator & Aspiring DevOps Engineer.",
  keywords:
    "Anup Khanal, System Administrator, DevOps Engineer, Cloud Computing, Virtualization, Server Management, IT Infrastructure, Docker, Kubernetes, CI/CD, Automation, Technology, Innovation, Human-Centered Design",
  openGraph: {
    locale: "en_US",
    siteName: "Anup Khanal",
    type: "website",
    title: "Anup Khanal",
    description:
      "Anup Khanal is a System Administrator & Aspiring DevOps Engineer.",
    url: "https://anupkhanal.info.np",
  },
  twitter: {
    title: "Anup Khanal",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
      <head>        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force manual scroll restoration
              history.scrollRestoration = 'manual';
              
              // Clear hash on page load to prevent automatic anchor scrolling
              if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
              
              // Aggressively ensure page starts at top with multiple attempts
              document.addEventListener('DOMContentLoaded', function() {
                // First attempt
                window.scrollTo(0, 0);
                
                // Multiple attempts with increasing delays
                [0, 50, 100, 300, 600, 1000].forEach(function(delay) {
                  setTimeout(function() {
                    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                  }, delay);
                });
              });
              
              // Also handle on full load
              window.onload = function() {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                
                // Clear any hash again
                if (window.location.hash) {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                
                // Final attempt after everything else
                setTimeout(function() {
                  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                }, 200);
              };
              
              // Reset before unloading
              window.onbeforeunload = function() {
                window.scrollTo(0, 0);
              };
            `,
          }}
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisProvider>
            {children}
            <Analytics />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
