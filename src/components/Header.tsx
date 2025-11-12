import daoLogo from "@/assets/dao-logo.png";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { ArrowLeft, LayoutDashboard, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  userAddress: string | null;
  onAddressChange: (address: string | null) => void;
  sBtcBalance?: number;
  stxBalance?: number;
  bxlBTC?: number;
  bxlSTX?: number;
  pageTitle?: string;
  backLink?: string;
  showDashboardLink?: boolean;
  showAdminLink?: boolean;
  isAdmin?: boolean;
}

export const Header = ({
  userAddress,
  onAddressChange,
  sBtcBalance = 0,
  stxBalance = 0,
  bxlBTC = 0,
  bxlSTX = 0,
  pageTitle = "Vault Dashboard",
  backLink,
  showDashboardLink = false,
  showAdminLink = false,
  isAdmin = false,
}: HeaderProps) => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {backLink && (
              <Link to={backLink}>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <img
              src={daoLogo}
              alt="DAO Brussels"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BXL Vault
              </h1>
              <p className="text-sm text-muted-foreground">{pageTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userAddress && showDashboardLink && (
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2 h-[68px]">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            {userAddress && showAdminLink && isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="gap-2 h-[68px]">
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
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
