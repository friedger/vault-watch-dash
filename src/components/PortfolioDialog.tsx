import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BalanceSummary } from "@/components/BalanceSummary";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userAddress: string;
  balances: {
    sBtc: number;
    stx: number;
    bxlBTC: number;
    bxlBTCTransit: number;
    bxlSTX: number;
  };
}

export const PortfolioDialog = ({
  open,
  onOpenChange,
  userAddress,
  balances,
}: PortfolioDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Portfolio</DialogTitle>
          <DialogDescription>
            View your complete asset breakdown and transaction history
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
