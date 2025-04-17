// Polyfill for Node.js globals needed by Stellar SDK
if (typeof window !== 'undefined') {
  // Make window.global available
  window.global = window;
  
  // Add Node.js Buffer which Stellar SDK depends on
  if (typeof Buffer === 'undefined') {
    window.Buffer = require('buffer/').Buffer;
  }
}

import { isConnected, isAllowed, signTransaction } from "@stellar/freighter-api";
import * as freighterApi from "@stellar/freighter-api";
import StellarSdk from "stellar-sdk";

// Configure Stellar SDK to use testnet by default
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
// IMPORTANT: Do not define a constant networkPassphrase here - we'll get it dynamically from Freighter

// Platform fee account - all transaction fees will be sent to this address
export const PLATFORM_FEE_ADDRESS = "GDA44RZOXHV7LSDAJ7EPWS6JPBTKMJ7SDELR7XMEBQ4PZTPOKQRIPZU2";

/**
 * Check if an account exists on the Stellar network
 * @param address Stellar public key
 * @returns Boolean indicating if account exists
 */
export const checkAccountExists = async (address: string): Promise<boolean> => {
  try {
    console.log("Checking if account exists:", address);
    // Using try/catch with server.loadAccount as an existence check
    await server.loadAccount(address);
    console.log("Account exists!");
    return true;
  } catch (error) {
    console.error("Account doesn't exist:", error);
    return false;
  }
};

/**
 * Gets the current Stellar network details from Freighter
 * @returns Network passphrase and name
 */
export const getNetworkDetails = async (): Promise<{networkPassphrase: string, networkName: string}> => {
  try {
    // Get the network info from Freighter
    const networkInfo = await freighterApi.getNetwork();
    let networkPassphrase = "";
    let networkName = "UNKNOWN";
    
    console.log("Raw network info from Freighter:", networkInfo);
    
    if (typeof networkInfo === 'string') {
      // If it's just a string, it's the network name
      networkName = networkInfo;
      // Map the name to the correct passphrase
      if (networkName === "TESTNET") {
        networkPassphrase = StellarSdk.Networks.TESTNET;
      } else if (networkName === "PUBLIC") {
        networkPassphrase = StellarSdk.Networks.PUBLIC;
      }
    } else if (networkInfo && typeof networkInfo === 'object') {
      // If it's an object, extract both properties
      const hasNetworkPassphrase = (obj: any): obj is { networkPassphrase: string } => 
        obj && 'networkPassphrase' in obj && typeof obj.networkPassphrase === 'string';
      
      const hasNetwork = (obj: any): obj is { network: string } => 
        obj && 'network' in obj;
      
      if (hasNetworkPassphrase(networkInfo)) {
        networkPassphrase = networkInfo.networkPassphrase;
        
        // Determine network name from passphrase
        if (networkPassphrase === StellarSdk.Networks.TESTNET) {
          networkName = "TESTNET";
        } else if (networkPassphrase === StellarSdk.Networks.PUBLIC) {
          networkName = "PUBLIC";
        }
      }
      
      if (hasNetwork(networkInfo)) {
        networkName = networkInfo.network;
      }
    }
    
    console.log("Detected network name:", networkName);
    console.log("Detected network passphrase:", networkPassphrase);
    
    // Double-check that we have a valid passphrase
    if (!networkPassphrase) {
      console.error("Failed to get network passphrase from Freighter");
      // Default to TESTNET for safety
      networkPassphrase = StellarSdk.Networks.TESTNET;
      networkName = "TESTNET";
    }
    
    return { 
      networkPassphrase, 
      networkName 
    };
  } catch (error) {
    console.error("Error getting network details:", error);
    // Default to TESTNET in case of error
    return { 
      networkPassphrase: StellarSdk.Networks.TESTNET, 
      networkName: "TESTNET"
    };
  }
};

/**
 * Gets the current Stellar network name from Freighter
 * @returns Network name (e.g., TESTNET, PUBLIC)
 */
export const getCurrentNetwork = async (): Promise<string> => {
  const { networkName } = await getNetworkDetails();
  return networkName;
};

/**
 * Process a Stellar payment transaction
 * @param fromAddress Sender's Stellar address
 * @param toAddress Recipient's Stellar address (optional, will use platform fee address if not provided)
 * @param amount Amount to send in XLM
 * @returns Transaction hash
 */
