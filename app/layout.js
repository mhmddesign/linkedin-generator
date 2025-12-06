import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LinkedIn Viral Content Generator | MHMD STUDIO",
  description: "Generate viral LinkedIn posts automatically with AI. Powered by MHMD STUDIO & Gemini.",
  keywords: ["LinkedIn", "content generator", "viral posts", "AI", "MHMD STUDIO"],
  authors: [{ name: "MHMD STUDIO" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
