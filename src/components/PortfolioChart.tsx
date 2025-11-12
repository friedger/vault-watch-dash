import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { formatBtc, formatEur, formatStx } from "@/lib/utils";

interface PortfolioChartProps {
  sBtc: number;
  stx: number;
  bxlBTC: number;
  bxlSTX: number;
}

export const PortfolioChart = ({
  sBtc,
  stx,
  bxlBTC,
  bxlSTX,
}: PortfolioChartProps) => {
  const { data: prices } = useCryptoPrices();
  // Calculate EUR values
  const sBtcEur = sBtc * (prices?.btcEur ?? 0);
  const bxlBtcEur = bxlBTC * (prices?.btcEur ?? 0);
  const stxEur = stx * (prices?.stxEur ?? 0);
  const bxlStxEur = bxlSTX * (prices?.stxEur ?? 0);
  // Create chart data for pie chart
  const chartData = [
    {
      name: "sBTC",
      value: sBtcEur,
      fill: "hsl(var(--primary))",
    },
    {
      name: "bxlBTC",
      value: bxlBtcEur,
      fill: "hsl(var(--primary) / 0.7)",
    },
    {
      name: "STX",
      value: stxEur,
      fill: "hsl(var(--secondary))",
    },
    {
      name: "bxlSTX",
      value: bxlStxEur,
      fill: "hsl(var(--secondary) / 0.7)",
    },
  ].filter((item) => item.value > 0);

  const chartConfig = {
    value: {
      label: "Value (EUR)",
    },
  };

  return (
    <Card className="gradient-card border-primary/10">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">sBTC Balance</p>
                <div className="h-3 w-3 rounded-full bg-primary"></div>
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatBtc(sBtc)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatEur(sBtcEur)}
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">bxlBTC Balance</p>
                <div className="h-3 w-3 rounded-full bg-primary"></div>
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatBtc(bxlBTC)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatEur(bxlBtcEur)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">STX Balance</p>
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {formatStx(stx)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatEur(stxEur)}
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">bxlSTX Balance</p>
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
              </div>
              <p className="text-2xl font-bold text-secondary">
                {formatStx(bxlSTX)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatEur(bxlStxEur)}
              </p>
            </div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-semibold">{payload[0].name}</p>
                      <p className="text-sm text-primary">
                        {formatEur(Number(payload[0].value))}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
