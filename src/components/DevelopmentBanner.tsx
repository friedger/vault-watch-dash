import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const DevelopmentBanner = () => {
  return (
    <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Development Notice</AlertTitle>
      <AlertDescription>
        This project is under active development. The vault is currently managed by a single address, not a multi-signature wallet. Please exercise caution and only deposit amounts you're comfortable with.
      </AlertDescription>
    </Alert>
  );
};
