import { Geist, Geist_Mono, Inter, Libre_Baskerville } from "next/font/google"

export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
})
