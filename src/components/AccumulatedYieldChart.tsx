import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import { formatBtc } from "@/lib/utils";
import { VAULT_CONTRACT } from "@/services/blockchain";
import { format } from "date-fns";
import { Wallet } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceDot,
} from "recharts";

interface AccumulatedDataPoint {
  time: number;
  displayDate: string;
  accumulated: number;
  event: "yield" | "payout";
  amount: number;
}

export const AccumulatedYieldChart = () => {
  const { data, isLoading } = useTransactions(VAULT_CONTRACT);

  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];

  const chartData = useMemo<AccumulatedDataPoint[]>(() => {
    // Collect yield (incoming) and transfer/payout (outgoing) transactions
    const relevantTxs = transactions
      .filter((tx) => tx.type === "yield" || tx.type === "transfer")
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let accumulated = 0;
    return relevantTxs.map((tx) => {
      const date = new Date(tx.timestamp);
      const isYield = tx.type === "yield";
      accumulated += isYield ? tx.amount : -tx.amount;

      return {
        time: date.getTime(),
        displayDate: format(date, "dd MMMM yyyy"),
        accumulated,
        event: isYield ? "yield" : "payout",
        amount: tx.amount,
      };
    });
  }, [transactions]);

  const payoutPoints = chartData.filter((d) => d.event === "payout");

  if (isLoading) {
    return (
      <Card className="gradient-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Accumulated Yield
            <Wallet className="w-5 h-5 text-accent" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Accumulated Bitcoin Yield
          <Wallet className="w-5 h-5 text-accent" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="accYieldGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--accent))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--accent))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="time"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => format(new Date(value), "dd MMM")}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `${value.toFixed(5)}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload as AccumulatedDataPoint;
                        return (
                          <div className="bg-card border border-accent/20 rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-semibold">
                              {point.displayDate}
                            </p>
                            <p className="text-sm text-accent">
                              Accumulated: {formatBtc(point.accumulated)} sBTC
                            </p>
                            <p className={`text-sm ${point.event === "yield" ? "text-green-500" : "text-orange-500"}`}>
                              {point.event === "yield" ? "+" : "−"}{formatBtc(point.amount)} sBTC ({point.event === "yield" ? "yield" : "payout"})
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="accumulated"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#accYieldGradient)"
                  />
                  {payoutPoints.map((point, i) => (
                    <ReferenceDot
                      key={`payout-${i}`}
                      x={point.time}
                      y={point.accumulated}
                      r={5}
                      fill="hsl(var(--destructive))"
                      stroke="hsl(var(--destructive))"
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No yield data available yet
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span>Yield received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Payout to community</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
