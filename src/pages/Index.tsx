import { DevelopmentBanner } from "@/components/DevelopmentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { SupportedProjects } from "@/components/SupportedProjects";
import { DashboardView } from "@/components/home/DashboardView";
import { MarketingView } from "@/components/home/MarketingView";
import { useTutorial } from "@/components/tutorial/TutorialContext";
import { useToast } from "@/hooks/use-toast";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import {
  BXL_BTC_CONTRACT,
  depositSBtc,
  depositStx,
  VAULT_CONTRACT,
} from "@/services/blockchain";
import { useEffect, useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { state } = useTutorial();
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);
  const { data: userBalances } = useBalances(userAddress);
  const { data: totalBxlBTC } = useTotalSupply(BXL_BTC_CONTRACT);

  // Show tutorial for first-time users
  useEffect(() => {
    if (!state.isCompleted && !state.skipped && !state.isActive) {
      const hasVisited = localStorage.getItem("bxl-vault-has-visited");
      if (!hasVisited) {
        localStorage.setItem("bxl-vault-has-visited", "true");
      }
    }
  }, [state]);

  // Helper function to ensure user address is available before executing action
  const withUserAddressCheck = <T extends any[]>(
    action: (address: string, ...args: T) => void,
    errorMessage: string = "Please connect your wallet to perform this action"
  ) => {
    return (...args: T) => {
      if (userAddress) {
        action(userAddress, ...args);
      } else {
        toast({
          title: "Wallet not connected",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
  };

  const handleSBtcDeposit = withUserAddressCheck(
    (address: string, amount: number) => depositSBtc(amount, address),
    "Please connect your wallet to deposit sBTC"
  );

  const handleStxDeposit = withUserAddressCheck(
    (address: string, amount: number) => depositStx(amount, address),
    "Please connect your wallet to deposit STX"
  );

  const isAdmin = false; // Not implemented yet

  // Calculate earned yield: vault sBTC - total supply of wrapped sBTC
  const earnedYield = Math.max(
    0,
    (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ?? 0)
  );

  // Use vault balances for display when not connected, or fallback to 0
  const displayBalances = userAddress ? userBalances : vaultBalances;
  const sBtcBalance = displayBalances?.sBtc ?? 0;
  const stxBalance = displayBalances?.stx ?? 0;

  return (
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-5xl mx-auto">
          <DevelopmentBanner />
        </div>
        <div className="space-y-16">
        {!userAddress ? (
          <>
            <MarketingView />
            <SupportedProjects />
          </>
        ) : (
          userBalances && (
            <DashboardView
              userAddress={userAddress}
              balances={userBalances}
              vaultSbtc={vaultBalances?.sBtc ?? 0}
              earnedYield={earnedYield}
              onSBtcDeposit={handleSBtcDeposit}
              onStxDeposit={handleStxDeposit}
            />
          )
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
