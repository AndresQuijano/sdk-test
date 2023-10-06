import * as rifRollup from "@rsksmart/rif-rollup-js-sdk";
import { ethers } from "ethers";

const NETWORK = "testnet";
const RSK_TESTNET_NODE_URL = "https://public-node.testnet.rsk.co";

export async function checkInformation() {
  const syncProvider = await rifRollup.getDefaultProvider(NETWORK);
  const rskProvider = new ethers.providers.JsonRpcProvider(
    RSK_TESTNET_NODE_URL
  );

  const MNEMONIC = {
    phrase:
      "visual believe shift seek chest flip mystery puppy chief squirrel split check",
  };

  console.log("ln15 MNEMONIC: ", MNEMONIC.phrase);
  const rskWallet = ethers.Wallet.fromMnemonic(MNEMONIC.phrase).connect(
    rskProvider
  );

  console.log("ln19 rbtcWallet: ", rskWallet.address);

  const rollupWallet = await rifRollup.Wallet.fromEthSigner(
    rskWallet,
    syncProvider
  );

  await checkBalance(rollupWallet);
  await checkBalances(rollupWallet);
}

async function checkBalance(rollupWallet) {
  // Committed state is not final yet
  const committedRBTCBalance = await rollupWallet.getBalance("RBTC");
  console.log(
    "checkBalance() committedRBTCBalance: ",
    committedRBTCBalance
  );

  // Verified state is final
  const verifiedRBTCBalance = await rollupWallet.getBalance("RBTC", "verified");
  console.log("checkBalance() verifiedRBTCBalance: ", verifiedRBTCBalance);
}

async function checkBalances(rollupWallet) {
  const state = await rollupWallet.getAccountState();
  console.log("checkBalances() state: ", state);

  const committedBalances = state.committed.balances;
  console.log("checkBalances() committedBalances: ", committedBalances); 

  const verifiedBalances = state.verified.balances;
  console.log("checkBalances() verifiedBalances: ", verifiedBalances);
}
