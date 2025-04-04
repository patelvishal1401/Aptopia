import { Progress } from "@/components/ui/progress"
import { formatAddress } from "@/utils/helperFn";

export default function TokenHolders({ token }: any) {
  const holdersData = token?.holdersData?.data;
  const holders = holdersData?.coin_holders_list;
  console.log(token);

  return (
    <div className='space-y-4'>
      {holders &&
        holders.length && holders.map((holder: any, i: number) => {
          const address = formatAddress(holder?.owner_address);
          const multiplier = Math.pow(10, holdersData?.coin_info?.decimals);
          const sumHolder = holdersData?.sum_amount_holder;
          const percentage: any =
            ((holder.amount / (multiplier * sumHolder)) * 100).toFixed(1) || 0;

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
        })}
    </div>
  );
}

