import { useState } from "react";
import { DepositCard } from "@/components/DepositCard";
import { QuickStatsBar } from "@/components/home/QuickStatsBar";
import { QuickActionCards } from "@/components/home/QuickActionCards";
import { PortfolioDialog } from "@/components/PortfolioDialog";
import { VaultPreviewDialog } from "@/components/VaultPreviewDialog";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import daoLogo from "@/assets/dao-logo.png";

interface DashboardViewProps {
  userAddress: string;
  balances: {
    sBtc: number;
    stx: number;
    bxlBTC: number;
    bxlBTCTransit: number;
    bxlSTX: number;
  };
  vaultSbtc: number;
  earnedYield: number;
  onSBtcDeposit: (amount: number) => void;
  onStxDeposit: (amount: number) => void;
}

export const DashboardView = ({
  userAddress,
  balances,
  vaultSbtc,
  earnedYield,
  onSBtcDeposit,
  onStxDeposit,
}: DashboardViewProps) => {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const { data: prices } = useCryptoPrices();

  // Calculate metrics for QuickStatsBar
  const userContribution = 
    (balances.bxlBTC + balances.bxlBTCTransit) * (prices?.btcEur ?? 0) +
    balances.bxlSTX * (prices?.stxEur ?? 0);
  
  const totalVault = vaultSbtc * (prices?.btcEur ?? 0);
  const communityYieldEur = earnedYield * (prices?.btcEur ?? 0);

  const userBalancesEur = 
    (balances.sBtc + balances.bxlBTC + balances.bxlBTCTransit) * (prices?.btcEur ?? 0) +
    (balances.stx + balances.bxlSTX) * (prices?.stxEur ?? 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <img
            src={daoLogo}
            alt="DAO Brussels"
            className="h-24 w-24 object-contain relative z-10 mx-auto"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Welcome Back! 👋
        </h2>
        <p className="text-muted-foreground text-lg">
          Manage your deposits and track your contribution to the Brussels crypto community.
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStatsBar
        userContribution={userContribution}
        totalVault={totalVault}
        communityYield={earnedYield}
        communityYieldEur={communityYieldEur}
      />

      {/* Primary Action: Deposit */}
      <div className="max-w-xl mx-auto">
        <DepositCard
          onSBtcDeposit={onSBtcDeposit}
          onStxDeposit={onStxDeposit}
          sBtcBalance={balances.sBtc}
          stxBalance={balances.stx}
        />
      </div>

      {/* Quick Action Cards */}
      <QuickActionCards
        userBalancesEur={userBalancesEur}
        hasActiveWithdrawal={balances.bxlBTCTransit > 0}
        onPortfolioClick={() => setPortfolioOpen(true)}
        onVaultClick={() => setVaultOpen(true)}
      />

      {/* Dialogs */}
      <PortfolioDialog
        open={portfolioOpen}
        onOpenChange={setPortfolioOpen}
        userAddress={userAddress}
        balances={balances}
      />

      <VaultPreviewDialog
        open={vaultOpen}
        onOpenChange={setVaultOpen}
        vaultSbtc={vaultSbtc}
        earnedYield={earnedYield}
      />
    </div>
  );
};
