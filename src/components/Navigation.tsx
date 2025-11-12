import { Home, LayoutDashboard, Vault, Upload, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { MobileNavigation } from "@/components/MobileNavigation";

interface NavigationProps {
  userAddress: string | null;
  isAdmin?: boolean;
}

export const Navigation = ({ userAddress, isAdmin }: NavigationProps) => {
  const navItems = [
    { to: "/", label: "Home", icon: Home, show: true },
    { to: "/deposit", label: "Deposit", icon: Upload, show: !!userAddress },
    { to: "/vault", label: "Vault", icon: Vault, show: true },
    { to: "/admin", label: "Admin", icon: Shield, show: !!userAddress && isAdmin },
  ].filter((item) => item.show);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-[88px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors rounded-t-md"
                activeClassName="text-primary bg-primary/10 border-b-2 border-primary"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation navItems={navItems} />
    </>
  );
};
