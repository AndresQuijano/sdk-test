import * as rifRollup from "@rsksmart/rif-rollup-js-sdk";
import { ethers } from "ethers";
import { formatFixed } from "@ethersproject/bignumber";
import { deposit } from "../utils.js";

const NETWORK = "testnet";
const RSK_TESTNET_NODE_URL = "https://public-node.testnet.rsk.co";

export async function withdrawToL1() {
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

    // deposit to myself
    console.log("make deposit to myself");
    await deposit(rollupWallet, rollupWallet.address());

    // // proceed to withdraw funds back to L1
    console.log("proceding to withdraw funds back to L1");
    const withdraw = await rollupWallet.withdrawFromSyncToRootstock({
        ethAddress: rskFundedWallet.address,
        token: 'RBTC',
        amount: ethers.utils.parseEther('0.0001')
    });

    // Await confirmation from the RIF Rollup operator
    const withdrawReceipt = await withdraw.awaitVerifyReceipt();
    console.log("withdraw() withdrawReceipt: ", withdrawReceipt);
      
    // make sure you have a pending balance for the token you'd want to complete the withdrawal
    console.log("getting pending balance for the token you'd want to complete the withdrawal");
    const pendingBalance = await rifRollup.utils.getPendingBalance(
        rskProvider,
        syncProvider,
        rskFundedWallet.address,
        'RBTC'
    );

    console.log("withdraw() pendingBalance: ", Number(formatFixed(pendingBalance, 18)).toFixed(8));

    // proceed to complete withdraw funds back to L1 wallet
    console.log("proceed to complete withdraw funds back to L1 wallet");
    const withdrawResponse = await rollupWallet.withdrawPendingBalance(
        rskFundedWallet.address,
        'RBTC',
        pendingBalance
    );
    
    await withdrawResponse.wait();
    console.log("withdraw() withdrawResponse: ", withdrawResponse);
    
    const pendingBalanceAfter = await rifRollup.utils.getPendingBalance(
        rskProvider,
        syncProvider,
        rskFundedWallet.address,
        'RBTC'
    );

    console.log("withdraw() pendingBalanceAfter: ", Number(formatFixed(pendingBalanceAfter, 18)).toFixed(8));
}