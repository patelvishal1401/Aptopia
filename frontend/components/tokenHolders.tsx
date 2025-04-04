"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { formatAddress } from "@/utils/helperFn";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";

export default function TokenHolders({ token }: any) {
  const [holders, setHolders] = useState<any>("");
  const [holdersData, setHoldersData] = useState<any>("");
  const [loading, setLoading] = useState(false);
  console.log(token);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const holdersResponse = await fetch(
          `https://api.aptoscan.com/public/v1.0/coins/${token?.token?.tokenAddress}/holders`
        );
        if (!holdersResponse.ok) {
          throw new Error(
            `Failed to fetch holders data: ${holdersResponse.statusText}`
          );
        }
        let result = await holdersResponse.json();
        const holdersData = result?.data;
        setHoldersData(holdersData);
        setHolders(holdersData?.coin_holders_list);
      } catch (error) {
        console.error("Error fetching holders data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Holders {holders.length ? `(${holders.length})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {holders && holders.length ? (
            holders.map((holder: any, i: number) => {
              const address = formatAddress(holder?.owner_address);
              const multiplier = Math.pow(10, holdersData?.coin_info?.decimals);
              const sumHolder = holdersData?.sum_amount_holder;
              const percentage: any =
                ((holder.amount / (multiplier * sumHolder)) * 100).toFixed(1) ||
                0;

              return (
                <div key={i} className='space-y-1'>
                  <div className='flex justify-between text-sm'>
                    <a
                      target='_blank'
                      href={`https://explorer.aptoslabs.com/account/${holder?.owner_address}/transactions?network=mainnet`}
                      className='font-mono hover:text-primary hover:underline'
                    >
                      {address}
                    </a>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} className='h-2' />
                </div>
              );
            })
          ) : holders && !holders.length && !loading ? (
            <div className=' flex items-center justify-center h-[30vh]'>
            No Data
            </div>
          ) : (
            <div className=' flex items-center justify-center h-[30vh]'>
              <Loader className='text-white' />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
