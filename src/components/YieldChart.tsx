import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import { formatBtc } from "@/lib/utils";
import { VAULT_CONTRACT } from "@/services/blockchain";
import { format } from "date-fns";
import { ExternalLink, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  time: number;
  displayDate: string;
  yield: number;
}

interface YieldChartProps {
  startDate: number;
  endDate: number;
}

export const YieldChart = ({ startDate, endDate }: YieldChartProps) => {
  const { data, isLoading } = useTransactions(VAULT_CONTRACT);
  const navigate = useNavigate();

  // Flatten all pages into a single array
  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];
  const yieldTxs = transactions.filter((tx) => tx.type === "yield");

  // Transform yield transactions for chart display, grouping by day
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const groupedByDay: Record<string, { total: number; timestamp: Date }> = {};
    
    yieldTxs.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const time = date.getTime();
      if (time < startDate || time > endDate) return;
      const dayKey = format(date, "yyyy-MM-dd");
      
      if (groupedByDay[dayKey]) {
        groupedByDay[dayKey].total += tx.amount;
      } else {
        groupedByDay[dayKey] = { total: tx.amount, timestamp: date };
      }
    });
    
    return Object.entries(groupedByDay)
      .map(([, data]) => ({
        time: data.timestamp.getTime(),
        displayDate: format(data.timestamp, "dd MMMM yyyy"),
        yield: data.total,
      }))
      .sort((a, b) => a.time - b.time);
  }, [yieldTxs, startDate, endDate]);

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
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="time"
                    type="number"
                    scale="time"
                    domain={[startDate, endDate]}
                    className="text-xs"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickFormatter={(value) => format(new Date(value), "dd MMM")}
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
                              {payload[0].payload.displayDate}
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
                  <Bar
                    dataKey="yield"
                    fill="hsl(var(--primary))"
                    maxBarSize={4}
                  />
                </BarChart>
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
            <div
              className="p-4 bg-primary/5 border border-primary/10 rounded-lg cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate("/vault/yield")}
            >
              <p className="text-sm text-muted-foreground">Total Distributed</p>
              <p className="text-2xl font-bold text-primary">
                {formatBtc(totalYield)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                All-time sBTC <ExternalLink className="h-3 w-3" />
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
