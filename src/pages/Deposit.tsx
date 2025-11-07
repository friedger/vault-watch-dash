import { useState } from "react";
import { Link } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceSummary } from "@/components/BalanceSummary";
import { DepositCard } from "@/components/DepositCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useBalances } from "@/hooks/useBalances";
import daoLogo from "@/assets/dao-logo.png";

const Deposit = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);
  
  const sBtcBalance = userBalances?.sBtc ?? 0;
  const stxBalance = userBalances?.stx ?? 0;

  const handleSBtcDeposit = (amount: number) => {
    // TODO: Implement actual deposit transaction
    console.log('Deposit sBTC:', amount);
  };

  const handleStxDeposit = (amount: number) => {
    // TODO: Implement actual deposit transaction
    console.log('Deposit STX:', amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={daoLogo} 
                alt="DAO Brussels" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DAO Brussels
                </h1>
                <p className="text-sm text-muted-foreground">Deposit Assets</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {userAddress && (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <BalanceSummary
                    sBtcBalance={sBtcBalance}
                    stxBalance={stxBalance}
                    bxlBTC={userBalances?.bxlBTC ?? 0}
                    blxSTX={userBalances?.blxSTX ?? 0}
                  />
                </>
              )}
              <WalletConnect onAddressChange={setUserAddress} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Deposit Assets</h1>
            <p className="text-muted-foreground">Deposit sBTC and STX to earn yield through dual stacking</p>
          </div>

          {!userAddress ? (
            <>
              <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in py-12">
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
                    Connect your wallet to deposit sBTC and STX into the DAO Brussels Vault.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
                <WalletConnect onAddressChange={setUserAddress} />
              </div>
            </>
          ) : (
            <div className="animate-fade-in space-y-8">
              <DepositCard 
                onSBtcDeposit={handleSBtcDeposit}
                onStxDeposit={handleStxDeposit}
                sBtcBalance={sBtcBalance}
                stxBalance={stxBalance}
              />

              {/* About the Vault Section */}
              <div className="gradient-card border border-primary/20 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About the Vault</h3>
                  <p className="text-muted-foreground">
                    The DAO Brussels Vault enables you to grant access to your sBTC and STX assets to the 
                    community without losing ownership. The community actively uses these assets to generate 
                    yield, which is then allocated by community stewards to build and develop the Commons in 
                    Brussels. Monitor your contributions and the collective yield earned through this dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Deposit;
