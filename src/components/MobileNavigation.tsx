import { Menu, LucideIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavigationProps {
  navItems: NavItem[];
}

export const MobileNavigation = ({ navItems }: MobileNavigationProps) => {
  return (
    <div className="md:hidden sticky top-[88px] z-40 border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Menu className="w-4 h-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors rounded-md"
                  activeClassName="text-primary bg-primary/10 font-semibold"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
