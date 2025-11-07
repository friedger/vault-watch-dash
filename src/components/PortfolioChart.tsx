import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface PortfolioChartProps {
  sBtc: number;
  stx: number;
  bxlBTC: number;
  blxSTX: number;
}

export const PortfolioChart = ({ sBtc, stx, bxlBTC, blxSTX }: PortfolioChartProps) => {
  // Create chart data
  const chartData = [
    {
      name: "sBTC",
      value: sBtc,
      wrapped: bxlBTC,
    },
    {
      name: "STX",
      value: stx / 1000, // Scale down for better visualization
      wrapped: blxSTX / 1000,
    },
  ];

  const chartConfig = {
    value: {
      label: "Balance",
      color: "hsl(var(--primary))",
    },
    wrapped: {
      label: "Wrapped",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <Card className="gradient-card border-primary/10">
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">sBTC Balance</p>
                <div className="h-3 w-3 rounded-full bg-primary"></div>
              </div>
              <p className="text-2xl font-bold text-primary">{sBtc.toFixed(8)}</p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">bxlBTC Wrapped</p>
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
              </div>
              <p className="text-2xl font-bold text-secondary">{bxlBTC.toFixed(8)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">STX Balance</p>
                <div className="h-3 w-3 rounded-full bg-primary"></div>
              </div>
              <p className="text-2xl font-bold text-primary">{stx.toLocaleString()}</p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">blxSTX Wrapped</p>
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
              </div>
              <p className="text-2xl font-bold text-secondary">{blxSTX.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stackId="1"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.3)"
            />
            <Area
              type="monotone"
              dataKey="wrapped"
              stackId="1"
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary) / 0.3)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
