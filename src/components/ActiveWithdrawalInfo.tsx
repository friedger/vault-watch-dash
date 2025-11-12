import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { formatBtc } from "@/lib/utils";

interface ActiveWithdrawalInfoProps {
  amount: number;
}

export const ActiveWithdrawalInfo = ({ amount }: ActiveWithdrawalInfoProps) => {
  if (amount === 0) return null;

  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Active Withdrawal Request</AlertTitle>
      <AlertDescription>
        You have {formatBtc(amount)} bxlBTC in transit. Use the form above to update, cancel, or finalize your withdrawal request.
      </AlertDescription>
    </Alert>
  );
};
