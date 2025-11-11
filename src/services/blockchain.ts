import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  principalCV, 
  PostConditionMode
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const STACKS_API = 'https://api.mainnet.hiro.so';
const SBTC_CONTRACT = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';
const WRAPPED_BTC_CONTRACT = 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-wbtc';
const WRAPPED_STX_CONTRACT = 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK.token-wstx';

// Vault contract - replace with actual deployed vault contract
export const VAULT_ADDRESS = 'SP2XD7417HGPRTREMKF748VNEQPDRR0RMANB7X1NK';
export const VAULT_CONTRACT = 'bxl-vault';

const network = STACKS_MAINNET;

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

export async function fetchTokenTotalSupply(contractAddress: string, contractName: string): Promise<number> {
  try {
    const response = await fetch(
      `${STACKS_API}/v2/contracts/call-read/${contractAddress}/${contractName}/get-total-supply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: contractAddress,
          arguments: [],
        }),
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch total supply');
    const data = await response.json();
    
    // Parse the Clarity value response
    if (data.okay && data.result) {
      const hexValue = data.result.replace('0x', '');
      const supply = parseInt(hexValue, 16);
      
      // Determine decimals based on contract name
      const decimals = contractName.includes('wstx') ? 1000000 : 100000000;
      return supply / decimals;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching total supply:', error);
    return 0;
  }
}

// Admin contract calls

/**
 * Enroll the vault in dual stacking to generate BTC yield
 */
export async function enrollDualStacking() {
  return openContractCall({
    network,
    contractAddress: VAULT_ADDRESS,
    contractName: VAULT_CONTRACT,
    functionName: 'enroll',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Dual stacking enrollment transaction:', data.txId);
    },
  });
}

/**
 * Transfer sBTC yield to a recipient address
 * @param amount Amount in satoshis (1 BTC = 100000000 sats)
 * @param recipient Stacks address to receive the sBTC
 * @param memo Optional memo for the transfer
 */
export async function transferSbtcYield(amount: number, recipient: string, memo?: string) {
  const amountInSats = Math.floor(amount * 100000000);
  
  return openContractCall({
    network,
    contractAddress: VAULT_ADDRESS,
    contractName: VAULT_CONTRACT,
    functionName: 'admin-sbtc-transfer',
    functionArgs: [
      uintCV(amountInSats),
      principalCV(recipient),
    ],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('sBTC transfer transaction:', data.txId);
      if (memo) {
        console.log('Transfer memo:', memo);
      }
    },
  });
}

/**
 * Delegate vault's STX to stacking pool
 */
export async function delegateStx() {
  return openContractCall({
    network,
    contractAddress: VAULT_ADDRESS,
    contractName: VAULT_CONTRACT,
    functionName: 'delegate-stx',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('STX delegation transaction:', data.txId);
    },
  });
}

/**
 * Revoke STX delegation from stacking pool
 */
export async function revokeStacking() {
  return openContractCall({
    network,
    contractAddress: VAULT_ADDRESS,
    contractName: VAULT_CONTRACT,
    functionName: 'revoke-delegate-stx',
    functionArgs: [],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Revoke stacking transaction:', data.txId);
    },
  });
}
