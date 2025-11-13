import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { MarketingView } from "@/components/home/MarketingView";
import { useTutorial } from "@/components/tutorial/TutorialContext";
import { useToast } from "@/hooks/use-toast";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { BXL_BTC_CONTRACT, VAULT_CONTRACT } from "@/services/blockchain";
import { useEffect, useState } from "react";

const Wallet = () => {
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

  const isAdmin = false; // Not implemented yet

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
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {!userAddress ? (
          <MarketingView />
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">Your Wallet</h1>
              <p className="text-muted-foreground text-lg">
                Track your portfolio and transaction history
              </p>
            </div>

            {/* Portfolio Chart */}
            <PortfolioChart
              sBtc={userBalances?.sBtc ?? 0}
              stx={userBalances?.stx ?? 0}
              bxlBTC={(userBalances?.bxlBTC ?? 0) + (userBalances?.bxlBTCTransit ?? 0)}
              bxlSTX={userBalances?.bxlSTX ?? 0}
            />

            {/* Transaction History */}
            <TransactionHistory userAddress={userAddress} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wallet;