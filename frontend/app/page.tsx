// "use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, Coins, Brain, Loader, Lock, Zap } from "lucide-react"
import Link from "next/link"
import FeatureCard from "@/components/feature-card"
import TokenCreationSteps from "@/components/token-creation-steps"
import HeroAnimation from "@/components/hero-animation"
import TokenCard from "@/components/token-card"
import { supabase } from "../services/supabase";
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import Ecosystem from "@/components/EcosystemAnimation"
import HowItWorksModal from "@/components/how-it-works-modal"
export const revalidate = 10

export default async function Home() {

  const fetchToken = async () => {
    try {
      const { data, error } = await supabase
        .from("tokens")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      console.log("Fetched Tokens:", data); // Log data before updating state
      return data
    } catch (error) {
      console.error("Fetch Error: ", error);
    }
  };

  const tokens = await fetchToken()


  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-24 pb-20 md:pt-32 md:pb-32'>
        <div className='container px-6'>
          <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
            <div className='flex flex-col justify-center space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                  <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500'>
                    APTOPIA
                  </span>
                </h1>
                <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                  AI Agent & Meme coin launchpad - Virtuals-like platform to
                  deploy AI Agent and MEME coin on Aptos
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link href='/create-token'>
                  <Button size='lg' className='gap-1.5 group'>
                    Create Token
                    <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                  </Button>
                </Link>
                  <HowItWorksModal
                    trigger={<Button size="lg" variant="outline" >How it works?</Button>}
                   />
              </div>
              {tokens && tokens.length ? (
                <div className='flex items-center gap-4 pt-4'>
                  <div className='flex -space-x-2'>
                    {tokens?.slice(0,10)?.map((token, i) => (
                      <Link href={`/token/${token?.name}`} prefetch
                        key={i}
                        className='inline-block hover:scale-105 duration-75 rounded-full ring-2 ring-background'
                      >
                        <img
                          src={token?.iconUrl}
                          alt='User avatar'
                          className='w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-muted'
                        />
                      </Link>
                    ))}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    <span className='font-medium text-foreground'>
                      {tokens?.length - 1}+
                    </span>{" "}
                    token{tokens?.length > 1 ? "s" : ""} created
                  </div>
                </div>
              ) : null}
            </div>
            <div className="order-1 lg:order-2">
              <Ecosystem />
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        {/* <div className='absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.1),transparent)]' />
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]' /> */}

      </section>

      {/* Features Section */}
      {/* <section className='bg-muted/50 py-16 md:py-24' id='how-it-works'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
                How It Works
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Create tokens in minutes
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Our platform simplifies the token creation process with a
                user-friendly interface and powerful features.
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
            <FeatureCard
              icon={<Zap className='h-10 w-10 text-primary' />}
              title='Fast & Simple'
              description='Create custom tokens in just a few clicks without any coding knowledge required.'
            />
            <FeatureCard
              icon={<Lock className='h-10 w-10 text-primary' />}
              title='Secure & Reliable'
              description='Built on secure blockchain infrastructure with audited smart contracts.'
            />
            <FeatureCard
              icon={<Coins className='h-10 w-10 text-primary' />}
              title='Full Control'
              description='Customize supply, name, symbol, and advanced tokenomics to suit your needs.'
            />
          </div>
        </div>
      </section> */}

      {/* Token Creation Steps */}
      {/* <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Three simple steps</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Creating your own token has never been easier. Follow these steps to launch your token.
              </p>
            </div>
          </div>
          <TokenCreationSteps />
          <div className="flex justify-center mt-12">
            <Button size="lg" className="gap-1.5 group">
              Start Creating Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* Token Listings Section */}
      <section className='py-16 md:py-24 bg-muted/30'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2 mb-6'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              View Listed Token on Aptopia
              </h2>
              {/* <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                View Listed Token on Aptopia
              </p> */}
            </div>
          </div>
          <div>
            <TokenCard tokens={tokens as any[]} />
          </div>
          {/* <div className='flex justify-center mt-12'>
            <Button variant='outline' size='lg' className='gap-1.5'>
              View All Tokens
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="border-t bg-muted/30 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to create your token?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of creators who have already launched their tokens on APTOPIA.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="gap-1.5 group">
                Create Token
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
