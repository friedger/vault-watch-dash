import { useState } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceCard } from "@/components/BalanceCard";
import { BalanceSummary } from "@/components/BalanceSummary";
import { DepositCard } from "@/components/DepositCard";
import { DepositWithdrawCard } from "@/components/DepositWithdrawCard";
import { Bitcoin, Coins, TrendingUp, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import daoLogo from "@/assets/dao-logo.png";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { VAULT_ADDRESS } from "@/services/blockchain";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
  // Fetch vault balances (always)
  const { data: vaultBalances } = useBalances(VAULT_ADDRESS);
  
  // Fetch user balances (when connected)
  const { data: userBalances } = useBalances(userAddress);
  
  // Fetch total supply of wrapped BTC for yield calculation
  const { data: wrappedBtcSupply = 0 } = useTotalSupply(
    'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK',
    'token-wbtc'
  );
  
  // Fetch total supply of wrapped STX
  const { data: wrappedStxSupply = 0 } = useTotalSupply(
    'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK',
    'token-wstx'
  );
  
  // Use vault balances for display, or fallback to 0
  const displayBalances = userAddress ? userBalances : vaultBalances;
  const sBtcBalance = displayBalances?.sBtc ?? 0;
  const stxBalance = displayBalances?.stx ?? 0;
  
  // Calculate earned yield: vault sBTC - total supply of wrapped sBTC
  const earnedYield = Math.max(0, (vaultBalances?.sBtc ?? 0) - wrappedBtcSupply);

  const handleSBtcDeposit = (amount: number) => {
    // TODO: Implement actual deposit transaction
    console.log('Deposit sBTC:', amount);
  };

  const handleSBtcWithdraw = (amount: number) => {
    // TODO: Implement actual withdraw transaction
    console.log('Withdraw sBTC:', amount);
  };

  const handleStxDeposit = (amount: number) => {
    // TODO: Implement actual deposit transaction
    console.log('Deposit STX:', amount);
  };

  const handleStxWithdraw = (amount: number) => {
    // TODO: Implement actual withdraw transaction
    console.log('Withdraw STX:', amount);
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
                <p className="text-sm text-muted-foreground">Vault Dashboard</p>
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
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Balance Overview - Only for vault when not logged in */}
        {!userAddress && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Vault Balance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BalanceCard
                title="sBTC Balance"
                balance={`${sBtcBalance.toFixed(8)} sBTC`}
                subBalance={`${wrappedBtcSupply.toFixed(8)} bxlBTC`}
                subLabel="Total Supply"
                icon={<Bitcoin className="w-5 h-5 text-primary" />}
              />
              <BalanceCard
                title="STX Balance"
                balance={`${stxBalance.toLocaleString()} STX`}
                subBalance={`${(displayBalances?.blxSTX ?? 0).toLocaleString()} blxSTX`}
                subLabel="Total Supply"
                icon={<Coins className="w-5 h-5 text-secondary" />}
              />
              <BalanceCard
                title="Earned Yield"
                balance={`${earnedYield.toFixed(8)} sBTC`}
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
                isYield
              />
            </div>
          </div>
        )}

        {!userAddress ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
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
                Contribute to the Commons by granting access to your assets while maintaining ownership. 
                The DAO Brussels community generates yield from deposited assets, which stewards use to 
                build and develop the Commons in Brussels.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Main Deposit Section */}
            <div className="max-w-xl mx-auto">
              <DepositCard 
                onSBtcDeposit={handleSBtcDeposit}
                onStxDeposit={handleStxDeposit}
                sBtcBalance={userBalances?.sBtc ?? 0}
                stxBalance={userBalances?.stx ?? 0}
              />
            </div>

            {/* Withdraw Section - Only show if user has wrapped tokens */}
            {((userBalances?.bxlBTC ?? 0) > 0 || (userBalances?.blxSTX ?? 0) > 0) && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Withdraw Assets</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(userBalances?.bxlBTC ?? 0) > 0 && (
                    <DepositWithdrawCard
                      tokenType="sBTC"
                      onDeposit={handleSBtcDeposit}
                      onWithdraw={handleSBtcWithdraw}
                    />
                  )}
                  {(userBalances?.blxSTX ?? 0) > 0 && (
                    <DepositWithdrawCard
                      tokenType="STX"
                      onDeposit={handleStxDeposit}
                      onWithdraw={handleStxWithdraw}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="gradient-card border border-primary/20 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About the Vault</h3>
                <p className="text-muted-foreground">
                  The DAO Brussels Vault enables you to grant access to your sBTC and STX assets to the 
                  community without losing ownership. The community actively uses these assets to generate 
                  yield, which is then allocated by community stewards to build and develop the Commons in 
                  Brussels. Monitor your contributions and the collective yield earned through this dashboard.
                </p>
              </div>

              {/* Vault Stats */}
              <div className="border-t border-border pt-6">
                <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Vault Statistics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Bitcoin className="w-5 h-5 text-primary" />
                      <p className="text-sm font-semibold">sBTC</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Vault Balance</p>
                        <p className="text-2xl font-bold text-primary">
                          {(vaultBalances?.sBtc ?? 0).toFixed(8)}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-primary/10">
                        <p className="text-xs text-muted-foreground">bxlBTC Supply</p>
                        <p className="text-lg font-semibold">
                          {wrappedBtcSupply.toFixed(8)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Coins className="w-5 h-5 text-secondary" />
                      <p className="text-sm font-semibold">STX</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Vault Balance</p>
                        <p className="text-2xl font-bold text-secondary">
                          {(vaultBalances?.stx ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-secondary/10">
                        <p className="text-xs text-muted-foreground">blxSTX Supply</p>
                        <p className="text-lg font-semibold">
                          {wrappedStxSupply.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <p className="text-sm font-semibold">Yield Earned</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Earned</p>
                        <p className="text-2xl font-bold text-primary">
                          {earnedYield.toFixed(8)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">sBTC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
