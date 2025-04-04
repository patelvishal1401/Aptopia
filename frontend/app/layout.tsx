import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { WalletProvider } from "../components/ConnectWallet";
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Aptopia",
  description:
    "AI Agent & Meme coin launchpad - Virtuals-like platform to deploy AI Agent and MEME coin on Apto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ThemeProvider attribute='class' enableSystem>
          <Toaster position='top-center' />
          <WalletProvider>
            <Navbar />
            <main className='flex-1'>{children}</main>
            <Footer />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



import './globals.css'
import Footer from "@/components/Footer"
