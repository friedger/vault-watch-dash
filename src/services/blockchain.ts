import { request } from "@stacks/connect";
import { Cl } from "@stacks/transactions";

// SIP-30 compliant wallet provider interface
interface WalletProvider {
  request(params: { method: string; params?: any }): Promise<any>;
}

declare global {
  interface Window {
    StacksProvider?: WalletProvider;
  }
}

const STACKS_API = "https://api.mainnet.hiro.so";
const SBTC_CONTRACT = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token";
export const WRAPPED_BTC_CONTRACT =
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-btc";
export const WRAPPED_STX_CONTRACT =
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-stx";
const network = "mainnet";

// Vault contract - replace with actual deployed vault contract
export const VAULT_CONTRACT =
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-vault";

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
    const response = await fetch(
      `${STACKS_API}/extended/v1/address/${address}/balances`
    );
    if (!response.ok) throw new Error("Failed to fetch balances");
    const data = await response.json();

    // Parse STX balance
    const stx = parseInt(data.stx.balance) / 1000000; // Convert from micro-STX
    const lockedStx = parseInt(data.stx.locked) / 1000000; // Convert from micro-STX

    // Parse sBTC balance
    const [sbtcContractAddress, sbtcContractName] = SBTC_CONTRACT.split(".");
    const sbtcToken =
      data.fungible_tokens?.[
        `${sbtcContractAddress}.${sbtcContractName}::sbtc`
      ];
    const sBtc = sbtcToken ? parseInt(sbtcToken.balance) / 100000000 : 0; // sBTC has 8 decimals

    // Parse wrapped BTC balance (bxlBTC)
    const [wbtcContractAddress, wbtcContractName] =
      WRAPPED_BTC_CONTRACT.split(".");
    const wbtcToken =
      data.fungible_tokens?.[
        `${wbtcContractAddress}.${wbtcContractName}::wbtc`
      ];
    const bxlBTC = wbtcToken ? parseInt(wbtcToken.balance) / 100000000 : 0; // 8 decimals

    // Parse wrapped STX balance (blxSTX)
    const [wstxContractAddress, wstxContractName] =
      WRAPPED_STX_CONTRACT.split(".");
    const wstxToken =
      data.fungible_tokens?.[
        `${wstxContractAddress}.${wstxContractName}::wstx`
      ];
    const blxSTX = wstxToken ? parseInt(wstxToken.balance) / 1000000 : 0; // 6 decimals

    return { stx, sBtc, lockedStx, bxlBTC, blxSTX };
  } catch (error) {
    console.error("Error fetching balances:", error);
    return { stx: 0, sBtc: 0, lockedStx: 0, bxlBTC: 0, blxSTX: 0 };
  }
}

export async function fetchTokenTotalSupply(
  contractAddress: string,
  contractName: string
): Promise<number> {
  try {
    const response = await fetch(
      `${STACKS_API}/v2/contracts/call-read/${contractAddress}/${contractName}/get-total-supply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: contractAddress,
          arguments: [],
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch total supply");
    const data = await response.json();

    // Parse the Clarity value response
    if (data.okay && data.result) {
      const hexValue = data.result.replace("0x", "");
      const supply = parseInt(hexValue, 16);

      // Determine decimals based on contract name
      const decimals = contractName.includes("wstx") ? 1000000 : 100000000;
      return supply / decimals;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    return 0;
  }
}

// Admin contract calls

/**
 * Enroll the vault in dual stacking to generate BTC yield
 */
export async function enrollDualStacking() {
  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "enroll",
    functionArgs: [],
    network,
  });

  return result;
}

/**
 * Transfer sBTC yield to a recipient address
 * @param amount Amount in BTC (will be converted to satoshis)
 * @param recipient Stacks address to receive the sBTC
 */
export async function transferSbtcYield(amount: number, recipient: string) {
  const amountInSats = Math.floor(amount * 1e8);

  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "admin-sbtc-transfer",
    functionArgs: [Cl.uint(amountInSats), Cl.principal(recipient)],
    network,
  });
  return result;
}

/**
 * Delegate vault's STX to stacking pool
 */
export async function delegateStx() {
  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,

    functionName: "delegate-stx",
    functionArgs: [],
    network: "mainnet",
  });
  return result;
}

/**
 * Revoke STX delegation from stacking pool
 */
export async function revokeStacking() {
  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "revoke-delegate-stx",
    functionArgs: [],
    network,
  });
  return result;
}
