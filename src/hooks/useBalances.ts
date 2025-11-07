import { useQuery } from '@tanstack/react-query';
import { fetchAllBalances, type Balance } from '@/services/blockchain';

export function useBalances(address: string | null) {
  return useQuery<Balance>({
    queryKey: ['balances', address],
    queryFn: () => {
      if (!address) throw new Error('No address provided');
      return fetchAllBalances(address);
    },
    enabled: !!address,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
