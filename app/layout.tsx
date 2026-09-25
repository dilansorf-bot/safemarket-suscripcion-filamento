import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { title } from "process";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'SAFEMARKET Club 3D',
  description: 'Suscripción de filamentos',
  manifest: '/manifest.json',
  // Borramos themeColor de aquí
}

// Y lo agregamos aquí
export const viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
        
      </body>
    </html>
  );
}
