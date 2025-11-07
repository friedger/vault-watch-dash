import { useQuery } from '@tanstack/react-query';
import { fetchTokenTotalSupply } from '@/services/blockchain';

export function useTotalSupply(contractAddress: string, contractName: string) {
  return useQuery<number>({
    queryKey: ['totalSupply', contractAddress, contractName],
    queryFn: () => fetchTokenTotalSupply(contractAddress, contractName),
    staleTime: 60000, // Consider data fresh for 1 minute
    refetchInterval: 120000, // Refetch every 2 minutes
  });
}
