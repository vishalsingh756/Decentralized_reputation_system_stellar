
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function WalletConnection() {
  const { isWalletConnected, publicKey, connectWallet, disconnectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await connectWallet();
      setShowDialog(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  const openFreighterWebsite = () => {
    window.open("https://www.freighter.app/", "_blank", "noopener,noreferrer");
  };

  if (isWalletConnected && publicKey) {
    return (
      <Button variant="outline" onClick={handleDisconnectWallet} className="flex items-center space-x-2">
        <LogOut className="h-4 w-4" />
        <span className="hidden md:inline-block">
          {publicKey.substring(0, 6)}...{publicKey.substring(publicKey.length - 4)}
        </span>
        <span className="md:hidden">Disconnect</span>
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)} className="flex items-center space-x-2">
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Stellar</DialogTitle>
            <DialogDescription>
              Connect your Freighter wallet to access TrustChain features.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4">
              <img 
                src="https://freighter.app/img/logo-icon.svg" 
                alt="Freighter Logo" 
                className="h-16 w-16"
              />
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Freighter is a non-custodial wallet extension for Stellar that enables you to sign transactions securely.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openFreighterWebsite}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Install Freighter
            </Button>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleConnectWallet} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Freighter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
