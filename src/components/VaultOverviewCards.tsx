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
        subBalanceLink="https://explorer.hiro.so/token/SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-btc?chain=mainnet"
        subLabel="Securing"
        icon={<Bitcoin className="h-5 w-5 text-primary" />}
      />
      <BalanceCard
        title="Claimable yield"
        balance={`${formatBtc(earnedYield)} sBTC`}
        subBalance={formatEur(earnedYieldEur)}
        subLabel="Yield + BxlBTC in transit"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
        isYield
      />
      <BalanceCard
        title="Monthly Community Budget"
        balance={formatEur(wrappedBtcEur * 0.05 / 12)}
        subBalance={`${formatBtc((vaultBalances?.sBtc ?? 0) * 0.05 / 12)} sBTC`}
        subLabel="Estimated"
        icon={<Coins className="h-5 w-5 text-primary" />}
      />
    </div>
  );
};
