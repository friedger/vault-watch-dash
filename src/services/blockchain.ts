const STACKS_API = 'https://api.mainnet.hiro.so';
const SBTC_CONTRACT = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';
const WRAPPED_BTC_CONTRACT = 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-wbtc';
const WRAPPED_STX_CONTRACT = 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-wstx';

export interface Balance {
  stx: number;
  sBtc: number;
  lockedStx: number;
  bxlBTC: number;
  blxSTX: number;
}

export async function fetchAllBalances(address: string): Promise<Balance> {
  try {
    // Make a single API call to get all balances
    const response = await fetch(`${STACKS_API}/extended/v1/address/${address}/balances`);
    if (!response.ok) throw new Error('Failed to fetch balances');
    const data = await response.json();
    
    // Parse STX balance
    const stx = parseInt(data.stx.balance) / 1000000; // Convert from micro-STX
    const lockedStx = parseInt(data.stx.locked) / 1000000; // Convert from micro-STX
    
    // Parse sBTC balance
    const [sbtcContractAddress, sbtcContractName] = SBTC_CONTRACT.split('.');
    const sbtcToken = data.fungible_tokens?.[`${sbtcContractAddress}.${sbtcContractName}::sbtc`];
    const sBtc = sbtcToken ? parseInt(sbtcToken.balance) / 100000000 : 0; // sBTC has 8 decimals
    
    // Parse wrapped BTC balance (bxlBTC)
    const [wbtcContractAddress, wbtcContractName] = WRAPPED_BTC_CONTRACT.split('.');
    const wbtcToken = data.fungible_tokens?.[`${wbtcContractAddress}.${wbtcContractName}::wbtc`];
    const bxlBTC = wbtcToken ? parseInt(wbtcToken.balance) / 100000000 : 0; // 8 decimals
    
    // Parse wrapped STX balance (blxSTX)
    const [wstxContractAddress, wstxContractName] = WRAPPED_STX_CONTRACT.split('.');
    const wstxToken = data.fungible_tokens?.[`${wstxContractAddress}.${wstxContractName}::wstx`];
    const blxSTX = wstxToken ? parseInt(wstxToken.balance) / 1000000 : 0; // 6 decimals

    return { stx, sBtc, lockedStx, bxlBTC, blxSTX };
  } catch (error) {
    console.error('Error fetching balances:', error);
    return { stx: 0, sBtc: 0, lockedStx: 0, bxlBTC: 0, blxSTX: 0 };
  }
}
