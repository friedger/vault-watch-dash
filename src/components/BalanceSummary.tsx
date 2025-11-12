import { Card } from "@/components/ui/card";
import { Bitcoin, Coins } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { formatBtc, formatEur, formatStx } from "@/lib/utils";

interface BalanceSummaryProps {
  sBtcBalance: number;
  stxBalance: number;
  bxlBTC: number;
  bxlSTX: number;
}

export const BalanceSummary = ({ 
  sBtcBalance, 
  stxBalance, 
  bxlBTC, 
  bxlSTX 
}: BalanceSummaryProps) => {
  const { data: prices } = useCryptoPrices();
  
  const sBtcEur = sBtcBalance * (prices?.btcEur ?? 0);
  const bxlBtcEur = bxlBTC * (prices?.btcEur ?? 0);
  const stxEur = stxBalance * (prices?.stxEur ?? 0);
  const bxlStxEur = bxlSTX * (prices?.stxEur ?? 0);
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex items-center gap-3">
        <Card className="px-4 py-2 bg-card/50 border-primary/20">
          <div className="flex items-center gap-2">
            <Bitcoin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">sBTC</p>
              <p className="text-sm font-bold">{sBtcBalance.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">bxl: {bxlBTC.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">{formatEur(sBtcEur + bxlBtcEur)}</p>
            </div>
          </div>
        </Card>
        <Card className="px-4 py-2 bg-card/50 border-primary/20">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">STX</p>
              <p className="text-sm font-bold">{formatStx(stxBalance)}</p>
              <p className="text-xs text-muted-foreground">bxl: {formatStx(bxlSTX)}</p>
              <p className="text-xs text-muted-foreground">{formatEur(stxEur + bxlStxEur)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile View - Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="md:hidden gap-2">
            <span className="text-xs">Balances</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Your Balances</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card className="p-4 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Bitcoin className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold">sBTC</p>
              </div>
              <p className="text-xl font-bold">{formatBtc(sBtcBalance)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Wrapped: {formatBtc(bxlBTC)} bxlBTC
              </p>
              <p className="text-xs text-muted-foreground">{formatEur(sBtcEur + bxlBtcEur)}</p>
            </Card>
            <Card className="p-4 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-secondary" />
                <p className="text-sm font-semibold">STX</p>
              </div>
              <p className="text-xl font-bold">{formatStx(stxBalance)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Wrapped: {formatStx(bxlSTX)} bxlSTX
              </p>
              <p className="text-xs text-muted-foreground">{formatEur(stxEur + bxlStxEur)}</p>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
