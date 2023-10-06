import * as rifRollup from "@rsksmart/rif-rollup-js-sdk";
import { ethers } from "ethers";

const NETWORK = "testnet";
const RSK_TESTNET_NODE_URL = "https://public-node.testnet.rsk.co";

export async function transfering() {
  const syncProvider = await rifRollup.getDefaultProvider(NETWORK);
  const rskProvider = new ethers.providers.JsonRpcProvider(
    RSK_TESTNET_NODE_URL
  );

  const MNEMONIC = {
    phrase:
      "visual believe shift seek chest flip mystery puppy chief squirrel split check",
  };

  console.log("MNEMONIC: ", MNEMONIC.phrase);
  const rskWallet = ethers.Wallet.fromMnemonic(MNEMONIC.phrase).connect(
    rskProvider
  );

  console.log("rbtcWallet: ", rskWallet.address);

  const fundedRollupWallet = await rifRollup.Wallet.fromEthSigner(
    rskWallet,
    syncProvider
  );

  // Creating a second wallet
  const secondMnemonic = ethers.Wallet.createRandom().mnemonic;
  const secondRskWallet = ethers.Wallet.fromMnemonic(
    secondMnemonic.phrase
  ).connect(rskProvider);
  const secondRollupWallet = await rifRollup.Wallet.fromEthSigner(
    secondRskWallet,
    syncProvider
  );

  await transfer(fundedRollupWallet, secondRollupWallet, "0.00009", "0.001");
  // await transfer(fundedRollupWallet, secondRollupWallet, "0.009");
}

async function transfer(rollupWallet, secondRollupWallet, amount, fee = 0) {
  let transfer;
  const fixedAmount = rifRollup.utils.closestPackableTransactionAmount(
    ethers.utils.parseEther("0.009")
  );
  console.log("transfer() fixedAmount: ", amount.toString());

  if (fee > 0) {
    const fixedFee = rifRollup.utils.closestPackableTransactionFee(
      ethers.utils.parseEther("0.001")
    );
    console.log("transfer() fixedFee: ", fee.toString());

    transfer = await rollupWallet.syncTransfer({
      to: secondRollupWallet.address(),
      token: "RBTC",
      amount: fixedAmount,
      fee: fixedFee,
    });
  } else {
    transfer = await rollupWallet.syncTransfer({
      to: secondRollupWallet.address(),
      token: "RBTC",
      amount: fixedAmount,
    });
  }

  console.log("transfer() transaction: ", transfer);

  // Wait until the tx is committed
  const receipt = await transfer.awaitReceipt();
  console.log("transfer(): transfer success: ", receipt);
}
