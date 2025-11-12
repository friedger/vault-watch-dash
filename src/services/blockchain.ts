import { request } from "@stacks/connect";
import {
  Cl,
  hexToCV,
  Pc,
  ResponseErrorCV,
  ResponseOkCV,
  UIntCV,
} from "@stacks/transactions";

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
const SBTC_ASSET = "sbtc-token";
export const BXL_BTC_CONTRACT =
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-btc";
const BXL_BTC_ASSET = "bxl-btc";
const BXL_BTC_TRANSIT_ASSET = "bxl-btc-transit";

export const BXL_STX_CONTRACT =
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-stx";
const BXL_STX_ASSET = "bxl-stx";
const network = "mainnet";

// Vault contract - replace with actual deployed vault contract
export const VAULT_CONTRACT =
  "SPBX1F9B4G87C3R6H4N82RRHBS2Q5523QMDV38QF.bxl-vault";

export interface Balance {
  stx: number;
  sBtc: number;
  lockedStx: number;
  bxlBTC: number;
  bxlBTCTransit: number;
  bxlSTX: number;
}

export async function fetchAllBalances(address: string): Promise<Balance> {
  try {
    // Make a single API call to get all balances
    const response = await fetch(
      `${STACKS_API}/extended/v1/address/${address}/balances`
    );
    if (!response.ok) throw new Error("Failed to fetch balances");
    const data = await response.json();

    console.log("Balance data:", data);
    // Parse STX balance
    const stx = parseInt(data.stx.balance) / 1e6; // Convert from micro-STX
    const lockedStx = parseInt(data.stx.locked) / 1e6; // Convert from micro-STX

    // Parse sBTC balance
    const sbtcToken = data.fungible_tokens?.[`${SBTC_CONTRACT}::${SBTC_ASSET}`];
    const sBtc = sbtcToken ? parseInt(sbtcToken.balance) / 1e8 : 0; // sBTC has 8 decimals
    // Parse wrapped BTC balance (bxlBTC)
    const bxlBtcToken =
      data.fungible_tokens?.[`${BXL_BTC_CONTRACT}::${BXL_BTC_ASSET}`];
    const bxlBTC = bxlBtcToken ? parseInt(bxlBtcToken.balance) / 1e8 : 0; // 8 decimals

    const bxlBtcTransitToken =
      data.fungible_tokens?.[`${BXL_BTC_CONTRACT}::${BXL_BTC_TRANSIT_ASSET}`];
    const bxlBTCTransit = bxlBtcTransitToken ? parseInt(bxlBtcTransitToken.balance) / 1e8 : 0; // 8 decimals

    // Parse wrapped STX balance (bxlSTX)
    const bxlStxToken =
      data.fungible_tokens?.[`${BXL_STX_CONTRACT}::${BXL_STX_ASSET}`];
    const bxlSTX = bxlStxToken ? parseInt(bxlStxToken.balance) / 1e6 : 0; // 6 decimals

    return { stx, sBtc, lockedStx, bxlBTC, bxlBTCTransit, bxlSTX };
  } catch (error) {
    console.error("Error fetching balances:", error);
    return { stx: 0, sBtc: 0, lockedStx: 0, bxlBTC: 0, bxlBTCTransit: 0, bxlSTX: 0 };
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
      const supplyCV = hexToCV(data.result) as
        | ResponseOkCV<UIntCV>
        | ResponseErrorCV<UIntCV>;
      const supply = supplyCV.value.value;
      const factor =
        contractName === "bxl-btc" ? 1e8 : contractName === "bxl-stx" ? 1e6 : 0;
      return Number(supply) / factor;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    return 0;
  }
}

// User contract calls

// Deposit sBTC into the vault
export async function depositSBtc(amount: number, user: string) {
  const amountInSats = Math.floor(amount * 1e8); // Convert to satoshis

  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "deposit",
    functionArgs: [Cl.uint(amountInSats)],
    network,
    postConditionMode: "deny",
    postConditions: [
      Pc.principal(user).willSendEq(amountInSats).ft(SBTC_CONTRACT, SBTC_ASSET),
    ],
  });

  return result;
}

// Deposit STX into the vault
export async function depositStx(amount: number, user: string) {
  const amountInMicroStx = Math.floor(amount * 1e6); // Convert to micro-STX

  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "deposit-stx",
    functionArgs: [Cl.uint(amountInMicroStx)],
    network,
    postConditionMode: "deny",
    postConditions: [Pc.principal(user).willSendEq(amountInMicroStx).ustx()],
  });

  return result;
}

