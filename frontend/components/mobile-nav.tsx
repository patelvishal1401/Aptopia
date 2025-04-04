"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import type { Dispatch, SetStateAction } from "react"

interface MobileNavProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function MobileNav({ open, setOpen }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <div className="flex items-center justify-between border-b pb-4">
          <span className="font-bold text-lg">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="#how-it-works" className="text-base font-medium py-2" onClick={() => setOpen(false)}>
            HOW IT WORKS?
          </Link>
          <Link href="/form" className="text-base font-medium py-2" onClick={() => setOpen(false)}>
            CREATE TOKEN
          </Link>
          <Button className="mt-4" onClick={() => setOpen(false)}>
            CONNECT WALLET
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

