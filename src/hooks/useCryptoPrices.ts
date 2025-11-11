import { useQuery } from '@tanstack/react-query';

interface CryptoPrices {
  btcEur: number;
  stxEur: number;
}

export function useCryptoPrices() {
  return useQuery<CryptoPrices>({
    queryKey: ['cryptoPrices'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,blockstack&vs_currencies=eur'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }
      
      const data = await response.json();
      
      return {
        btcEur: data.bitcoin?.eur ?? 0,
        stxEur: data.blockstack?.eur ?? 0,
      };
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