// user requests to withdraw sBTC from the vault
export async function withdrawSBtc(amount: number, user:string) {
  const amountInSats = Math.floor(amount * 1e8); // Convert to satoshis

  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "withdraw-request",
    functionArgs: [Cl.uint(amountInSats), Cl.uint(1000)],
    network,
    postConditionMode: "deny",
    postConditions: [
      Pc.principal(user).willSendEq(amountInSats).ft(BXL_BTC_CONTRACT, BXL_BTC_ASSET),
      Pc.principal(BXL_BTC_CONTRACT).willSendEq(amountInSats).ft(BXL_BTC_CONTRACT, BXL_BTC_TRANSIT_ASSET),
    ],
  });

  return result;
}

// user updates Sbtc withdrawal request
export async function withdrawSBtcUpdate(requestId: number, amount: number, user:string) {
  const amountInSats = Math.floor(amount * 1e8); // Convert to satoshis

  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "withdraw-update",
    functionArgs: [Cl.uint(requestId), Cl.uint(amountInSats), Cl.uint(1000)],
    network,
    postConditionMode: "deny",
    postConditions: [
      Pc.principal(user).willSendEq(amountInSats).ft(BXL_BTC_CONTRACT, BXL_BTC_ASSET),
      Pc.principal(VAULT_CONTRACT).willSendEq(amountInSats).ft(BXL_BTC_CONTRACT, BXL_BTC_TRANSIT_ASSET),
    ],
  });

  return result;
}

// finalize sBTC withdrawal after waiting period
export async function finalizeSbtcWithdraw(requestId: number, user:string) {
  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "withdraw-finalize",
    functionArgs: [Cl.uint(requestId)],
    network,
    postConditionMode: "deny",
    postConditions: [],
  });

  return result;
}

export async function withdrawStx(amount: number, user:string) {
  const amountInMicroStx = Math.floor(amount * 1e6); // Convert to micro-STX

  const result = await request("stx_callContract", {
    contract: VAULT_CONTRACT,
    functionName: "withdraw-stx",
    functionArgs: [Cl.uint(amountInMicroStx)],
    network,
    postConditionMode: "deny",
    postConditions: [
      Pc.principal(user).willSendEq(amountInMicroStx).ft(BXL_STX_CONTRACT, BXL_STX_ASSET),
      Pc.principal(VAULT_CONTRACT).willSendEq(amountInMicroStx).ustx(),
    ],
  });

  return result;
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

export interface Transaction {
  txId: string;
  type: "deposit" | "withdraw" | "transfer";
  asset: "sBTC" | "STX" | "bxlBTC" | "bxlSTX";
  amount: number;
  timestamp: Date;
  status: "success" | "pending" | "failed";
  functionName: string;
}

export async function fetchUserTransactions(address: string, offset: number = 0): Promise<Transaction[]> {
  try {
    const response = await fetch(
      `${STACKS_API}/extended/v1/address/${address}/transactions?limit=20&offset=${offset}`
    );
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const data = await response.json();

    const transactions: Transaction[] = [];

    for (const tx of data.results) {
      // Only process contract calls that are relevant to our vault
      if (tx.tx_type !== "contract_call") continue;
      if (tx.tx_status !== "success" && tx.tx_status !== "pending") continue;

      const contractId = `${tx.contract_call.contract_id}`;
      const functionName = tx.contract_call.function_name;

      // Filter for vault-related transactions
      if (!contractId.includes("bxl-vault") && !contractId.includes("sbtc-token")) continue;

      let type: Transaction["type"] = "transfer";
      let asset: Transaction["asset"] = "sBTC";
      let amount = 0;

      // Parse based on function name
      if (functionName === "deposit") {
        type = "deposit";
        asset = "sBTC";
        // Parse amount from function args
        const amountArg = tx.contract_call.function_args?.[0];
        if (amountArg?.repr) {
          amount = parseInt(amountArg.repr.replace("u", "")) / 1e8;
        }
      } else if (functionName === "deposit-stx") {
        type = "deposit";
        asset = "STX";
        const amountArg = tx.contract_call.function_args?.[0];
        if (amountArg?.repr) {
          amount = parseInt(amountArg.repr.replace("u", "")) / 1e6;
        }
      } else if (functionName === "withdraw-request") {
        type = "withdraw";
        asset = "sBTC";
        const amountArg = tx.contract_call.function_args?.[0];
        if (amountArg?.repr) {
          amount = parseInt(amountArg.repr.replace("u", "")) / 1e8;
        }
      } else if (functionName === "withdraw-stx") {
        type = "withdraw";
        asset = "STX";
        const amountArg = tx.contract_call.function_args?.[0];
        if (amountArg?.repr) {
          amount = parseInt(amountArg.repr.replace("u", "")) / 1e6;
        }
      } else {
        // Skip other function calls
        continue;
      }

      transactions.push({
        txId: tx.tx_id,
        type,
        asset,
        amount,
        timestamp: new Date(tx.burn_block_time * 1000),
        status: tx.tx_status === "success" ? "success" : "pending",
        functionName,
      });
    }

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}
