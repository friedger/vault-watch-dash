import { useState } from "react";
import {
  depositSBtc,
  depositStx,
  VAULT_CONTRACT,
  BXL_BTC_CONTRACT,
  BXL_STX_CONTRACT,
} from "@/services/blockchain";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DepositCard } from "@/components/DepositCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { BalanceCard } from "@/components/BalanceCard";
import { Coins, TrendingUp } from "lucide-react";
import daoLogo from "@/assets/dao-logo.png";
import { Toast } from "@/components/ui/toast";
import { toast } from "sonner";
import { formatBtc } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Deposit = () => {
  const { toast } = useToast();

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);

  const sBtcBalance = userBalances?.sBtc ?? 0;
  const stxBalance = userBalances?.stx ?? 0;

  // Fetch total vault supplies
  const { data: totalBxlBTC } = useTotalSupply(BXL_BTC_CONTRACT);
  const { data: totalBxlSTX } = useTotalSupply(BXL_STX_CONTRACT);

  // Calculate earned yield
  const earnedYield = Math.max(
    0,
    (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ?? 0)
  );

  const handleSBtcDeposit = (amount: number) => {
    if (userAddress) {
      depositSBtc(amount, userAddress);
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deposit sBTC",
        variant: "destructive",
      });
    }
  };

  const handleStxDeposit = (amount: number) => {
    if (userAddress) {
      depositStx(amount, userAddress);
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deposit STX",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={sBtcBalance}
        stxBalance={stxBalance}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        bxlSTX={userBalances?.bxlSTX ?? 0}
        pageTitle="Deposit Assets"
        backLink="/"
        showDashboardLink={true}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Deposit Assets</h1>
            <p className="text-muted-foreground">
              Deposit sBTC to earn yield through dual stacking
            </p>
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
                    Connect your wallet to deposit Bitcoin into the BXL Vault.
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
              <div className="gradient-card border border-primary/20 rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      About the Vault
                    </h3>
                    <p className="text-muted-foreground">
                      BXL Vault enables you to grant access to your Bitcoin to
                      the community without losing ownership. The community
                      actively uses these assets to generate yield, which is
                      then allocated by community stewards to build and support
                      the Brussels Crypto Community. Monitor your contributions
                      and the collective yield earned through this dashboard.
                    </p>
                  </div>
                </div>

                {/* Vault Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BalanceCard
                    title="Total Vault sBTC"
                    balance={`${formatBtc(totalBxlBTC ?? 0)} BTC`}
                    icon={<Coins className="h-5 w-5 text-primary" />}
                  />
                  <BalanceCard
                    title="Earned Yield"
                    balance={`${formatBtc(earnedYield)} sBTC`}
                    icon={<TrendingUp className="h-5 w-5 text-primary" />}
                    isYield
                  />
                </div>

                {/* See Details Button */}
                <div className="pt-2">
                  <Link to="/vault">
                    <Button variant="outline" className="w-full">
                      See Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Deposit;
