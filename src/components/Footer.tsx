import { GitBranch } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-12 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © 2025{" "}
            <a
              href="https://dao.brussels"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              DAO Brussels
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/friedger/vault-watch-dash"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
            <a
              href="https://github.com/friedger/dao-brussels-vault/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span>Smart Contracts</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
