import { BalanceCard } from "@/components/BalanceCard";
import { YieldChart } from "@/components/YieldChart";
import { SupportedProjects } from "@/components/SupportedProjects";
import { Layout } from "@/components/Layout";
import { useLayout } from "@/contexts/LayoutContext";
import { VaultOverviewCards } from "@/components/VaultOverviewCards";
import { TransactionHistory } from "@/components/TransactionHistory";
import {
  VAULT_CONTRACT,
  BXL_STX_CONTRACT,
  BXL_BTC_CONTRACT,
} from "@/services/blockchain";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { formatEur, formatStx } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Shield, FileText, ExternalLink } from "lucide-react";
import VaultHowItWorksCard from "@/components/VaultHowItWorksCard";

const VaultDetailsContent = () => {
  const { vaultBalances, totalBxlBTC } = useLayout();
  const { data: prices } = useCryptoPrices();
  const { data: totalBxlSTX } = useTotalSupply(BXL_STX_CONTRACT);

  const earnedYield =
    (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ? totalBxlBTC / 1e8 : 0);

  // Calculate EUR values for STX section only
  const vaultStxEur = (vaultBalances?.stx ?? 0) * (prices?.stxEur ?? 0);
  const lockedStxEur = (vaultBalances?.lockedStx ?? 0) * (prices?.stxEur ?? 0);

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
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
            <CardTitle className="flex items-center gap-2">Overview</CardTitle>
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
                title="Locked STX"
                balance={formatStx(vaultBalances?.lockedStx ?? 0)}
                subBalance={formatEur(lockedStxEur)}
                subLabel="EUR value"
                icon={<Shield className="h-5 w-5 text-secondary" />}
              />
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Locked STX represents tokens delegated to stacking pools to
                enhance Dual Stacking yields.
              </p>
              <p className="text-sm text-muted-foreground">
                Total wrapped STX (bxlSTX):{" "}
                <span className="font-semibold text-foreground">
                  {formatStx(totalBxlSTX ? totalBxlSTX : 0)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How the Vault Works */}
        <VaultHowItWorksCard />

        {/* Supported Projects */}
        <SupportedProjects />

        {/* Transaction History */}
        <TransactionHistory userAddress={VAULT_CONTRACT} />
      </div>
    </main>
  );
};

const VaultDetails = () => (
  <Layout>
    <VaultDetailsContent />
  </Layout>
);

export default VaultDetails;
