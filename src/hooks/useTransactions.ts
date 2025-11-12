import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserTransactions, type Transaction } from '@/services/blockchain';

export function useTransactions(address: string | undefined) {
  return useInfiniteQuery<Transaction[]>({
    queryKey: ['transactions', address],
    queryFn: ({ pageParam = 0 }) => 
      address ? fetchUserTransactions(address, pageParam as number) : Promise.resolve([]),
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than 20 transactions, we've reached the end
      if (lastPage.length < 20) return undefined;
      return allPages.length * 20;
    },
    enabled: !!address,
    refetchInterval: 30000,
    staleTime: 10000,
    initialPageParam: 0,
  });
}
