import { AccumulatedYieldChart } from "@/components/AccumulatedYieldChart";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_START = new Date("2025-12-02").getTime();
const DEFAULT_END = Date.now();

const AccumulatedYieldContent = () => {
  const navigate = useNavigate();
  const [startDate] = useState(DEFAULT_START);
  const [endDate] = useState(DEFAULT_END);

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/vault")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Accumulated Yield</h1>
            <p className="text-muted-foreground text-lg">
              Track yield accumulation and community payouts over time
            </p>
          </div>
        </div>

        <AccumulatedYieldChart startDate={startDate} endDate={endDate} />
      </div>
    </main>
  );
};

const AccumulatedYield = () => (
  <Layout>
    <AccumulatedYieldContent />
  </Layout>
);

export default AccumulatedYield;
