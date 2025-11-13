import { BalanceCard } from "@/components/BalanceCard";
import { YieldChart } from "@/components/YieldChart";
import { SupportedProjects } from "@/components/SupportedProjects";
import { Layout } from "@/components/Layout";
import { useLayout } from "@/contexts/LayoutContext";
import { VaultOverviewCards } from "@/components/VaultOverviewCards";
import { TransactionHistory } from "@/components/TransactionHistory";
import { VAULT_CONTRACT, BXL_STX_CONTRACT } from "@/services/blockchain";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { formatEur, formatStx } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Shield, FileText } from "lucide-react";

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
                  {formatStx(totalBxlSTX ? totalBxlSTX / 1e6 : 0)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How the Vault Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              How the Vault Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Key Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      1:1 Backed Tokens:
                    </strong>{" "}
                    Your deposits are represented by bxlBTC and bxlSTX tokens,
                    fully backed by sBTC and STX in the vault
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Wrench Attack Protection:
                    </strong>{" "}
                    Withdrawals require a time delay (minimum 1 week) or admin
                    approval, protecting against forced transfers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Community Yield:
                    </strong>{" "}
                    All yield generated through Dual Stacking goes directly to
                    DAO Brussels to fund community initiatives
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">
                      Non-Taxable Structure:
                    </strong>{" "}
                    By directing yield to the community instead of individual
                    users, the vault simplifies tax implications
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Smart Contracts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground">
                    Main Vault:
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                    {VAULT_CONTRACT}
                  </code>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground">
                    Wrapped STX:
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                    {BXL_STX_CONTRACT}
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Dual Stacking</h3>
              <p className="text-muted-foreground">
                The vault participates in Dual Stacking, a mechanism on the
                Stacks blockchain that allows sBTC to generate yield while
                maintaining its 1:1 Bitcoin backing. STX deposits enhance this
                yield through PoX stacking.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <TransactionHistory userAddress={VAULT_CONTRACT} />

        {/* Supported Projects */}
        <SupportedProjects />
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
