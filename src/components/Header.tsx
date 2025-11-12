import daoLogo from "@/assets/dao-logo.png";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { HelpCircle } from "lucide-react";
import { useTutorial } from "@/components/tutorial/TutorialContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  userAddress: string | null;
  onAddressChange: (address: string | null) => void;
  sBtcBalance?: number;
  stxBalance?: number;
  bxlBTC?: number;
  bxlSTX?: number;
}

export const Header = ({
  userAddress,
  onAddressChange,
  sBtcBalance = 0,
  stxBalance = 0,
  bxlBTC = 0,
  bxlSTX = 0,
}: HeaderProps) => {
  const { startTutorial } = useTutorial();

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={daoLogo}
              alt="DAO Brussels"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BXL Vault
              </h1>
              <p className="text-sm text-muted-foreground">Bitcoin Yield for Brussels</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startTutorial}
                  className="h-10 w-10"
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Tutorial</p>
              </TooltipContent>
            </Tooltip>
            <WalletConnect
              onAddressChange={onAddressChange}
              sBtcBalance={sBtcBalance}
              stxBalance={stxBalance}
              bxlBTC={bxlBTC}
              bxlSTX={bxlSTX}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
