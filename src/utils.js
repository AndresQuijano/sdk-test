import { ethers } from "ethers";

export async function deposit(rollupWallet, destiantionAddress) {
  console.log("deposit() rollupWallet: ", rollupWallet.address());
  console.log("deposit() destinationAddress: ", destiantionAddress)

  const deposit = await rollupWallet.depositToSyncFromRootstock({
    depositTo: destiantionAddress,
    token: "RBTC",
    amount: ethers.utils.parseEther("0.001"),
  });

  // Await confirmation from the RIF Rollup operator
  // Completes when a promise is issued to process the tx
  const depositReceipt1 = await deposit.awaitReceipt();
  console.log("deposit() depositReceipt1: ", depositReceipt1);

  // Await verification
  // Completes when the tx reaches finality on Rootstock
  const depositReceipt2 = await deposit.awaitVerifyReceipt();

  console.log("deposit() depositReceipt2: ", depositReceipt2);
}
