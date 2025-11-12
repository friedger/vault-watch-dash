import {
  fetchUserTransactions,
  TransactionResult,
  transactionsLimit,
} from "@/services/blockchain";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useTransactions(address: string | undefined) {
  return useInfiniteQuery<TransactionResult>({
    queryKey: ["transactions", address],
    queryFn: ({ pageParam = 0 }) =>
      address
        ? fetchUserTransactions(address, pageParam as number)
        : Promise.resolve({ transactions: [], total: 0 }),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length * transactionsLimit >= lastPage.total) return undefined;
      return allPages.length * transactionsLimit;
    },
    enabled: !!address,
    refetchInterval: 30000,
    staleTime: 10000,
    initialPageParam: 0,
  });
}
