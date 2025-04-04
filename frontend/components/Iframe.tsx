"use client";

import { useState } from "react";
import { Loader } from "./Loader";

function Iframe({ address }: { address: string }) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => setLoading(false);

  return (
    <div className='h-full'>
      <div className='relative w-full min-h-[64vh]'>
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader className='text-white' />
          </div>
        )}

        <iframe
          className={`w-full h-fit bg-gray-100 min-h-[64vh] mt-4 rounded-lg ${
            loading ? "invisible" : "visible"
          }`}
          onLoad={handleLoad}
          src={`https://www.geckoterminal.com/aptos/pools/${address}?embed=1&info=0&swaps=0&chart=1`}
        />
      </div>
    </div>
  );
}

export default Iframe;
