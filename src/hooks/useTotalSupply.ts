import { fetchTokenTotalSupply } from '@/services/blockchain';
import { useQuery } from '@tanstack/react-query';

export function useTotalSupply(contractId:`${string}.${string}`) {
  const [contractAddress, contractName] = contractId.split('.');
  return useQuery<number>({
    queryKey: ['totalSupply', contractAddress, contractName],
    queryFn: () => fetchTokenTotalSupply(contractAddress, contractName),
    staleTime: 60000, // Consider data fresh for 1 minute
    refetchInterval: 120000, // Refetch every 2 minutes
  });
}
