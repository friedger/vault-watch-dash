import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BXL_BTC_CONTRACT,
    BXL_STX_CONTRACT,
    VAULT_CONTRACT,
} from "@/services/blockchain";
import { ExternalLink, FileText } from "lucide-react";

const VaultHowItWorksCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          How the Vault Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Key Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">1:1 Backed Tokens:</strong>{" "}
                Your deposits are represented by bxlBTC tokens, fully backed by
                sBTC in the vault
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">
                  Wrench Attack Protection:
                </strong>{" "}
                Withdrawals require a time delay (minimum 1 week) or admin
                approval, protecting against forced transfers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Community Yield:</strong>{" "}
                All yield generated through Dual Stacking goes directly to the
                Brussels Crypto community to fund their initiatives
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">
                  Non-Taxable Structure:
                </strong>{" "}
                By directing yield to the community instead of individual users,
                the vault simplifies tax implications
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Smart Contracts</h3>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-foreground">Main Vault:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {VAULT_CONTRACT}{" "}
                <a
                  href={`https://explorer.hiro.so/txid/${VAULT_CONTRACT}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </code>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-foreground">Tokens:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {BXL_BTC_CONTRACT}{" "}
                <a
                  href={`https://explorer.hiro.so/txid/${BXL_BTC_CONTRACT}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
                <br />
                {BXL_STX_CONTRACT}{" "}
                <a
                  href={`https://explorer.hiro.so/txid/${BXL_STX_CONTRACT}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </code>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Dual Stacking</h3>
          <p className="text-muted-foreground">
            The vault participates in Dual Stacking, a mechanism on the Stacks
            blockchain that allows sBTC to generate yield while maintaining its
            1:1 Bitcoin backing. STX deposits enhance this yield through PoX
            stacking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaultHowItWorksCard;
