import { Card, CardContent } from "@/components/ui/card";
import { User, Vault, TrendingUp } from "lucide-react";
import { formatEur, formatBtc } from "@/lib/utils";

interface QuickStatsBarProps {
  userContribution: number; // EUR value
  totalVault: number; // EUR value
  communityYield: number; // BTC value
  communityYieldEur: number; // EUR value
}

export const QuickStatsBar = ({
  userContribution,
  totalVault,
  communityYield,
  communityYieldEur,
}: QuickStatsBarProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your Contribution</p>
            <p className="text-lg font-bold">{formatEur(userContribution)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-secondary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Vault className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Vault</p>
            <p className="text-lg font-bold">{formatEur(totalVault)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Community Yield</p>
            <p className="text-lg font-bold">{formatBtc(communityYield)} sBTC</p>
            <p className="text-xs text-muted-foreground">{formatEur(communityYieldEur)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
