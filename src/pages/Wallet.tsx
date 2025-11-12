import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { MarketingView } from "@/components/home/MarketingView";
import { useTutorial } from "@/components/tutorial/TutorialContext";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <main className="container mx-auto px-4 py-8 space-y-16">
        {!userAddress ? (
          <MarketingView />
        ) : (
          <ScrollArea className="h-full max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Portfolio Chart */}
              <PortfolioChart
                sBtc={vaultBalances.sBtc}
                stx={vaultBalances.stx}
                bxlBTC={vaultBalances.bxlBTC + vaultBalances.bxlBTCTransit}
                bxlSTX={vaultBalances.bxlSTX}
              />

              {/* Recent Transactions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Recent Transactions
                </h3>
                <TransactionHistory userAddress={userAddress} />
              </div>
            </div>
          </ScrollArea>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wallet;
