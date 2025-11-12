import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Vault, ArrowUpFromLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatEur } from "@/lib/utils";

interface QuickActionCardsProps {
  userBalancesEur: number;
  hasActiveWithdrawal: boolean;
  onPortfolioClick: () => void;
  onVaultClick: () => void;
}

export const QuickActionCards = ({
  userBalancesEur,
  hasActiveWithdrawal,
  onPortfolioClick,
  onVaultClick,
}: QuickActionCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Portfolio Card */}
      <Card 
        className="border-primary/20 hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg"
        onClick={onPortfolioClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Your Portfolio</CardTitle>
          <CardDescription>View your assets</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{formatEur(userBalancesEur)}</p>
        </CardContent>
      </Card>

      {/* Vault Card */}
      <Card 
        className="border-secondary/20 hover:border-secondary/50 cursor-pointer transition-all hover:shadow-lg"
        onClick={onVaultClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <Vault className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-xl">BXL Vault</CardTitle>
          <CardDescription>View vault details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium text-muted-foreground">Community Treasury</p>
        </CardContent>
      </Card>

      {/* Withdrawals Card */}
      <Card 
        className="border-accent/20 hover:border-accent/50 cursor-pointer transition-all hover:shadow-lg"
        onClick={() => navigate("/withdraw")}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <ArrowUpFromLine className="w-8 h-8 text-accent" />
            {hasActiveWithdrawal && (
              <Badge variant="default" className="bg-accent text-accent-foreground">Active</Badge>
            )}
          </div>
          <CardTitle className="text-xl">Withdrawals</CardTitle>
          <CardDescription>Manage your withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          {hasActiveWithdrawal ? (
            <p className="text-sm text-muted-foreground">You have an active request</p>
          ) : (
            <p className="text-sm text-muted-foreground">No active requests</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
