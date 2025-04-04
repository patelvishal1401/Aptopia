import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Target } from "lucide-react";
import Image from "next/image";
import { calculateAge, formatAddress } from "@/utils/helperFn";
import CopyButton from "./Copy";
import Link from "next/link";


export default function TokenCard({ tokens }: any) {
  return (
    <div className='grid w-full grid-cols-1 p-8 md:grid-cols-3 gap-4'>
      {tokens && tokens?.length ? (
        tokens.map((token: any) => <IndToken token={token} key={token?.id} />)
      ) : (
        <div className='flex items-center justify-center w-full col-start-2 py-4'>
          <p className='text-[#000000] font-primary font-normal text-[13px]'>
            No Tokens Available
          </p>
        </div>
      )}
    </div>
  );
}

async function IndToken({ token }: { token: any }) {
  const fetchData = async () => {
    try {
      const [pairResponse] = await Promise.all([
        fetch(
          `https://api.geckoterminal.com/api/v2/networks/aptos/tokens/${token?.tokenAddress}/pools?page=1`
        ),
      ]);
      const [pairData] = await Promise.all([pairResponse.json()]);
      return pairData?.data?.[0];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const pairData = await fetchData();
  const data = {
    price: parseFloat(pairData?.attributes?.token_price_usd).toFixed(6) || 0.0,
    volume: pairData?.attributes?.volume_usd?.h24 ||0,
  };

  
  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <CardHeader className='p-4 pb-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center'>
              <Image
                src={token?.iconUrl || "/placeholder.svg"}
                alt={token?.symbol}
                width={40}
                height={40}
                className='object-cover h-full w-full rounded-full'
              />
            </div>
            <div>
              <h3 className='font-semibold text-lg'>{token?.name}</h3>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='font-mono'>
                  {token?.symbol}
                </Badge>
                <span className='text-xs text-muted-foreground'>
                  {calculateAge(pairData?.attributes?.pool_created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-xs text-muted-foreground mb-1'>Price</p>
            <p className='font-medium'>
              {data?.price}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground mb-1'>24h Volume</p>
            <p className={`font-medium flex items-center  `}>
              {data?.volume}
              {/* <ArrowUpRight className='ml-1 h-3 w-3' /> */}
              {/* {positive ? (
                <ArrowUpRight className="ml-1 h-3 w-3" />
              ) : (
                <ArrowUpRight className="ml-1 h-3 w-3 rotate-180" />
              )} */}
            </p>
          </div>
        </div>
        <div className='mt-4'>
          <p className='text-xs text-muted-foreground mb-1'>Creator</p>
          <div className='flex items-center gap-2'>
            <a
              target='_blank'
              className='hover:text-primary hover:underline'
              href={`https://explorer.aptoslabs.com/account/${token?.owner}/transactions?network=mainnet`}
            >
              <p className='font-mono text-xs truncate '>
                {formatAddress(token?.owner)}
              </p>
            </a>
            <CopyButton text={token?.owner} />
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0 flex justify-between'>
        <Link href={`/token/${token?.name}`} prefetch  target='_blank'>
          <Button variant='outline' size='sm'>
            View Details
          </Button>
        </Link>
        <a
          href={`https://explorer.aptoslabs.com/coin/${token?.tokenAddress}?type=mainnet`}
          target='_blank'
        >
          <Button variant='ghost' size='sm' className='px-2'>
            <ExternalLink className='h-4 w-4' />
            <span className='sr-only'>View on Explorer</span>
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
