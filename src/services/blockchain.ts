const STACKS_API = 'https://api.mainnet.hiro.so';
const SBTC_CONTRACT = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';

export interface Balance {
  stx: number;
  sBtc: number;
  lockedStx: number;
}

export async function fetchStxBalance(address: string): Promise<number> {
  try {
    const response = await fetch(`${STACKS_API}/extended/v1/address/${address}/balances`);
    if (!response.ok) throw new Error('Failed to fetch STX balance');
    const data = await response.json();
    return parseInt(data.stx.balance) / 1000000; // Convert from micro-STX
  } catch (error) {
    console.error('Error fetching STX balance:', error);
    return 0;
  }
}

export async function fetchLockedStx(address: string): Promise<number> {
  try {
    const response = await fetch(`${STACKS_API}/extended/v1/address/${address}/balances`);
    if (!response.ok) throw new Error('Failed to fetch locked STX');
    const data = await response.json();
    return parseInt(data.stx.locked) / 1000000; // Convert from micro-STX
  } catch (error) {
    console.error('Error fetching locked STX:', error);
    return 0;
  }
}

export async function fetchSbtcBalance(address: string): Promise<number> {
  try {
    const [contractAddress, contractName] = SBTC_CONTRACT.split('.');
    const response = await fetch(
      `${STACKS_API}/extended/v1/address/${address}/balances`
    );
    if (!response.ok) throw new Error('Failed to fetch sBTC balance');
    const data = await response.json();
    
    // Look for sBTC in fungible tokens
    const sbtcToken = data.fungible_tokens?.[`${contractAddress}.${contractName}::sbtc`];
    if (sbtcToken) {
      return parseInt(sbtcToken.balance) / 100000000; // sBTC has 8 decimals
    }
    return 0;
  } catch (error) {
    console.error('Error fetching sBTC balance:', error);
    return 0;
  }
}

export async function fetchAllBalances(address: string): Promise<Balance> {
  const [stx, sBtc, lockedStx] = await Promise.all([
    fetchStxBalance(address),
    fetchSbtcBalance(address),
    fetchLockedStx(address),
  ]);

  return { stx, sBtc, lockedStx };
}
