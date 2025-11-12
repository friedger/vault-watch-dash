import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PortfolioChart } from "@/components/PortfolioChart";
import { WithdrawCard } from "@/components/WithdrawCard";
import daoLogo from "@/assets/dao-logo.png";
import { useBalances } from "@/hooks/useBalances";
import { 
  withdrawSBtc, 
  withdrawStx, 
  withdrawSBtcUpdate, 
  finalizeSbtcWithdraw 
} from "@/services/blockchain";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);

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
    (address: string, requestId: number, oldAmount:number, newAmount: number) => 
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

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={userBalances?.sBtc ?? 0}
        stxBalance={userBalances?.stx ?? 0}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        bxlSTX={userBalances?.bxlSTX ?? 0}
      />
      <Navigation userAddress={userAddress} isAdmin={isAdmin} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!userAddress ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-20 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <img
                src={daoLogo}
                alt="DAO Brussels"
                className="h-32 w-32 object-contain relative z-10"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Connect your wallet to view your dashboard, manage your assets,
                and track your transaction history.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Withdraw Card */}
            <div className="max-w-xl mx-auto">
              <WithdrawCard
                onSBtcWithdraw={handleSBtcWithdraw}
                onSBtcRequestUpdate={handleSBtcUpdate}
                onSBtcFinalize={handleSBtcFinalize}
                onStxWithdraw={handleStxWithdraw}
                bxlBtcBalance={userBalances?.bxlBTC ?? 0}
                bxlBtcTransitionBalance={userBalances?.bxlBTCTransit ?? 0}
                bxlStxBalance={userBalances?.bxlSTX ?? 0}
              />
            </div>

            {/* Portfolio Chart */}
            <PortfolioChart
              sBtc={userBalances?.sBtc ?? 0}
              stx={userBalances?.stx ?? 0}
              bxlBTC={
                (userBalances?.bxlBTC ?? 0) + (userBalances?.bxlBTCTransit ?? 0)
              }
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

export default Dashboard;
