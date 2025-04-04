"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { MobileNav } from "./mobile-nav"
import { usePathname } from "next/navigation"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import ConnectWallet from "./ConnectWallet"
import { formatAddress } from "@/utils/helperFn"
import { BtnLoader } from "./Loader";
import Image from "next/image"


export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()
    const [showWallet, setShowWallet] = useState(false);
  const { account, connected, disconnect, isLoading } = useWallet();
  const address=account?.address?.toString()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
    >
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center gap-2'>
            {/* <Coins className='h-6 w-6 text-primary' />
             */}
            <Image alt='Aptopia' src='/logo.png' width={50} height={50} />
            <span className='font-bold text-xl hidden sm:inline-block'>
              APTOPIA
            </span>
          </Link>
        </div>
   
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            className='text-primary hover:text-primary/90 hover:bg-primary/10'
            asChild
          >
            <Link href='/create-token'>CREATE TOKEN</Link>
          </Button>
          <Button className="min-w-36" onClick={() => connected ? disconnect()  :setShowWallet(true)}>
            {isLoading
              ? <BtnLoader/>
              : connected
              ? formatAddress(address)
              : "CONNECT WALLET"}
          </Button>
          <MobileNav open={mobileNavOpen} setOpen={setMobileNavOpen} />
        </div>
      </div>

      {showWallet ? <ConnectWallet close={() => setShowWallet(false)} /> : null}
    </header>
  );
}

