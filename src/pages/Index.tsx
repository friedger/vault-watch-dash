import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { SupportedProjects } from "@/components/SupportedProjects";
import { MarketingView } from "@/components/home/MarketingView";
import { DashboardView } from "@/components/home/DashboardView";
import { useBalances } from "@/hooks/useBalances";
import { 
  VAULT_CONTRACT,
  withdrawSBtc, 
  withdrawStx, 
  withdrawSBtcUpdate, 
  finalizeSbtcWithdraw 
} from "@/services/blockchain";
import { useToast } from "@/hooks/use-toast";
import { useTutorial } from "@/components/tutorial/TutorialContext";

const Index = () => {
  const { toast } = useToast();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { state } = useTutorial();
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);
  const { data: userBalances } = useBalances(userAddress);

  // Show tutorial for first-time users
  useEffect(() => {
    if (!state.isCompleted && !state.skipped && !state.isActive) {
      const hasVisited = localStorage.getItem('bxl-vault-has-visited');
      if (!hasVisited) {
        localStorage.setItem('bxl-vault-has-visited', 'true');
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

  const handleSBtcWithdraw = withUserAddressCheck(
    (address: string, amount: number) => withdrawSBtc(amount, address),
    "Please connect your wallet to withdraw sBTC"
  );

  const handleSBtcUpdate = withUserAddressCheck(
    (address: string, requestId: number, oldAmount: number, newAmount: number) => 
      withdrawSBtcUpdate(requestId, oldAmount, newAmount, address),
    "Please connect your wallet to update withdrawal"
  );

  const handleSBtcFinalize = withUserAddressCheck(
    (address: string, requestId: number, amount: number) => finalizeSbtcWithdraw(requestId, amount, address),
    "Please connect your wallet to finalize withdrawal"
  );

  const handleStxWithdraw = withUserAddressCheck(
    (address: string, amount: number) => withdrawStx(amount, address),
    "Please connect your wallet to withdraw STX"
  );

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
          <DashboardView
            userAddress={userAddress}
            userBalances={userBalances}
            onSBtcWithdraw={handleSBtcWithdraw}
            onSBtcRequestUpdate={handleSBtcUpdate}
            onSBtcFinalize={handleSBtcFinalize}
            onStxWithdraw={handleStxWithdraw}
          />
        )}

        {/* Supported Projects Section - Always Visible */}
        <SupportedProjects />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
