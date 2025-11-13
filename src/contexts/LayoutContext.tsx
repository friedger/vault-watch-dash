import { createContext, useContext } from 'react';
import type { Balance } from '@/services/blockchain';

interface LayoutContextValue {
  userAddress: string | null;
  userBalances: Balance | undefined;
  vaultBalances: Balance | undefined;
  totalBxlBTC: number | undefined;
  isAdmin: boolean;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export const LayoutProvider = LayoutContext.Provider;

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within Layout component');
  }
  return context;
};
