import { BalanceCard } from "@/components/BalanceCard";
import { useBalances } from "@/hooks/useBalances";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { formatBtc, formatEur } from "@/lib/utils";
import { VAULT_CONTRACT, BXL_BTC_CONTRACT } from "@/services/blockchain";
import { Bitcoin, Coins, TrendingUp } from "lucide-react";

export const VaultOverviewCards = () => {
  // Fetch vault balances
  const { data: vaultBalances } = useBalances(VAULT_CONTRACT);

  // Fetch total vault supplies
  const { data: totalBxlBTC } = useTotalSupply(BXL_BTC_CONTRACT);

  // Fetch crypto prices
  const { data: prices } = useCryptoPrices();

  // Calculate earned yield: vault sBTC - total supply of wrapped sBTC
  const earnedYield = Math.max(
    0,
    (vaultBalances?.sBtc ?? 0) - (totalBxlBTC ?? 0)
  );

  // Calculate EUR values
  const wrappedBtcEur = (vaultBalances?.sBtc ?? 0) * (prices?.btcEur ?? 0);
  const earnedYieldEur = earnedYield * (prices?.btcEur ?? 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BalanceCard
        title="Total Bitcoin in Vault"
        balance={formatEur(wrappedBtcEur)}
        subBalance={`${formatBtc(vaultBalances?.sBtc ?? 0)} sBTC`}
        subLabel="Securing"
        icon={<Bitcoin className="h-5 w-5 text-primary" />}
      />
      <BalanceCard
        title="Usable Bitcoin"
        balance={`${formatBtc(earnedYield)} sBTC`}
        subBalance={formatEur(earnedYieldEur)}
        subLabel="Total earned"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
        isYield
      />
      <BalanceCard
        title="Monthly Community Budget"
        balance={formatEur(earnedYieldEur / 12)}
        subBalance={`${formatBtc(earnedYield / 12)} sBTC`}
        subLabel="Estimated"
        icon={<Coins className="h-5 w-5 text-primary" />}
      />
    </div>
  );
};
