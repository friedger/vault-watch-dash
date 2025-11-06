import { useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
}

export const WalletConnect = ({ onAddressChange }: WalletConnectProps) => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const userAddress = userData.profile.stxAddress.mainnet;
      setAddress(userAddress);
      onAddressChange(userAddress);
    }
  }, [onAddressChange]);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: "DAO Brussels Vault",
        icon: window.location.origin + "/favicon.ico",
      },
      redirectTo: "/",
      onFinish: () => {
        const userData = userSession.loadUserData();
        const userAddress = userData.profile.stxAddress.mainnet;
        setAddress(userAddress);
        onAddressChange(userAddress);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setAddress(null);
    onAddressChange(null);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div>
      {address ? (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-card border border-primary/20">
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="font-mono text-primary">{formatAddress(address)}</p>
          </div>
          <Button variant="outline" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet} className="gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
