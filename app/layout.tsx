import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/api/auth-context"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "Bisheshoggo AI - বিশেষজ্ঞ AI Healthcare Platform",
  description:
    "AI-powered medical support platform for Bangladesh's Hill Tracts and rural regions. Access telemedicine, symptom checker, emergency SOS, and find nearby healthcare facilities.",
 
  keywords: [
    "Bisheshoggo AI",
    "বিশেষজ্ঞ",
    "telemedicine",
    "rural healthcare",
    "Bangladesh",
    "Hill Tracts",
    "medical support",
    "emergency SOS",
    "symptom checker",
    "AI healthcare",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
