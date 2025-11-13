import { Layout } from "@/components/Layout";
import { useLayout } from "@/contexts/LayoutContext";
import { SupportedProjects } from "@/components/SupportedProjects";
import { DashboardView } from "@/components/home/DashboardView";
import { MarketingView } from "@/components/home/MarketingView";
import { depositSBtc, depositStx } from "@/services/blockchain";
import { useToast } from "@/hooks/use-toast";

const IndexContent = () => {
  const { userAddress, userBalances, vaultBalances, totalBxlBTC } = useLayout();
  const { toast } = useToast();

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

  const earnedYield =
    (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ? totalBxlBTC / 1e8 : 0);

  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
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
    </main>
  );
};

const Index = () => (
  <Layout>
    <IndexContent />
  </Layout>
);

export default Index;
