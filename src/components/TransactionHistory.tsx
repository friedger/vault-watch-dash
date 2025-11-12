import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, ExternalLink } from "lucide-react";
import { formatBtc, formatStx } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";

interface TransactionHistoryProps {
  userAddress: string | null;
}

export const TransactionHistory = ({
  userAddress,
}: TransactionHistoryProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransactions(userAddress ?? undefined);

  // Flatten all pages into a single array
  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  const getAssetBadgeVariant = (asset: string) => {
    return asset === "sBTC" || asset === "bxlBTC" ? "default" : "secondary";
  };

  return (
    <Card className="gradient-card border-primary/10">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <TableRow key={tx.txId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === "deposit" ? (
                        <ArrowDownToLine className="w-4 h-4 text-primary" />
                      ) : (
                        <ArrowUpFromLine className="w-4 h-4 text-secondary" />
                      )}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getAssetBadgeVariant(tx.asset)}
                      className="font-mono"
                    >
                      {tx.asset}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {tx.asset === "sBTC" || tx.asset === "bxlBTC"
                      ? formatBtc(tx.amount)
                      : formatStx(tx.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {formatDate(tx.timestamp)}
                      <a
                        href={`https://explorer.hiro.so/txid/${tx.txId}?chain=mainnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No transactions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
