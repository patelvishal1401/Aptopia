import env from "@/constants/env";

const API_URL = env.backendUrl;

const validateTokenConfig = async ({
  moduleName,
  tokenName,
  tokenSymbol,
  decimals,
  totalSupply,
}) => {
  try {
    const response = await fetch(`${API_URL}/api/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        moduleName,
        tokenName,
        tokenSymbol,
        decimals,
        totalSupply,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return true;
  } catch (error) {
    console.log(error.message || "Validation failed");
    return false;
  }
};

const prepareToken = async ({
  moduleName,
  tokenName,
  tokenSymbol,
  decimals,
  totalSupply,
}) => {
  try {
    console.log("Preparing token module...");
    const response = await fetch(`${API_URL}/api/prepare-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        moduleName,
        tokenName,
        tokenSymbol,
        decimals,
        totalSupply,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    console.log("Token module prepared successfully");
    return data.prepId;
  } catch (error) {
    console.log(error.message || "Failed to prepare token");
    throw error;
  }
};

const compileToken = async (prepId, address) => {
  try {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    console.log("Compiling token module...");
    const response = await fetch(`${API_URL}/api/compile-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prepId,
        accountAddress: address,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    console.log("Token module compiled successfully");
    return data;
  } catch (error) {
    console.log(error.message || "Failed to compile token");
    throw error;
  }
};

const getPublishingPayload = async (prepId, address) => {
  try {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    console.log("Generating publishing payload...");
    const response = await fetch(`${API_URL}/api/get-publishing-payload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prepId,
        accountAddress: address,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    console.log("Publishing payload generated successfully");
    return data.payload;
  } catch (error) {
    console.log(error.message || "Failed to get publishing payload");
    throw error;
  }
};

const verifyTransaction = async (txnHash) => {
  try {
    console.log("Verifying transaction...");
    const response = await fetch(`${API_URL}/api/verify-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txnHash,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    if (!data.transactionSuccess) {
      throw new Error(`Transaction failed: ${data.vmStatus}`);
    }

    console.log(`Token ${tokenSymbol} created successfully!`);
    return data;
  } catch (error) {
    console.log(error.message || "Failed to verify transaction");
    throw error;
  }
};

const cleanupResources = async () => {
  try {
    if (prepId) {
      await fetch(`${API_URL}/api/cleanup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prepId,
        }),
      });
    }
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
};

const fetchSwapRate = async ({
  fromToken,
  toToken,
  amount,
  curveType,
  version,
}) => {
  const url = `https://api.liquidswap.com/smart-router?from=${fromToken}&to=${toToken}&version=${version}&curve=${curveType}&cl=true&input=${amount}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
      console.log("Swap Rate Data:", data.directMode?.path?.[0]?.outputAmount);
    const outputAmount = +data?.directMode?.path?.[0]?.outputAmount;
    return outputAmount ;
  } catch (error) {
    console.error("Error fetching swap rate:", error);
    return null;
  }
};


const fetchTokenId = async ({
  token
}) => {
  const url = `https://app.geckoterminal.com/api/p1/search?query=${token}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.id
  } catch (error) {
    console.error("Error fetching swap rate:", error);
    return null;
  }
};




export {
  validateTokenConfig,
  cleanupResources,
  verifyTransaction,
  getPublishingPayload,
  prepareToken,
  compileToken,
  fetchSwapRate,
  fetchTokenId,
};
