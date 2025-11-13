import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DevelopmentBanner } from "@/components/DevelopmentBanner";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { VAULT_CONTRACT, BXL_BTC_CONTRACT, ADMIN_ADDRESSES } from "@/services/blockchain";

interface LayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
}

export const Layout = ({ children, showBanner = true }: LayoutProps) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);
  const { data: userBalances } = useBalances(userAddress);
  const { data: totalBxlBTC } = useTotalSupply(BXL_BTC_CONTRACT);
  
  const isAdmin = userAddress ? ADMIN_ADDRESSES.includes(userAddress) : false;
  
  const displayBalances = userAddress ? userBalances : vaultBalances;
  const sBtcBalance = displayBalances?.sBtc ?? 0;
  const stxBalance = displayBalances?.stx ?? 0;

  const contextValue = {
    userAddress,
    userBalances,
    vaultBalances,
    totalBxlBTC,
    isAdmin,
  };

  return (
    <LayoutProvider value={contextValue}>
      <div className="min-h-screen bg-background">
        <Header
          userAddress={userAddress}
          onAddressChange={setUserAddress}
          sBtcBalance={sBtcBalance}
          stxBalance={stxBalance}
          bxlBTC={userBalances?.bxlBTC ?? 0}
          bxlSTX={userBalances?.bxlSTX ?? 0}
        />
        <Navigation userAddress={userAddress} isAdmin={isAdmin} />
        
        {showBanner && (
          <div className="container mx-auto px-4 pt-8">
            <div className="max-w-5xl mx-auto">
              <DevelopmentBanner />
            </div>
          </div>
        )}
        
        {children}
        
        <Footer />
      </div>
    </LayoutProvider>
  );
};
