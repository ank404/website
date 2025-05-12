import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { LenisProvider } from "@/context/LenisContext";

const inter = Inter({ subsets: ["latin"] });

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
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              history.scrollRestoration = 'manual';
              window.onbeforeunload = function () {
                window.scrollTo(0, 0);
              };
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
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
