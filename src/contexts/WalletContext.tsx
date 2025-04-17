
import React, { createContext, useContext, useState, useEffect } from "react";
import { isConnected, isAllowed, setAllowed, getAddress } from "@stellar/freighter-api";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  isWalletConnected: boolean;
  publicKey: string | null;
  trustScore: number | null; // Keep the trustScore property
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isWalletConnected: false,
  publicKey: null,
  trustScore: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if wallet was previously connected
    const savedWalletState = localStorage.getItem("walletConnected");
    if (savedWalletState === "true") {
      // Try to reconnect wallet
      checkWalletConnection();
    }
  }, []);
  
  const checkWalletConnection = async () => {
    try {
      // First check if Freighter is connected
      const connectedResult = await isConnected();
      if (!connectedResult.isConnected) {
        setIsWalletConnected(false);
        setPublicKey(null);
        return;
      }

      // Then check if our app is allowed
      const allowedResult = await isAllowed();
      setIsWalletConnected(allowedResult.isAllowed);

      if (allowedResult.isAllowed) {
        try {
          // Get the public key if connected
          const addressResult = await getAddress();
          if (addressResult.error) {
            throw new Error(addressResult.error);
          }
          setPublicKey(addressResult.address);
          
          // Generate a mock trust score based on the wallet address
          const mockTrustScore = Math.floor(
            (parseInt(addressResult.address.substring(1, 6), 36) % 60) + 40
          ); // Generate score between 40-99
          setTrustScore(mockTrustScore);
          
          // Save connection state
          localStorage.setItem("walletConnected", "true");
        } catch (error) {
          console.error('Error getting public key:', error);
          setPublicKey(null);
          setTrustScore(null);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setIsWalletConnected(false);
      setPublicKey(null);
      setTrustScore(null);
    }
  };
  
  const connectWallet = async (): Promise<void> => {
    try {
      // Check if Freighter is installed first
      const connectedResult = await isConnected();
      if (!connectedResult.isConnected) {
        throw new Error("Freighter wallet is not installed");
      }
      
      // Request connection to the wallet
      const allowedResult = await setAllowed();
      if (!allowedResult.isAllowed) {
        throw new Error('User rejected the connection');
      }
      
      // Get the public key after successful connection
      const addressResult = await getAddress();
      if (addressResult.error) {
        throw new Error(addressResult.error);
      }
      
      setPublicKey(addressResult.address);
      setIsWalletConnected(true);
      
      // Generate a mock trust score based on the wallet address
      const mockTrustScore = Math.floor(
        (parseInt(addressResult.address.substring(1, 6), 36) % 60) + 40
      ); // Generate score between 40-99
      setTrustScore(mockTrustScore);
      
      // Save connection state
      localStorage.setItem("walletConnected", "true");
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${addressResult.address.substring(0, 6)}...${addressResult.address.substring(
          addressResult.address.length - 4
        )}`,
      });
      
    } catch (error) {
      let errorMessage = "Failed to connect wallet";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsWalletConnected(false);
      setPublicKey(null);
      setTrustScore(null);
      localStorage.removeItem("walletConnected");
      
      throw error;
    }
  };
  
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setPublicKey(null);
    setTrustScore(null);
    localStorage.removeItem("walletConnected");
    
    toast({
      title: "Wallet disconnected",
      description: "You have been logged out of your Stellar wallet",
    });
  };
  
  return (
    <WalletContext.Provider value={{ isWalletConnected, publicKey, trustScore, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
