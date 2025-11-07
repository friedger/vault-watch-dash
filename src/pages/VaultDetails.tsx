import { useState } from "react";
import { Link } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { BalanceCard } from "@/components/BalanceCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bitcoin, TrendingUp, Coins } from "lucide-react";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { VAULT_ADDRESS } from "@/services/blockchain";
import daoLogo from "@/assets/dao-logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VaultDetails = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);
  const { data: vaultBalances } = useBalances(VAULT_ADDRESS);

  // Fetch total vault supplies
  const { data: totalBxlBTC } = useTotalSupply('SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK', 'token-wbtc');
  const { data: totalBlxSTX } = useTotalSupply('SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK', 'token-wstx');

  // Calculate earned yield: vault sBTC - total supply of wrapped sBTC
  const earnedYield = Math.max(0, (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ?? 0));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/deposit">
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
                <p className="text-sm text-muted-foreground">Vault Details</p>
              </div>
            </div>
            <WalletConnect 
              onAddressChange={setUserAddress}
              sBtcBalance={userBalances?.sBtc ?? 0}
              stxBalance={userBalances?.stx ?? 0}
              bxlBTC={userBalances?.bxlBTC ?? 0}
              blxSTX={userBalances?.blxSTX ?? 0}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Vault Details</h1>
            <p className="text-muted-foreground text-lg">
              Complete overview of the DAO Brussels Vault assets and performance
            </p>
          </div>

          {/* sBTC Focus Section */}
          <Card className="gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="w-6 h-6 text-primary" />
                sBTC Vault Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard
                  title="Total Vault sBTC"
                  balance={`${(vaultBalances?.sBtc ?? 0).toFixed(8)}`}
                  subBalance="Bitcoin held in vault"
                  icon={<Bitcoin className="h-5 w-5 text-primary" />}
                />
                <BalanceCard
                  title="Wrapped Supply"
                  balance={`${(totalBxlBTC ?? 0).toFixed(8)}`}
                  subBalance="bxlBTC in circulation"
                  icon={<Coins className="h-5 w-5 text-primary" />}
                />
                <BalanceCard
                  title="Earned Yield"
                  balance={`${earnedYield.toFixed(8)}`}
                  subBalance="sBTC yield generated"
                  icon={<TrendingUp className="h-5 w-5 text-primary" />}
                  isYield
                />
              </div>

              {/* sBTC Statistics */}
              <div className="mt-6 p-6 bg-primary/5 border border-primary/10 rounded-lg space-y-4">
                <h4 className="font-semibold text-lg">sBTC Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilization Rate</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalBxlBTC && vaultBalances?.sBtc 
                        ? ((totalBxlBTC / vaultBalances.sBtc) * 100).toFixed(2) 
                        : '0.00'}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Percentage of vault sBTC wrapped
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Yield Rate</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalBxlBTC && earnedYield > 0
                        ? ((earnedYield / totalBxlBTC) * 100).toFixed(2)
                        : '0.00'}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Yield generated per wrapped sBTC
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STX Overview Section */}
          <Card className="gradient-card border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-secondary" />
                STX Vault Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceCard
                  title="Total Vault STX"
                  balance={`${(vaultBalances?.stx ?? 0).toLocaleString()}`}
                  subBalance="STX held in vault"
                  icon={<Coins className="h-5 w-5 text-secondary" />}
                />
                <BalanceCard
                  title="Wrapped Supply"
                  balance={`${(totalBlxSTX ?? 0).toLocaleString()}`}
                  subBalance="blxSTX in circulation"
                  icon={<Coins className="h-5 w-5 text-secondary" />}
                />
              </div>

              {/* STX Statistics */}
              <div className="mt-6 p-6 bg-secondary/5 border border-secondary/10 rounded-lg">
                <h4 className="font-semibold text-lg mb-4">STX Statistics</h4>
                <div>
                  <p className="text-sm text-muted-foreground">Utilization Rate</p>
                  <p className="text-2xl font-bold text-secondary">
                    {totalBlxSTX && vaultBalances?.stx 
                      ? ((totalBlxSTX / vaultBalances.stx) * 100).toFixed(2) 
                      : '0.00'}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of vault STX wrapped
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="gradient-card border-primary/20">
            <CardHeader>
              <CardTitle>How the Vault Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The DAO Brussels Vault enables community members to contribute their sBTC and STX assets 
                while maintaining ownership. The vault actively generates yield through dual stacking on 
                the Stacks blockchain.
              </p>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                <ul className="space-y-2 ml-4 list-disc">
                  <li><strong>Wrapped Tokens:</strong> When you deposit, you receive bxlBTC or blxSTX tokens representing your share</li>
                  <li><strong>Yield Generation:</strong> The vault stakes assets to earn Bitcoin rewards through dual stacking</li>
                  <li><strong>Community Governed:</strong> Earned yield is allocated by stewards to develop the Commons in Brussels</li>
                  <li><strong>Instant Withdrawals:</strong> Redeem your wrapped tokens for the underlying assets anytime</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/deposit">
              <Button size="lg" className="w-full sm:w-auto">
                Deposit Assets
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VaultDetails;
