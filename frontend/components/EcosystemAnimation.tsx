"use client"

import type React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Coins, ArrowRight } from "lucide-react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { useState } from "react"

function AnimationScene({ step }: { step: number }) {
    return (
      <div className="relative h-[350px] sm:h-[450px] w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
  
        {/* Token Launch Animation */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: step === 1 ? 1 : 0.7,
                scale: step === 1 ? 1 : 0.8,
                x: step > 1 ? 100 : 0,
                y: step > 1 ? -80 : 0,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            >
              <TokenLaunchAnimation />
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* AI Agents Animation */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: step === 2 ? 1 : 0.7,
                scale: step === 2 ? 1 : 0.8,
                x: step > 2 ? -100 : 0,
                y: step > 2 ? 80 : 0,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            >
              <AIAgentsAnimation />
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Ecosystem Integration */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: step === 3 ? 1 : 0.7,
                scale: step === 3 ? 1 : 0.8,
                x: step > 3 ? 100 : 0,
                y: step > 3 ? 80 : 0,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            >
              <EcosystemAnimation />
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Final Call to Action */}
        <AnimatePresence>
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center p-6 bg-slate-800/80 backdrop-blur-md rounded-xl border border-blue-500/30 max-w-md">
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Build on Aptopia Today
                </h3>
                <p className="text-slate-300 mb-6">
                  Join the revolution and create the next generation of decentralized applications
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Particle Background */}
        <ParticleBackground />
      </div>
    )
  }
  
  function TokenLaunchAnimation() {
    return (
      <div className="relative w-64 h-64">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30"
        ></motion.div>
  
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-4 rounded-full border-2 border-dashed border-purple-500/30"
        ></motion.div>
  
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-b from-green-400 to-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20"
          >
            <Coins className="w-8 h-8 text-white" />
          </motion.div>
        </div>
  
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, Math.cos((i * 60 * Math.PI) / 180) * 80],
              y: [0, Math.sin((i * 60 * Math.PI) / 180) * 80],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-green-500/80 shadow-md shadow-green-500/30"
          ></motion.div>
        ))}
      </div>
    )
  }
  
  function AIAgentsAnimation() {
    return (
      <div className="relative w-64 h-64">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
        ></motion.div>
  
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-b from-purple-400 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
        </div>
  
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{
                rotate: 360,
                x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                y: Math.sin((i * 60 * Math.PI) / 180) * 80,
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "linear",
              }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-purple-500 rounded-sm transform rotate-45 shadow-md shadow-purple-500/30"></div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  function EcosystemAnimation() {
    return (
      <div className="relative w-64 h-64">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/30"
        ></motion.div>
  
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-b from-blue-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Image src="/aptos-logo.png" alt="Aptos Logo" width={32} height={32} className="object-contain" />
          </motion.div>
        </div>
  
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                y: Math.sin((i * 60 * Math.PI) / 180) * 80,
              }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="flex items-center justify-center"
            >
              <Card className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                {i % 3 === 0 ? (
                  <Coins className="w-6 h-6 text-green-400" />
                ) : i % 3 === 1 ? (
                  <Brain className="w-6 h-6 text-purple-400" />
                ) : (
                  <ArrowRight className="w-6 h-6 text-orange-400" />
                )}
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  function ParticleBackground() {
    return (
      <>
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: Math.random() * 0.5 + 0.3,
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
            }}
            animate={{
              opacity: [Math.random() * 0.5 + 0.3, 0],
              x: [null, Math.random() * 400 - 200],
              y: [null, Math.random() * 400 - 200],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-blue-500/30"
          ></motion.div>
        ))}
      </>
    )
  }
export default function Ecosystem(){
  const [step, setStep] = useState(3)
  
    return(
        <>
         <div className="hidden lg:block">
            <AnimationScene step={step} />
          </div>
        </>
    )
}
// function EcosystemAnimation() {
//     return (
//       <div className="relative w-64 h-64">
//         <motion.div
//           animate={{
//             rotate: 360,
//           }}
//           transition={{
//             duration: 30,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "linear",
//           }}
//           className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/30"
//         ></motion.div>
  
//         <div className="absolute inset-0 flex items-center justify-center">
//           <motion.div
//             initial={{ y: 0 }}
//             animate={{ y: [-5, 5, -5] }}
//             transition={{
//               duration: 2,
//               repeat: Number.POSITIVE_INFINITY,
//               ease: "easeInOut",
//             }}
//             className="bg-gradient-to-b from-blue-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20"
//           >
//             <Image src="/aptos-logo.png" alt="Aptos Logo" width={32} height={32} className="object-contain" />
//           </motion.div>
//         </div>
  
//         {[0, 1, 2, 3, 4, 5].map((i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0 }}
//             animate={{
//               opacity: 1,
//             }}
//             transition={{
//               duration: 1,
//               delay: i * 0.2,
//             }}
//             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//           >
//             <motion.div
//               animate={{
//                 rotate: i % 2 === 0 ? 360 : -360,
//                 x: Math.cos((i * 60 * Math.PI) / 180) * 80,
//                 y: Math.sin((i * 60 * Math.PI) / 180) * 80,
//               }}
//               transition={{
//                 duration: 15,
//                 repeat: Number.POSITIVE_INFINITY,
//                 ease: "linear",
//               }}
//               className="flex items-center justify-center"
//             >
//               <Card className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
//                 {i % 3 === 0 ? (
//                   <Coins className="w-6 h-6 text-green-400" />
//                 ) : i % 3 === 1 ? (
//                   <Brain className="w-6 h-6 text-purple-400" />
//                 ) : (
//                   <ArrowRight className="w-6 h-6 text-orange-400" />
//                 )}
//               </Card>
//             </motion.div>
//           </motion.div>
//         ))}
//       </div>
//     )
//   }