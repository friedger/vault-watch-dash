import { fetchYieldTransactions, YieldData } from "@/services/blockchain";
import { useQuery } from "@tanstack/react-query";

export function useYieldData() {
  return useQuery<YieldData[]>({
    queryKey: ["yieldData"],
    queryFn: fetchYieldTransactions,
    staleTime: 60000,
    refetchInterval: 60000,
  });
}
