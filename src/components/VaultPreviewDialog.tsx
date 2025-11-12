import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/components/BalanceCard";
import { Bitcoin, TrendingUp, Coins } from "lucide-react";
import { formatBtc, formatEur } from "@/lib/utils";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { useNavigate } from "react-router-dom";

interface VaultPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultSbtc: number;
  earnedYield: number;
}

export const VaultPreviewDialog = ({
  open,
  onOpenChange,
  vaultSbtc,
  earnedYield,
}: VaultPreviewDialogProps) => {
  const { data: prices } = useCryptoPrices();
  const navigate = useNavigate();

  const wrappedBtcEur = vaultSbtc * (prices?.btcEur ?? 0);
  const earnedYieldEur = earnedYield * (prices?.btcEur ?? 0);

  const handleViewFullDetails = () => {
    onOpenChange(false);
    navigate("/vault");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">BXL Vault Overview</DialogTitle>
          <DialogDescription>
            Quick snapshot of the community vault holdings
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <BalanceCard
            title="Total Treasury"
            balance={formatEur(wrappedBtcEur)}
            subBalance={`${formatBtc(vaultSbtc)} sBTC`}
            subLabel="Total Bitcoin"
            icon={<Bitcoin className="h-5 w-5 text-primary" />}
          />
          <BalanceCard
            title="Usable Bitcoin"
            balance={`${formatBtc(earnedYield)} sBTC`}
            subBalance={formatEur(earnedYieldEur)}
            subLabel="Community Yield"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            isYield
          />
          <BalanceCard
            title="Monthly Budget"
            balance={formatEur(earnedYieldEur / 12)}
            subBalance={`${formatBtc(earnedYield / 12)} sBTC`}
            subLabel="Estimated"
            icon={<Coins className="h-5 w-5 text-primary" />}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleViewFullDetails} className="w-full">
            View Full Vault Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
