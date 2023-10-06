import * as rifRollup from "@rsksmart/rif-rollup-js-sdk";
import { ethers } from "ethers";
import { deposit } from "../utils.js";

const NETWORK = "testnet";
const RSK_TESTNET_NODE_URL = "https://public-node.testnet.rsk.co";

export async function unlockRifRollupAccount() {
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
  
    // UNLOCKING ROLLUP ACCOUNT
    const secondMnemonic = ethers.Wallet.createRandom().mnemonic;
    const secondRskWallet = ethers.Wallet.fromMnemonic(
      secondMnemonic.phrase
    ).connect(rskProvider);
    const secondRollupWallet = await rifRollup.Wallet.fromEthSigner(
      secondRskWallet,
      syncProvider
    );

    await deposit(rollupWallet, secondRollupWallet.address());
    await unlockAccount(secondRollupWallet);
  }

export async function unlockAccount(rollupWallet) {
    console.log(
      "unlockRifRollupAccount() rollupWallet: ",
      rollupWallet.address()
    );
  
    if (!(await rollupWallet.isSigningKeySet())) {
      console.log("unlockRifRollupAccount() isSigningKeySet false");
      if ((await rollupWallet.getAccountId()) == undefined) {
        console.log("unlockRifRollupAccount() getAccountId undefined");
        throw new Error("Unknown account");
      }
  
      console.log("unlockRifRollupAccount() ln59");
      // As any other kind of transaction, `ChangePubKey` transaction requires fee.
      // User doesn't have (but can) to specify the fee amount. If omitted, library will query RIF Rollup node for
      // the lowest possible amount.
      const changePubkey = await rollupWallet.setSigningKey({
        feeToken: "RBTC",
        ethAuthType: "ECDSA",
      });
  
      // Wait until the tx is committed
      const someReceipt = await changePubkey.awaitReceipt();
      console.log("unlockRifRollupAccount(): unlock success: ", someReceipt);
    }
  }