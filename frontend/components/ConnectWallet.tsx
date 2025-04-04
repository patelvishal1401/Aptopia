"use client";

import {
  AptosWalletAdapterProvider,
  useWallet,
  groupAndSortWallets,
  WalletItem,
  isInstallRequired,
} from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { useRef,useEffect } from "react";

export function WalletProvider({ children }:any) {
  return (
    <AptosWalletAdapterProvider
      autoConnect
      dappConfig={{ network: Network.MAINNET, }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}

function ConnectWallet({ close }:any) {
  const { wallets = [], notDetectedWallets = [] } = useWallet();
  const connectRef = useRef<any>(null);

  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets([...wallets, ...notDetectedWallets]);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (connectRef.current && !connectRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='fixed  h-screen  w-full top-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        ref={connectRef}
        className='h-[500px] font-primary w-[500px] text-black overflow-auto !bg-white rounded-md p-10'
      >
        <div>
          <div className='flex flex-col text-center leading-snug'>
            {hasAptosConnectWallets ? (
              <p className='font-medium text-2xl'>Log in</p>
            ) : (
              "Connect Wallet"
            )}
          </div>
        </div>

        {/* {hasAptosConnectWallets && (
          <div className='flex flex-col gap-2 pt-3'>
            {aptosConnectWallets.map((wallet) => (
              <AptosConnectWalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={close}
              />
            ))}

            <div className='flex items-center gap-3  text-muted-foreground'>
              <div className='h-px w-full bg-secondary' />
              Or
              <div className='h-px w-full bg-secondary' />
            </div>
          </div>
        )} */}

        <div className='flex flex-col gap-3 pt-3'>
          {availableWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
          {!!installableWallets.length &&
            installableWallets.map((wallet) => (
              <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
            ))}
        </div>
      </div>
    </div>
  );
}

function WalletRow({ wallet, onConnect }:any) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className='flex items-center justify-between px-4 py-3 gap-4 border rounded-md'
    >
      <div className='flex items-center gap-4'>
        <WalletItem.Icon className='h-6 w-6' />
        <WalletItem.Name className='text-base font-normal' />
      </div>
      {isInstallRequired(wallet) ? (
        <button  >
          <WalletItem.InstallLink />
        </button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <button className="text-green-400 font-medium">Connect</button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }:any) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <button className='w-full flex items-center justify-center bg-black border-white border rounded-md h-12 mb-2 gap-4'>
          <WalletItem.Icon className='h-5 w-5' />
          <WalletItem.Name className='text-base font-normal' />
        </button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}
export default ConnectWallet;
