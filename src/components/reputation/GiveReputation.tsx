
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { ReputationForm } from "./form/ReputationForm";
import { WalletNotConnected } from "./form/WalletNotConnected";

export function GiveReputation() {
  const { isWalletConnected } = useWallet();

  if (!isWalletConnected) {
    return <WalletNotConnected />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Give Reputation</CardTitle>
        <CardDescription>Rate other users and record your feedback on the Stellar blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <ReputationForm />
      </CardContent>
    </Card>
  );
}
