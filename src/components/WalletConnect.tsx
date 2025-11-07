import { Button } from "@/components/ui/button";
import { clearLocalStorage, getLocalStorage, request, connect } from "@stacks/connect";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
}

export const WalletConnect = ({ onAddressChange }: WalletConnectProps) => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const stxAddress = getLocalStorage()?.addresses.stx[0]?.address || null;
    if (stxAddress) {      
      onAddressChange(stxAddress);
    }
  }, [onAddressChange]);

  const connectWallet = async () => {
  const result = await connect();
  if (result.addresses[0]) {
    const stxAddress = getLocalStorage()?.addresses.stx[0]?.address || null;
    if (stxAddress) {      
      setAddress(stxAddress);
      onAddressChange(stxAddress);
    }
  }
  };

  const disconnectWallet = () => {
    clearLocalStorage();
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
          <div className="px-4 py-2 rounded-lg bg-card border border-primary/20 h-[68px] flex items-center">
            <div>
              <p className="text-xs text-muted-foreground">Connected</p>
              <p className="font-mono text-sm font-bold text-primary">{formatAddress(address)}</p>
            </div>
          </div>
          <Button variant="outline" onClick={disconnectWallet} className="h-[68px]">
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet} className="gap-2 h-[68px] px-6">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
