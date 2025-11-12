import { useState } from "react";
import { DepositCard } from "@/components/DepositCard";
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
      {/* Compact Welcome */}
      <div className="flex items-center justify-center gap-3">
        <img
          src={daoLogo}
          alt="DAO Brussels"
          className="h-12 w-12 object-contain"
        />
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
      </div>

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
        totalVaultEur={totalVault}
        communityYield={earnedYield}
        communityYieldEur={communityYieldEur}
        withdrawalAmount={balances.bxlBTCTransit}
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
