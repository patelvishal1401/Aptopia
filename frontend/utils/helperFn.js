import env from "../constants/env";
import { differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, parseISO, isValid } from "date-fns";

export const urlGeneration = (path) =>
  `${env.supabaseUrl}/storage/v1/object/public/${path}`;


export const formatAddress = (address) =>
  `${address?.slice(0, 6)}....${address?.slice(
    address?.length - 6,
    address?.length
  )}`;

export const formatNumber = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return "0"; // Default fallback for undefined, null, or NaN values
  }

  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + "B"; // Convert to Billions
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M"; // Convert to Millions
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K"; // Convert to Thousands
  } else {
    return value.toFixed(2); // Show exact value for smaller numbers
  }
};

const addNetwork = async (obj) => {
  try {
    if (window?.ethereum !== undefined) {
      const provider = window.ethereum;
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [obj],
      });

      // connectWallet();
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

const switchNetwork = async (obj) => {
  try {
    const provider = window.ethereum;
    const response = await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: obj.chainId }],
    });
    return true;
  } catch (error) {
    if (error.code === 4902) {
      return addNetwork(obj);
    }
    console.log(error);
  }
};

const checkNetwork = async (obj) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = window.ethereum;
      let chainId = await provider.chainId;

      if (chainId === obj.chainId) {
        return true;
      }
      return switchNetwork(obj);
    }
  } catch (error) {
    console.log(error);
  }
};

export const VerifyNetwork = async (obj) => {
  try {
    const getNetworkResult = await checkNetwork(obj);
    if (!getNetworkResult) {
      return;
    }
    // connectWallet();
    return getNetworkResult;
  } catch (error) {
    console.error(error);
  }
};


export const explorer = (address) => `https://basescan.org/address/${address}`;

export const validateUrl=(inputUrl)=> {
  try {
    let url = new URL(inputUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid URL");
    }
    return true; 
  } catch (error) {
    return false;
  }
}


export function validateAndFormatUrl(inputUrl) {
  try {
    let url = new URL(inputUrl.includes("://") ? inputUrl : `https://${inputUrl}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid URL: Only HTTP and HTTPS protocols are allowed.");
    }
    return url.href;
  } catch (error) {
    return false;
  }
}

export const calculateAge = (date) => {
  if (!date) return "N/A";

  const givenDate = date instanceof Date ? date : parseISO(date);
  if (!isValid(givenDate)) return "Invalid date";

  const now = new Date();
  const days = differenceInDays(now, givenDate);
  const hours = differenceInHours(now, givenDate);
  const minutes = differenceInMinutes(now, givenDate);

  if (days > 0) return `${days} days`;
  if (hours > 0) return `${hours} hours`;
  return `${minutes} minutes`;
};

