import express from "express";
import cors from "cors";
import { AptosClient, TxnBuilderTypes, BCS, HexString, Types } from "aptos";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Aptos configuration - CHANGED TO MAINNET
const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);

// Basic server health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// API endpoint to validate token config
app.post("/api/validate-token", (req, res) => {
  try {
    const { moduleName, tokenName, tokenSymbol, decimals, totalSupply } = req.body;

    // Validate required fields
    if (!moduleName || !tokenName || !tokenSymbol || decimals === undefined || totalSupply === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Validate module name format (alphanumeric and underscore only)
    if (!/^[a-z][a-z0-9_]*$/.test(moduleName)) {
      return res.status(400).json({
        success: false,
        error: "Module name must start with a lowercase letter and contain only lowercase letters, numbers, and underscores",
      });
    }

    // Validate token name and symbol
    if (tokenName.length < 1 || tokenName.length > 32) {
      return res.status(400).json({
        success: false,
        error: "Token name must be between 1 and 32 characters",
      });
    }

    if (tokenSymbol.length < 1 || tokenSymbol.length > 10) {
      return res.status(400).json({
        success: false,
        error: "Token symbol must be between 1 and 10 characters",
      });
    }

    // Validate decimals and total supply
    if (decimals < 0 || decimals > 18 || !Number.isInteger(decimals)) {
      return res.status(400).json({
        success: false,
        error: "Decimals must be an integer between 0 and 18",
      });
    }

    if (totalSupply <= 0 || !Number.isInteger(totalSupply)) {
      return res.status(400).json({
        success: false,
        error: "Total supply must be a positive integer",
      });
    }

    // If all validations pass
    res.status(200).json({
      success: true,
      message: "Token configuration is valid",
    });
  } catch (error) {
    console.error("Error validating token config:", error);
    res.status(500).json({
      success: false,
      error: "Server error while validating token configuration",
    });
  }
});

// API endpoint to prepare token for publishing
app.post("/api/prepare-token", async (req, res) => {
  try {
    const { moduleName, tokenName, tokenSymbol, decimals, totalSupply } = req.body;

    // Create a temporary ID for this token preparation
    const prepId = `prep_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const workDir = path.join("./temp", prepId);

    // Create working directory
    fs.mkdirSync(workDir, { recursive: true });
    fs.mkdirSync(path.join(workDir, "sources"), { recursive: true });

    // Generate Move.toml
    const capitalizedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    const moveToml = `[package]
name = "${capitalizedModuleName}"
version = "0.1.0"

[addresses]
${moduleName} = "_"

[dependencies]
AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework/", rev = "mainnet" }
`;
    fs.writeFileSync(path.join(workDir, "Move.toml"), moveToml);

    // Generate Move module
    const structName = capitalizedModuleName;
    const moveCode = `module ${moduleName}::${moduleName} {
  use std::string::utf8;
  use std::signer;
  use aptos_framework::aptos_account;
  use aptos_framework::coin;
  
  const DECIMALS: u8 = ${decimals};
  const NAME: vector<u8> = b"${tokenName}";
  const SYMBOL: vector<u8> = b"${tokenSymbol}";
  const TOTAL_SUPPLY: u64 = ${totalSupply};
  
  struct ${structName} {}
  
  entry fun init_module(acc: &signer) {
    let (burn_cap, freeze_cap, mint_cap) = coin::initialize<${structName}>(
      acc, utf8(NAME), utf8(SYMBOL), DECIMALS, true,
    );
    
    let minted_coins = coin::mint(TOTAL_SUPPLY, &mint_cap);
    aptos_account::deposit_coins(signer::address_of(acc), minted_coins);
    
    coin::destroy_burn_cap(burn_cap);
    coin::destroy_freeze_cap(freeze_cap);
    coin::destroy_mint_cap(mint_cap);
  }
}`;
    fs.writeFileSync(path.join(workDir, "sources", `${moduleName}.move`), moveCode);

    res.status(200).json({
      success: true,
      prepId: prepId,
      message: "Token preparation successful",
      moduleName,
      tokenName,
      tokenSymbol,
      decimals,
      totalSupply,
    });
  } catch (error) {
    console.error("Error preparing token:", error);
    res.status(500).json({
      success: false,
      error: "Server error while preparing token",
    });
  }
});

// API endpoint to compile token module
app.post("/api/compile-token", async (req, res) => {
  try {
    const { prepId, accountAddress } = req.body;

    if (!prepId || !accountAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Validate account address format
    if (!/^0x[a-fA-F0-9]{1,64}$/.test(accountAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid account address format",
      });
    }

    const workDir = path.join("./temp", prepId);

    // Check if the preparation exists
    if (!fs.existsSync(workDir)) {
      return res.status(404).json({
        success: false,
        error: "Preparation not found",
      });
    }

    // Read the Move.toml to get the module name
    const moveTomlPath = path.join(workDir, "Move.toml");
    const moveToml = fs.readFileSync(moveTomlPath, "utf8");
    const moduleNameMatch = moveToml.match(/\[addresses\]\s+([a-z0-9_]+)\s+=\s+"_"/);

    if (!moduleNameMatch || !moduleNameMatch[1]) {
      return res.status(500).json({
        success: false,
        error: "Failed to extract module name from Move.toml",
      });
    }

    const moduleName = moduleNameMatch[1];

    try {
      // Change to the working directory and compile
      process.chdir(workDir);

      // Compile the Move package
      execSync(`aptos move compile --save-metadata --named-addresses ${moduleName}=${accountAddress}`, { stdio: "pipe" });

      // Get back to the original directory
      process.chdir("../../");

      // Get the capitalized module name for the build path
      const capitalizedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
      const buildPath = path.join(workDir, "build", capitalizedModuleName);

      // Check if compilation was successful
      if (!fs.existsSync(path.join(buildPath, "package-metadata.bcs"))) {
        return res.status(500).json({
          success: false,
          error: "Compilation failed: package-metadata.bcs not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Token module compiled successfully",
        prepId,
        moduleName,
        buildPath,
      });
    } catch (error) {
      console.error("Compilation error:", error);
      return res.status(500).json({
        success: false,
        error: "Compilation failed: " + (error instanceof Error ? error.message : String(error)),
      });
    }
  } catch (error) {
    console.error("Error compiling token:", error);
    res.status(500).json({
      success: false,
      error: "Server error while compiling token",
    });
  }
});


// API endpoint to get publishing payload
app.post("/api/get-publishing-payload", async (req, res) => {
  try {
    const { prepId, accountAddress } = req.body;

    if (!prepId || !accountAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const workDir = path.join("./temp", prepId);

    // Read the Move.toml to get the module name
    const moveTomlPath = path.join(workDir, "Move.toml");
    const moveToml = fs.readFileSync(moveTomlPath, "utf8");
    const moduleNameMatch = moveToml.match(/\[addresses\]\s+([a-z0-9_]+)\s+=\s+"_"/);

    if (!moduleNameMatch || !moduleNameMatch[1]) {
      return res.status(500).json({
        success: false,
        error: "Failed to extract module name from Move.toml",
      });
    }

    const moduleName = moduleNameMatch[1];
    const capitalizedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    const buildPath = path.join(workDir, "build", capitalizedModuleName);

    // Read the package metadata
    if (!fs.existsSync(path.join(buildPath, "package-metadata.bcs"))) {
      return res.status(404).json({
        success: false,
        error: "Package metadata not found. Compile the token first.",
      });
    }

    const packageMetadata = fs.readFileSync(path.join(buildPath, "package-metadata.bcs"));

    // Read module bytecodes
    const bytecodesDir = path.join(buildPath, "bytecode_modules");
    if (!fs.existsSync(bytecodesDir)) {
      return res.status(404).json({
        success: false,
        error: "Bytecode modules not found. Compile the token first.",
      });
    }

    const moduleBytecodes = [];
    fs.readdirSync(bytecodesDir).forEach((file) => {
      if (file.endsWith(".mv")) {
        const bytecode = fs.readFileSync(path.join(bytecodesDir, file));
        moduleBytecodes.push(bytecode);
      }
    });

    if (moduleBytecodes.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No bytecode modules found. Compilation may have failed.",
      });
    }

    // Generate the payload
    try {
      // Convert address to HexString
      const sender = HexString.ensure(accountAddress);
      
      // Create proper arrays from the Buffer objects
      const metadataArray = Array.from(packageMetadata);
      const bytecodesArray = moduleBytecodes.map(bytecode => Array.from(bytecode));

      // Create entry function payload with proper formatting
      const entryFunctionPayload = {
        function: "0x1::code::publish_package_txn",
        type_arguments: [],
        arguments: [
          metadataArray,
          bytecodesArray
        ]
      };

      // Generate the raw transaction
      const rawTxn = await client.generateTransaction(sender.hex(), entryFunctionPayload, {
        max_gas_amount: "100000",
        gas_unit_price: "100",
      });

      // Convert BigInt values to strings for JSON serialization
      const serializedTxn = JSON.parse(JSON.stringify(rawTxn, (key, value) => 
        typeof value === "bigint" ? value.toString() : value
      ));

      const payload = {
        type: "entry_function_payload",
        function: "0x1::code::publish_package_txn",
        arguments: [
          Array.from(packageMetadata),
          moduleBytecodes.map(bytecode => Array.from(bytecode))
        ],
        type_arguments: []
      };
  
      res.status(200).json({
        success: true,
        message: "Publishing payload generated successfully",
        payload: payload,
        moduleName,
        moduleAddress: accountAddress,
      });
    } catch (error) {
      console.error("Error generating transaction payload:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to generate transaction payload: " + (error instanceof Error ? error.message : String(error)),
      });
    }
  } catch (error) {
    console.error("Error preparing publishing payload:", error);
    res.status(500).json({
      success: false,
      error: "Server error while preparing publishing payload",
    });
  }
});

// API endpoint to verify transaction
app.post("/api/verify-transaction", async (req, res) => {
  try {
    const { txnHash } = req.body;

    if (!txnHash) {
      return res.status(400).json({
        success: false,
        error: "Transaction hash is required",
      });
    }

    try {
      // Verify the transaction on the blockchain
      const txnInfo = await client.getTransactionByHash(txnHash);

      if (!txnInfo) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
      }

      // Check transaction success
      const success = txnInfo.success;
      const vmStatus = txnInfo.vm_status;

      res.status(200).json({
        success: true,
        transactionSuccess: success,
        vmStatus,
        txnInfo,
        // Updated explorer URL to point to mainnet
        explorerUrl: `https://explorer.aptoslabs.com/txn/${txnHash}?network=mainnet`,
      });
    } catch (error) {
      console.error("Error verifying transaction:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to verify transaction: " + (error instanceof Error ? error.message : String(error)),
      });
    }
  } catch (error) {
    console.error("Server error during transaction verification:", error);
    res.status(500).json({
      success: false,
      error: "Server error during transaction verification",
    });
  }
});

// Cleanup endpoint to remove temp files
app.post("/api/cleanup", (req, res) => {
  try {
    const { prepId } = req.body;

    if (!prepId) {
      return res.status(400).json({
        success: false,
        error: "Preparation ID is required",
      });
    }

    const workDir = path.join("./temp", prepId);

    if (fs.existsSync(workDir)) {
      fs.rmSync(workDir, { recursive: true, force: true });
    }

    res.status(200).json({
      success: true,
      message: "Cleanup successful",
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    res.status(500).json({
      success: false,
      error: "Server error during cleanup",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  // Create temp directory if it doesn't exist
  if (!fs.existsSync("./temp")) {
    fs.mkdirSync("./temp");
  }

  console.log(`Server is running on port ${PORT}`);
});