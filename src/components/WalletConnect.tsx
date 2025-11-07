import { Button } from "@/components/ui/button";
import { clearLocalStorage, getLocalStorage, request, connect } from "@stacks/connect";
import { Wallet, ChevronDown, Bitcoin, Coins, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
  sBtcBalance?: number;
  stxBalance?: number;
  bxlBTC?: number;
  blxSTX?: number;
}

export const WalletConnect = ({ 
  onAddressChange,
  sBtcBalance = 0,
  stxBalance = 0,
  bxlBTC = 0,
  blxSTX = 0
}: WalletConnectProps) => {
  const [address, setAddress] = useState<string | null>(() => {
    return getLocalStorage()?.addresses.stx[0]?.address || null;
  });

  useEffect(() => {
    const stxAddress = getLocalStorage()?.addresses.stx[0]?.address || null;
    if (stxAddress) {      
      setAddress(stxAddress);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-[68px] gap-2 px-4">
              <div className="flex flex-col items-start">
                <p className="text-xs text-muted-foreground">Connected</p>
                <p className="font-mono text-sm font-bold text-primary">{formatAddress(address)}</p>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-card/95 backdrop-blur-sm border-primary/20 z-50"
          >
            <DropdownMenuLabel>Wallet Details</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Balances */}
            <div className="p-2 space-y-3">
              <Card className="p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bitcoin className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold">sBTC</p>
                  </div>
                </div>
                <p className="text-lg font-bold">{sBtcBalance.toFixed(8)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Wrapped: {bxlBTC.toFixed(8)} bxlBTC
                </p>
              </Card>
              
              <Card className="p-3 bg-secondary/5 border-secondary/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-secondary" />
                    <p className="text-sm font-semibold">STX</p>
                  </div>
                </div>
                <p className="text-lg font-bold">{stxBalance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Wrapped: {blxSTX.toLocaleString()} blxSTX
                </p>
              </Card>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={disconnectWallet}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={connectWallet} className="gap-2 h-[68px] px-6">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
