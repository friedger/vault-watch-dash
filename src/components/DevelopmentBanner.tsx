import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const DevelopmentBanner = () => {
  return (
    <div className="container p-1">
      <Alert
        variant="destructive"
        className="border-orange-500/50 bg-orange-500/10"
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Beta Phase - First Reward Cycle</AlertTitle>
        <AlertDescription>
          The vault's yield is currently managed by a single-signature wallet, not a
          multi-signature wallet. This website is still under development.
        </AlertDescription>
      </Alert>
    </div>
  );
};
