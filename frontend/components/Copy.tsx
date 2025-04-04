"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className='flex items-center gap-2 !cursor-pointer  py-2 rounded transition'
    >
      {copied ? (
        <Check className='w-3 h-3 text-green-500' />
      ) : (
        <Copy className='w-3 h-3' />
      )}
    </button>
  );
}
