import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import TokenHolders from "@/components/tokenHolders"
import { supabase } from "@/services/supabase"
import { calculateAge } from "@/utils/helperFn"
  import { format } from "date-fns";
import CopyButton from "@/components/Copy"
import SwapMessage from "@/components/SwapMessage"
import Updates from "@/components/Updates"
import Iframe from "@/components/Iframe"

export const revalidate = 10

interface TokenPageProps {
  params: {
    tokenName: string
  }
}

export default async function TokenPage({ params }: TokenPageProps) {


  const tokenName =  decodeURI(params?.tokenName);

     
  const fetchData = async () => {
  try {
    // Fetch token first
    const { data: token, error } = await supabase
      .from("tokens")
      .select("*")
      .eq("name", tokenName?.split("-").join(" "))
      .single();

    if (error) {
      throw new Error(`Error fetching token details: ${error.message}`);
    }
    console.log("Fetched Token:", token);

    if (!token) throw new Error("Token not found");

    // Prepare to fetch the pair and holders data
    let pairData = null;
    let holdersData = null;

    // API Request for pair data
    try {
      const pairResponse = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/aptos/tokens/${token?.tokenAddress}/pools?page=1`
      );
      if (!pairResponse.ok) {
        throw new Error(`Failed to fetch pair data: ${pairResponse.statusText}`);
      }
      pairData = await pairResponse.json();
    } catch (error) {
      console.error("Error fetching pair data:", error);
    }

    // API Request for holders data
    try {
      const holdersResponse = await fetch(
        `https://api.aptoscan.com/public/v1.0/coins/${token?.tokenAddress}/holders`
      );
      if (!holdersResponse.ok) {
        throw new Error(`Failed to fetch holders data: ${holdersResponse.statusText}`);
      }
      holdersData = await holdersResponse.json();
    } catch (error) {
      console.error("Error fetching holders data:", error);
    }

    console.log({holdersData});
    

    // Return the data, even if some parts failed
    return {
      token,
      pairData: pairData?.data?.[0] || {},
      holdersData,
      holderAmount: holdersData?.data || {},
    };
  } catch (error) {
    console.error("Error fetching token details:", error);
    return {
      token: {},
      pairData: {},
      holdersData: {},
      holderAmount: {},
    };
  }
};
  
  
  const tokenData=await fetchData()


     console.log({tokenData});
     
  // In a real app, you would fetch token data based on the tokenName


  const formattedDate = tokenData?.token?.created_at && format(new Date(tokenData?.token?.created_at), "MMMM d, yyyy");



  // Mock data for the token
  const token = {
    name: tokenName,
    symbol: tokenData?.token?.symbol,
    price: tokenData?.pairData?.attributes?.token_price_usd
      ? `$${parseFloat(tokenData?.pairData.attributes.token_price_usd).toFixed(
          6
        )}`
      : "N/A",
    change: "",
    marketCap: tokenData?.pairData?.attributes?.market_cap_usd
      ? `$${tokenData?.pairData?.attributes?.market_cap_usd}`
      : "N/A",
    volume24h: tokenData?.pairData?.attributes?.volume_usd?.h24
      ? `$${tokenData?.pairData?.attributes?.volume_usd?.h24}`
      : "N/A",
    totalSupply: tokenData?.token?.initialSupply,
    circulatingSupply: tokenData?.pairData?.attributes?.reserve_in_usd
      ? `$${tokenData?.pairData?.attributes?.reserve_in_usd}`
      : "N/A",
    creator: tokenData?.token?.owner,
    createdAt: formattedDate,
    description: tokenData?.token?.description,
    website: tokenData?.token?.projectUrl,
    contractAddress: tokenData?.token?.tokenAddress,
    age: calculateAge(tokenData?.pairData?.attributes?.pool_created_at),
    holders: tokenData?.holdersData?.data?.coin_holders_list?.length,
  };


    const tokenfrom = "0x1::aptos_coin::AptosCoin";
    const swapurl = `https://liquidswap.com/?from=${tokenfrom}&to=${token?.contractAddress}&curve=unstable&version=0.5&target=swap`;


  return (
    <div className='container mx-auto pt-24 pb-16 px-4'>
      <SwapMessage open={!tokenData?.pairData ? true : false} />

      <div className='flex flex-col space-y-8'>
        <div className='flex items-center'>
          <Link
            href='/'
            className='flex items-center text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            <span>GO BACK</span>
          </Link>
        </div>

        {/* Token Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
              <Image
                src={tokenData?.token?.iconUrl}
                alt={token.name}
                width={64}
                height={64}
                className='object-cover h-full w-full rounded-full'
              />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>{token.name}</h1>
              <div className='flex items-center gap-2'>
                <span className='text-lg font-mono'>{token.symbol}</span>
                <span className='text-sm text-muted-foreground'>
                  Created {token.createdAt}
                </span>
              </div>
            </div>
          </div>

          <div className='flex gap-2'>
            <a href={swapurl} target='_blank'>
              <Button size='sm'>
                Swap on Liquid Swap
                <ExternalLink className='mr-2 h-4 w-4' />
              </Button>
            </a>
            {/* <Button variant='outline' size='sm'>
              <ExternalLink className='mr-2 h-4 w-4' />
              View on Explorer
            </Button> */}
          </div>
        </div>

        {/* Token Price Card */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle>Token Price</CardTitle>
            <CardDescription>Current market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div>
                <p className='text-sm text-muted-foreground'>Price</p>
                <p className='text-2xl font-bold'>{token.price}</p>
                <p className='text-sm text-green-500'>{token.change}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Market Cap</p>
                <p className='text-2xl font-bold'>{token.marketCap}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>24h Volume</p>
                <p className='text-2xl font-bold'>{token.volume24h}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Liquidity</p>
                <p className='text-2xl font-bold'>{token.circulatingSupply}</p>
                {/* <p className="text-sm text-muted-foreground">of {token.totalSupply}</p> */}
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Age</p>
                <p className='text-2xl font-bold'>{token.age}</p>
              </div>
              {/* <div>
                <p className='text-sm text-muted-foreground'>Holders</p>
                <p className='text-2xl font-bold'>{token.holders}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card>
          {/* <CardHeader className='pb-2'> */}
          {/* <CardTitle>Price History</CardTitle> */}
          {/* <CardDescription>Last 30 days</CardDescription> */}
          {/* </CardHeader> */}
          <CardContent className='min-h-[64vh]'>
            <Iframe address={tokenData?.token?.tokenAddress} />
          </CardContent>
        </Card>

        {/* Token Info */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* About */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{token.description}</p>

              <div className='mt-6 space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b'>
                  <span className='text-sm text-muted-foreground'>Website</span>
                  <a
                    href={token.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline flex items-center'
                  >
                    {token.website}
                    <ExternalLink className='ml-1 h-3 w-3' />
                  </a>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b'>
                  <span className='text-sm text-muted-foreground'>
                    Token Address
                  </span>
                  <div className='flex items-center gap-3'>
                    <a
                      href={`https://explorer.aptoslabs.com/coin/${token?.contractAddress}?type=mainnet`}
                      target='_blank'
                      className='font-mono text-xs truncate hover:text-primary hover:underline'
                    >
                      {token.contractAddress}
                    </a>
                    <CopyButton text={token?.contractAddress} />
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b'>
                  <span className='text-sm text-muted-foreground'>Creator</span>
                  <a
                    target='_blank'
                    href={`https://explorer.aptoslabs.com/account/${token?.creator}/transactions?network=mainnet`}
                    className='font-mono text-xs truncate hover:text-primary hover:underline'
                  >
                    {token.creator}
                  </a>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b'>
                  <span className='text-sm text-muted-foreground'>
                    Total Supply
                  </span>
                  <span>{token.totalSupply}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Holders */}
          {/* <Card>
            <CardHeader>
              <CardTitle>
                Holders (
                {tokenData?.holdersData?.data?.coin_holders_list?.length})
              </CardTitle>
            </CardHeader>
            <CardContent> */}
              <TokenHolders token={tokenData} />
            {/* </CardContent> */}
          {/* </Card> */}
        </div>

        <Updates token={tokenData?.token} />
      </div>
    </div>
  );
}

