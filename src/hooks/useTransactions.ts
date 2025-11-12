import { useQuery } from '@tanstack/react-query';
import { fetchUserTransactions, type Transaction } from '@/services/blockchain';

export function useTransactions(address: string | undefined) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', address],
    queryFn: () => address ? fetchUserTransactions(address) : Promise.resolve([]),
    enabled: !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  });
}
