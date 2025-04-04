"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SwapMessage({open}:any) {
  const [isOpen, setIsOpen] = useState(open);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0  w-full min-h-screen flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm'>


      <div className='relative w-full max-w-3xl rounded-2xl bg-[#0a0e1a] border border-[#1a2035] shadow-xl overflow-hidden'>
        <div className='p-6 md:p-8'>
          <button
            onClick={() => setIsOpen(false)}
            className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
            aria-label='Close'
          >
            <X className='h-6 w-6' />
          </button>

          <h2 className='text-lg font-bold text-white text-center mb-4'>
            Real-Time Trading Data
          </h2>

          <p className='text-md text-gray-300 text-center mb-8'>
            To get real time Trending data, Make 1 swap and wait for 5-10 min
            after coin launch.
          </p>
        </div>
      </div>
    </div>
  );
}
