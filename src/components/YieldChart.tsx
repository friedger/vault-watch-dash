import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

interface YieldChartProps {
  currentYield: number;
}

export const YieldChart = ({ currentYield }: YieldChartProps) => {
  // Generate historical data for the last 12 months
  // In a real implementation, this would come from an API
  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    const protocolStartMonth = new Date(2024, 10); // November 2024 (month 10)
    
    // Calculate how many months since protocol start
    const monthsSinceStart = Math.min(
      12,
      (now.getFullYear() - protocolStartMonth.getFullYear()) * 12 +
        (now.getMonth() - protocolStartMonth.getMonth()) + 1
    );
    
    for (let i = monthsSinceStart - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      // Simulate growing yield over time
      // Most recent month uses actual current yield
      const yieldValue = i === 0 
        ? currentYield 
        : currentYield * (1 - (i * 0.15)); // Earlier months had less yield
      
      data.push({
        month: `${monthName} ${year}`,
        yield: Math.max(0, yieldValue),
      });
    }
    
    return data;
  };

  const data = generateHistoricalData();
  const totalYield = data.reduce((sum, item) => sum + item.yield, 0);
  const averageYield = data.length > 0 ? totalYield / data.length : 0;

  return (
    <Card className="gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Monthly Yield Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${value.toFixed(4)}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-primary/20 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.month}</p>
                          <p className="text-sm text-primary">
                            Yield: {Number(payload[0].value).toFixed(8)} sBTC
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
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Month</p>
              <p className="text-2xl font-bold text-primary">
                {currentYield.toFixed(8)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">sBTC earned</p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Yield</p>
              <p className="text-2xl font-bold text-primary">
                {totalYield.toFixed(8)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">All-time sBTC earned</p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Monthly</p>
              <p className="text-2xl font-bold text-primary">
                {averageYield.toFixed(8)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">sBTC per month</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
