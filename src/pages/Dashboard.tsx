import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceSummary } from "@/components/BalanceSummary";
import { WithdrawCard } from "@/components/WithdrawCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PortfolioChart } from "@/components/PortfolioChart";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import daoLogo from "@/assets/dao-logo.png";
import { useBalances } from "@/hooks/useBalances";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);

  const handleSBtcWithdraw = (amount: number) => {
    console.log('Withdraw sBTC:', amount);
  };

  const handleStxWithdraw = (amount: number) => {
    console.log('Withdraw STX:', amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <img 
                src={daoLogo} 
                alt="DAO Brussels" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DAO Brussels
                </h1>
                <p className="text-sm text-muted-foreground">User Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {userAddress && (
                <BalanceSummary
                  sBtcBalance={userBalances?.sBtc ?? 0}
                  stxBalance={userBalances?.stx ?? 0}
                  bxlBTC={userBalances?.bxlBTC ?? 0}
                  blxSTX={userBalances?.blxSTX ?? 0}
                />
              )}
              <WalletConnect onAddressChange={setUserAddress} />
            </div>
          </div>
        </div>
      </header>

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
                Connect your wallet to view your dashboard, manage your assets, and track your transaction history.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Portfolio Chart */}
            <PortfolioChart
              sBtc={userBalances?.sBtc ?? 0}
              stx={userBalances?.stx ?? 0}
              bxlBTC={userBalances?.bxlBTC ?? 0}
              blxSTX={userBalances?.blxSTX ?? 0}
            />

            {/* Withdraw Card */}
            <div className="max-w-xl mx-auto">
              <WithdrawCard
                onSBtcWithdraw={handleSBtcWithdraw}
                onStxWithdraw={handleStxWithdraw}
                bxlBtcBalance={userBalances?.bxlBTC ?? 0}
                blxStxBalance={userBalances?.blxSTX ?? 0}
              />
            </div>

            {/* Transaction History */}
            <TransactionHistory />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
