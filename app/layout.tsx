import * as React from "react"

import { siteMetadata } from "@/lib/metadata"
import { geistMono, geistSans, inter, libreBaskerville } from "@/lib/fonts"

import "@/assets/styles/globals.css"

export const metadata = siteMetadata

import { Toaster } from "@/components/ui"
import { AuthProvider } from "@/providers/auth-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
