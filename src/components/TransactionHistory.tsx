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
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  asset: "sBTC" | "STX";
  amount: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    asset: "sBTC",
    amount: 0.5,
    timestamp: new Date(Date.now() - 3600000),
    status: "completed",
  },
  {
    id: "2",
    type: "deposit",
    asset: "STX",
    amount: 1000,
    timestamp: new Date(Date.now() - 7200000),
    status: "completed",
  },
  {
    id: "3",
    type: "withdraw",
    asset: "sBTC",
    amount: 0.2,
    timestamp: new Date(Date.now() - 86400000),
    status: "completed",
  },
  {
    id: "4",
    type: "deposit",
    asset: "STX",
    amount: 500,
    timestamp: new Date(Date.now() - 172800000),
    status: "completed",
  },
];

export const TransactionHistory = () => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
    }
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
            {mockTransactions.length > 0 ? (
              mockTransactions.map((tx) => (
                <TableRow key={tx.id}>
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
                      variant={tx.asset === "sBTC" ? "default" : "secondary"}
                      className="font-mono"
                    >
                      {tx.asset}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {tx.asset === "sBTC" 
                      ? tx.amount.toFixed(8) 
                      : tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(tx.timestamp)}
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
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No transactions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