export const processStellarPayment = async (
  fromAddress: string,
  toAddress: string | null = null,
  amount: number
): Promise<string> => {
  try {
    // Always use the platform fee address as the destination
    const destinationAddress = PLATFORM_FEE_ADDRESS;
    
    console.log(`Processing payment from ${fromAddress} to ${destinationAddress} for ${amount} XLM`);
    
    // Check if accounts exist
    const sourceExists = await checkAccountExists(fromAddress);
    const destinationExists = await checkAccountExists(destinationAddress);
    
    if (!sourceExists) {
      throw new Error("Source account not found");
    }
    
    // Load source account
    const sourceAccount = await server.loadAccount(fromAddress);
    
    // Get network details from Freighter (critical to match what Freighter is using)
    const { networkPassphrase, networkName } = await getNetworkDetails();
    console.log(`Using network: ${networkName} with passphrase: ${networkPassphrase}`);
    
    // If user is not on TESTNET, show appropriate error
    if (networkName !== "TESTNET") {
      throw new Error(`Network mismatch: Please switch Freighter to TESTNET (currently on ${networkName})`);
    }
    
    // Build the transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        })
      )
      .addMemo(StellarSdk.Memo.text('Platform Fee Payment'))
      .setTimeout(180)
      .build();

    // Get the transaction XDR
    const transactionXDR = transaction.toXDR();
    
    // Request user approval and sign the transaction
    console.log("Requesting user approval for transaction...");
    const signedTransactionResult = await signTransaction(transactionXDR, { networkPassphrase });
    
    if (!signedTransactionResult || !signedTransactionResult.signedTxXdr) {
      throw new Error("Transaction was not signed by the user");
    }

    try {
      // Create a new transaction from the signed XDR
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedTransactionResult.signedTxXdr,
        networkPassphrase
      );

      // Submit the transaction
      console.log("Submitting signed transaction to network...");
      const submittedTx = await server.submitTransaction(signedTransaction);
      console.log("Transaction submitted successfully:", submittedTx.hash);
      return submittedTx.hash;
    } catch (submitError) {
      console.error("Transaction submission failed:", submitError);
      throw submitError;
    }
  } catch (error) {
    console.error("Payment failed:", error);
    throw error;
  }
};

/**
 * Connect to Freighter wallet
 */
export const connectFreighterWallet = async (): Promise<{publicKey: string, connected: boolean}> => {
  try {
    // Check if Freighter is installed
    const freighterConnected = await isConnected();
    if (!freighterConnected.isConnected) {
      throw new Error("Freighter wallet is not installed");
    }
    
    // Check if Freighter is allowed to connect to this website
    const isPermissionGranted = await isAllowed();
    if (!isPermissionGranted) {
      // Request permission
      await window.open("https://www.freighter.app/", "_blank");
      throw new Error("Please grant permission to Freighter and refresh the page");
    }
    
    // Public key retrieval with multiple fallback methods
    const publicKeyMethods = [
      async () => {
        if ('getUserInfo' in freighterApi) {
          const userInfo = await (freighterApi as any).getUserInfo();
          return userInfo?.publicKey;
        }
        return null;
      },
      async () => {
        if ('userInfo' in freighterApi && typeof (freighterApi as any).userInfo === 'function') {
          const userInfo = await (freighterApi as any).userInfo();
          return userInfo?.publicKey;
        }
        return null;
      },
      async () => {
        // Last resort: try direct publicKey method if it exists in the API
        if ((freighterApi as any).publicKey && typeof (freighterApi as any).publicKey === 'function') {
          return await (freighterApi as any).publicKey();
        }
        return null;
      }
    ];

    let publicKey = null;
    for (const method of publicKeyMethods) {
      try {
        publicKey = await method();
        if (publicKey) break;
      } catch (error) {
        console.warn("Public key retrieval method failed:", error);
      }
    }

    if (!publicKey) {
      throw new Error("Could not retrieve public key from Freighter. Please ensure you're using the latest version.");
    }
    
    // Verify the account exists on the network
    const accountExists = await checkAccountExists(publicKey);
    if (!accountExists) {
      throw new Error("Account not found on Stellar. Please ensure you're on the correct network (Testnet).");
    }
    
    console.log("Successfully connected to wallet:", publicKey);
    return {
      publicKey,
      connected: true
    };
  } catch (error) {
    console.error("Error connecting to Freighter:", error);
    throw error;
  }
};
