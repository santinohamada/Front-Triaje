import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Geist, Geist_Mono } from 'next/font/google' // Simplifiqué los imports si usas las fuentes default de Next


import Providers from "@/components/providers"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Sistema de Guardia Hospitalaria",
  description: "Sistema de gestión para guardia hospitalaria",
  generator: "v0.app",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* Providers maneja React Query y la Seguridad */}
        <Providers>
            {children}
            <Toaster richColors closeButton/>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}