import * as rifRollup from "@rsksmart/rif-rollup-js-sdk";
import { ethers } from "ethers";
import { deposit } from "../utils.js";

const NETWORK = "testnet";
const RSK_TESTNET_NODE_URL = "https://public-node.testnet.rsk.co";

export async function depositingToMyself() {
  const syncProvider = await rifRollup.getDefaultProvider(NETWORK);
  const rskProvider = new ethers.providers.JsonRpcProvider(RSK_TESTNET_NODE_URL);

  // Mnemonic from a previously set wallet (metamask) with funds
  const MNEMONIC =
    {phrase: "visual believe shift seek chest flip mystery puppy chief squirrel split check"};

  console.log("ln15 MNEMONIC: ", MNEMONIC.phrase);

  const rskFundedWallet = ethers.Wallet.fromMnemonic(MNEMONIC.phrase).connect(
    rskProvider
  );

  console.log("ln22 rskFundedWallet: ", rskFundedWallet.address);

  const rollupWallet = await rifRollup.Wallet.fromEthSigner(
    rskFundedWallet,
    syncProvider
  );

  await deposit(rollupWallet, rollupWallet.address());
}
