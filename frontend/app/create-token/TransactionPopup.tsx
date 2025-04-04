"use client";
import { useEffect, useRef, useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useNotification } from "../../hooks/useNotification";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { SDK, convertValueToDecimal } from "@pontem/liquidswap-sdk";
import {
  compileToken,
  fetchSwapRate,
  getPublishingPayload,
  prepareToken,
  validateTokenConfig,
} from "../../services/token";
import { BtnLoader } from "@/components/Loader";
import { supabase } from "@/services/supabase";
import { init } from "./page";
import { Button } from "@/components/ui/button";
import { refetch } from "@/utils/action";

const sdk = new SDK({
  nodeUrl: "https://fullnode.mainnet.aptoslabs.com/v1", // Node URL, required
});

export default function TransactionPopup({
  setLoading,
  onClose,
  createTokenParams,
  setCreateTokenParams,
}: any) {
  const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";

  const config = new AptosConfig({
    network: Network.MAINNET,
    fullnode: NODE_URL,
  });
  const client = new Aptos(config);

  const router = useRouter();
  const { signAndSubmitTransaction, account } = useWallet();
  const { showMessage } = useNotification();
  const wallet = account?.address?.toString();
  const [status, setStatus] = useState<any>({
    token: "pending",
    pool: "pending",
    swap: "pending",
    update: "pending",
  });

  const statusFn = () => {
    for (let i in status) {
      if (status[i] === "progress") return true;
      return false;
    }
  };
  const {
    name,
    symbol,
    decimals,
    initialSupply,
    iconUrl,
    projectUrl,
    mintFee,
  } = createTokenParams;
  const moduleName = symbol.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_coin";
  const capitalizedModuleName =
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const tokenAddress = `${wallet}::${moduleName}::${capitalizedModuleName}`;
  const tokenValue = initialSupply * Math.pow(10, decimals);
  const aptValue = 0.001 * Math.pow(10, 8);
  const isProcessing = useRef(false);

  const createToken = async () => {
    const formattedInitialSupply = initialSupply
      ? parseInt(initialSupply) * 1000000
      : null;
    try {
      setLoading(true);
      console.log("Creating token...");
      setStatus((status: any) => ({ ...status, token: "progress" }));

      const reqBody = {
        moduleName,
        tokenName: name,
        tokenSymbol: symbol,
        decimals,
        totalSupply: formattedInitialSupply,
      };

      const isValid = await validateTokenConfig(reqBody);
      if (!isValid) {
        return;
      }
      // Step 1: Prepare the token
      const id = await prepareToken(reqBody);
      // Step 2: Compile the token
      await compileToken(id, wallet);
      // Step 3: Get publishing payload
      const createTokenPayload = await getPublishingPayload(id, wallet);

      console.log({
        data: {
          ...createTokenPayload,
          functionArguments: createTokenPayload?.arguments,
        },
      });

      const createTokenTransaction = await signAndSubmitTransaction({
        data: {
          ...createTokenPayload,
          functionArguments: createTokenPayload?.arguments,
        },
      });
      console.log({ createTokenTransaction: createTokenTransaction.hash });

      const createTokenResponse = await client.waitForTransaction({
        transactionHash: createTokenTransaction.hash,
      });

      setStatus((status: any) => ({
        ...status,
        token: "completed",
        pool: "progress",
      }));

      return new Promise((resolve) => {
        setTimeout(async () => {
          const pool = await poolFn();
          if (!pool) {
            setLoading(false);
            resolve(null); // Resolve with null if no pool
            return;
          }
          setLoading(false);
          resolve({
            tokenAddress: tokenAddress,
            poolAddress: "",
          });
        }, 3000);
      });

      // const swap = await swapFn()

      // if (!swap) {
      //   setLoading(false);
      //   return
      // }

      // console.log({
      //   pool,
      //   swap,
      //   createTokenResponse,
      //   tokenAddress: tokenAddress,
      // });
    } catch (error) {
      isProcessing.current = false;
      console.error("Error creating token:", error);
      setLoading(false);
      setStatus((status: any) => {
        let updatedStatus = { ...status };
        for (let key in updatedStatus) {
          if (updatedStatus[key] === "progress") {
            updatedStatus[key] = "failed";
          }
        }
        return updatedStatus;
      });
    }
  };

  const poolFn = async () => {
    try {
      const deductedTokenValue = tokenValue - tokenValue * (10 / 100);

      const payload = await sdk.Liquidity.createAddLiquidityPayload({
        fromToken: "0x1::aptos_coin::AptosCoin",
        toToken: tokenAddress,
        fromAmount: aptValue, // 1 APTOS
        toAmount: deductedTokenValue, // '4.472498' USDC)
        interactiveToken: "from",
        slippage: 0.005,
        // stableSwapType: 'normal',
        curveType: "uncorrelated",
        version: 0.5,
      });

      console.log(payload);

      // const createPoolPayload = {
      //   data: {
      //     function: `0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::scripts::register_pool_and_add_liquidity`,
      //     typeArguments: [
      //       tokenAddress,
      //       "0x1::aptos_coin::AptosCoin",
      //       "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated",
      //     ],
      //     functionArguments: calculateValues(tokenValue, aptValue),
      //   },
      // };

      // console.log(createPoolPayload);

      // const createPoolTransaction = await signAndSubmitTransaction(
      //   { data: { ...payload, functionArguments: payload?.arguments, typeArguments :payload?.type_arguments}}
      // );
      const createPoolTransaction = await signAndSubmitTransaction({
        data: {
          ...payload,
          functionArguments: payload?.arguments,
          typeArguments: payload?.type_arguments,
        },
      });
      console.log({ createPoolTransaction: createPoolTransaction.hash });

      const createPoolResponse = await client.waitForTransaction({
        transactionHash: createPoolTransaction.hash,
        // transactionHash:"0x4ad8b5b56d031c1031c5f2b3798b4c91fa6d8de3b1fc36c996e8d3e9bc0b932b"
      });

      // const poolArr = createPoolResponse?.events?.filter((obj) =>
      //   obj?.type?.includes("PoolCreationEvent")
      // );
      // const poolAddress = poolArr?.[0]?.data?.pool_obj?.inner;

      // if (!poolAddress) {
      //   setStatus((status) => ({ ...status, pool: "failed" }));
      //   showMessage({ type: "error", value: "Pool Address not found" });
      //   return;
      // }

      setStatus((status: any) => ({
        ...status,
        pool: "completed",
        // swap: "progress",
      }));
      return createPoolResponse;
    } catch (error) {
      isProcessing.current = false;
      setStatus((status: any) => {
        let updatedStatus = { ...status };
        for (let key in updatedStatus) {
          if (updatedStatus[key] === "progress") {
            updatedStatus[key] = "failed";
          }
        }
        return updatedStatus;
      });
      console.log("swap error", error);
      return false;
    }
  };

  const swapFn = async () => {
    try {
      const calulatedPrice = await fetchSwapRate({
        fromToken: "0x1::aptos_coin::AptosCoin", // full 'from' token address
        toToken: tokenAddress, // full 'to' token address layerzero USDT
        amount: aptValue, // 1 APTOS, or you can use convertValueToDecimal(1, 8)
        curveType: "unstable", // can be 'uncorrelated' or 'stable'
        version: 0.5,
      });
      console.log({ calulatedPrice });

      const payload: any = {
        data: {
          function:
            "0x9dd974aea0f927ead664b9e1c295e4215bd441a9fb4e53e5ea0bf22f356c8a2b::router::swap_exact_coin_for_coin_x1",
          typeArguments: [
            "0x1::aptos_coin::AptosCoin",
            tokenAddress,
            "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Uncorrelated",
            "0x9dd974aea0f927ead664b9e1c295e4215bd441a9fb4e53e5ea0bf22f356c8a2b::router::BinStepV0V05",
          ],
          functionArguments: [aptValue, [calulatedPrice], [5], [false]],
        },
      };

      const swapTxn = await signAndSubmitTransaction(payload);
      console.log({ swapTxn: swapTxn.hash });

      const swapResponse = await client.waitForTransaction({
        transactionHash: swapTxn.hash,
      });
      console.log(swapResponse);
      setStatus((status: any) => ({ ...status, swap: "completed" }));
      return swapResponse;
    } catch (error) {
      isProcessing.current = false;
      setStatus((status: any) => {
        let updatedStatus = { ...status };
        for (let key in updatedStatus) {
          if (updatedStatus[key] === "progress") {
            updatedStatus[key] = "failed";
          }
        }
        return updatedStatus;
      });
      console.log("swap error", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (isProcessing.current) return; // Prevent duplicate calls
    isProcessing.current = true;
    const deploy = await createToken();
    if (!deploy) {
      setLoading(false);
      return;
    }
    console.log(deploy);
    setStatus((status: any) => ({
      ...status,
      update: "progress",
      // swap: "progress",
    }));
    const { data, error } = await supabase.from("tokens").insert([
      {
        ...createTokenParams,
        ...deploy,
        owner: wallet,
      },
    ]);

    if (error) {
      setStatus((status: any) => ({
        ...status,
        update: "failed",
      }));
      setLoading(false);
      return;
    }

    console.log(data);
    refetch();
    setStatus((status: any) => ({
      ...status,
      update: "completed",
    }));
    // if (error) throw new Error(error);
    setLoading(false);

    showMessage({
      type: "success",
      value: "Token Deployed Successfully",
    });
    setCreateTokenParams(init);
    router.push(`/`);
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <div className='fixed w-full p-5 z-10 top-0 right-0 left-0 bottom-0 h-screen bg-[#101828B2]'>
      <div className='w-[90%] sm:w-[400px] h-fit p-10 gap-2 flex bg-[#0a0e1a] border border-[#1a2035]  overflow-hidden absolute top-[53%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex-col items-start justify-start rounded-lg shadow-lg'>
        <p className='text-primary text-center w-full  font-bold font-primary text-xl'>
          Transaction
        </p>

        <ul className='font-primary pl-5 text-[12px] mt-4 font-normal'>
          <Status title={`Creating Token (${symbol})`} status={status.token} />
          <Status
            title={`Creating Liquidity Pool : APT(0.001)/${symbol} (90% of total supply)`}
            status={status.pool}
          />
          <Status title={`Listing Token`} status={status.update} />
          {/* <Status title='Swap' status={status.swap} /> */}
        </ul>

        <div className='flex justify-between w-full gap-4 mt-4'>
          <Button
            variant={"outline"}
            className='w-full text-primary font-normal font-primary flex h-10 items-center justify-center rounded-md p-2 cursor-pointer text-[13px]'
            onClick={onClose}
          >
            Cancel
          </Button>
          {/* <button
            className="w-[250px] text-white font-normal gap-4 font-primary flex h-10 items-center justify-center rounded-md bg-[black] p-2 cursor-pointer text-[13px]"
            onClick={handleSubmit}
            disabled={statusFn()}
          >
            Confirm {status.update==='progress' ? <BtnLoader/>  : null}
          </button> */}
        </div>
      </div>
    </div>
  );
}

function Status({ title, status }: any) {
  return (
    <li
      className={`flex items-center gap-2 text-sm mb-1 ${
        status === "completed"
          ? "text-[#12B76A]"
          : status === "progress" || status === "pending"
          ? "text-[#475467]"
          : "text-red-600"
      }`}
    >
      {title} {status === "progress" ? <BtnLoader /> : `(${status})`}{" "}
    </li>
  );
}
