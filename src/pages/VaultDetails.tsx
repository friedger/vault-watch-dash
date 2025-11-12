import { BalanceCard } from "@/components/BalanceCard";
import { YieldChart } from "@/components/YieldChart";
import { SupportedProjects } from "@/components/SupportedProjects";
import { Footer } from "@/components/Footer";
import { VaultOverviewCards } from "@/components/VaultOverviewCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { formatEur, formatStx } from "@/lib/utils";
import {
  VAULT_CONTRACT,
  BXL_BTC_CONTRACT,
  BXL_STX_CONTRACT,
} from "@/services/blockchain";
import { Coins } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const VaultDetails = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { data: userBalances } = useBalances(userAddress);
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);
  const { data: prices } = useCryptoPrices();

  // Fetch total vault supplies
  const { data: totalBxlBTC } = useTotalSupply(BXL_BTC_CONTRACT);
  const { data: totalBxlSTX } = useTotalSupply(BXL_STX_CONTRACT);

  // Calculate earned yield for YieldChart component
  const earnedYield = Math.max(
    0,
    (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ?? 0)
  );

  // Calculate EUR values for STX section only
  const vaultStxEur = (vaultBalances?.stx ?? 0) * (prices?.stxEur ?? 0);
  const lockedStxEur = (vaultBalances?.lockedStx ?? 0) * (prices?.stxEur ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userAddress={userAddress}
        onAddressChange={setUserAddress}
        sBtcBalance={userBalances?.sBtc ?? 0}
        stxBalance={userBalances?.stx ?? 0}
        bxlBTC={userBalances?.bxlBTC ?? 0}
        bxlSTX={userBalances?.bxlSTX ?? 0}
        pageTitle="Vault Details"
        backLink="/"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Vault Details</h1>
            <p className="text-muted-foreground text-lg">
              Overview of the BXL Vault assets and performance
            </p>
          </div>

          {/* sBTC Focus Section */}
          <Card className="gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VaultOverviewCards />
            </CardContent>
          </Card>

          {/* Yield Chart */}
          <YieldChart currentYield={earnedYield} />

          {/* STX Overview Section */}
          <Card className="gradient-card border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-secondary" />
                Stacking STX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceCard
                  title="Total STX in Vault"
                  balance={formatStx(vaultBalances?.stx ?? 0)}
                  subBalance={formatEur(vaultStxEur)}
                  subLabel="EUR value"
                  icon={<Coins className="h-5 w-5 text-secondary" />}
                />
                <BalanceCard
                  title="Stacked STX"
                  balance={formatStx(vaultBalances?.lockedStx ?? 0)}
                  subBalance={formatEur(lockedStxEur)}
                  subLabel="EUR value"
                  icon={<Coins className="h-5 w-5 text-secondary" />}
                />
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
                The BXL Vault lets you support the Brussels crypto community by
                storing securely your Bitcoin. You keep full ownership of your
                assets while the yield automatically funds community projects.
              </p>

              <div className="space-y-4">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Protection Feature */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🔧</div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">
                          Protection Against Wrench Attack
                        </h4>
                        <p className="text-sm">
                          1-week withdrawal delay protects you from physical
                          coercion. You have time to cancel if someone forces
                          you to withdraw.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Community Yield Feature */}
                  <div className="bg-gradient-to-r from-secondary/5 to-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🤝</div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">
                          Yield for the Community
                        </h4>
                        <p className="text-sm">
                          No donations needed. You keep your assets while the
                          community benefits from the yield they generate.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ownership Feature */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🪙</div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">
                          Your Receipt Tokens
                        </h4>
                        <p className="text-sm">
                          Receive bxlBTC or bxlSTX tokens when you deposit.
                          These represent your share and can be redeemed
                          anytime.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tax Feature */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💰</div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">
                          Non-Taxable Event
                        </h4>
                        <p className="text-sm">
                          Yield goes directly to the community as an endowment
                          model, keeping your taxes simple.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How It Works Details */}
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    How Dual Stacking Works:
                  </h4>
                  <ul className="space-y-1 ml-4 list-disc text-sm">
                    <li>
                      Your sBTC and some STX are pooled together in the vault
                    </li>
                    <li>
                      The vault participates in Dual Stacking on Stacks to earn
                      BTC rewards
                    </li>
                    <li>
                      You maintain 100% ownership through your bxlBTC/bxlSTX
                      tokens
                    </li>
                    <li>
                      All earned yield funds Brussels crypto community projects
                      and events
                    </li>
                    <li>Community stewards allocate rewards transparently</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supported Projects */}
          <SupportedProjects />

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

      <Footer />
    </div>
  );
};

export default VaultDetails;
