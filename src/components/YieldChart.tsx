import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import { formatBtc } from "@/lib/utils";
import { VAULT_CONTRACT } from "@/services/blockchain";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  month: string;
  yield: number;
  timestamp: Date;
}

export const YieldChart = () => {
  const { data, isLoading } = useTransactions(VAULT_CONTRACT);

  // Flatten all pages into a single array
  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];
  const yieldTxs = transactions.filter((tx) => tx.type === "yield");

  // Transform yield transactions for chart display
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return yieldTxs
      .map((tx) => ({
        month: format(new Date(tx.timestamp), "MMM yyyy"),
        yield: tx.amount,
        timestamp: new Date(tx.timestamp),
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [yieldTxs]);

  const totalYield = yieldTxs.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  const averageYield = yieldTxs.length > 0 ? totalYield / yieldTxs.length : 0;
  const currentMonthYield =
    chartData.length > 0 ? chartData[chartData.length - 1]?.yield ?? 0 : 0;

  if (isLoading) {
    return (
      <Card className="gradient-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Bitcoins Yield for the Community
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Bitcoins for the Community
          <TrendingUp className="w-5 h-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-[300px] w-full">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="yieldGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickFormatter={(value) => `${value.toFixed(6)}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-primary/20 rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-semibold">
                              {payload[0].payload.month}
                            </p>
                            <p className="text-sm text-primary">
                              Yield: {formatBtc(Number(payload[0].value))} sBTC
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#yieldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No yield data available yet
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Latest Month</p>
              <p className="text-2xl font-bold text-primary">
                {formatBtc(currentMonthYield)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                sBTC distributed
              </p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Distributed</p>
              <p className="text-2xl font-bold text-primary">
                {formatBtc(totalYield)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All-time sBTC
              </p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Monthly</p>
              <p className="text-2xl font-bold text-primary">
                {formatBtc(averageYield)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                sBTC per month
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
