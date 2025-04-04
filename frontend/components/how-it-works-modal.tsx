"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coins, ListChecks, Repeat, Rocket } from "lucide-react"

interface HowItWorksModalProps {
  trigger?: React.ReactNode
  defaultOpen?: boolean
}

export default function HowItWorksModal({ trigger, defaultOpen = false }: HowItWorksModalProps) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="ghost">HOW IT WORKS?</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">How Aptopia Works</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Learn how to create and manage your own tokens on the Aptopia platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Token Creation */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Token Creation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Users sign in to the platform and create their own AI Agent token using a guided interface.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The token is deployed on the Aptos blockchain using Move smart contracts.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Token Listing */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ListChecks className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Token Listing</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Once created, tokens can be listed for public visibility.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Token creators can post updates directly on their token's dedicated page.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Liquidity and Swapping */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Repeat className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Liquidity and Swapping</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    After creating token, we will create Liquidity pool for 90% of supply and user will hold 10% of
                    token.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Users can swap tokens seamlessly via Liquidswap.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Real-time pricing updates and top holder data are displayed to keep users informed.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Future Enhancements */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Future Enhancements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Real-time Swapping: Improved UX for instant token transactions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Native Token Creation: Aptopia's own token to enhance liquidity management.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contract: We will create contract for token, LP creation and swapping.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Agentic Support Features: Additional utilities tailored for AI agents to improve functionality and
                    user engagement.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-center mt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            Get Started
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  )
}

