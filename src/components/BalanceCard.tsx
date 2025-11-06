import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface BalanceCardProps {
  title: string;
  balance: string;
  subBalance?: string;
  subLabel?: string;
  icon?: React.ReactNode;
  isYield?: boolean;
}

export const BalanceCard = ({ 
  title, 
  balance, 
  subBalance, 
  subLabel, 
  icon,
  isYield = false 
}: BalanceCardProps) => {
  return (
    <Card className="gradient-card border-primary/10 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className={`text-3xl font-bold ${isYield ? 'text-primary' : ''}`}>
            {balance}
          </p>
          {subBalance && (
            <p className="text-sm text-muted-foreground">
              {subLabel}: <span className="text-foreground">{subBalance}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
