// import { depositToMyself } from "./testCases/1depositToMyself.js";
// import { unlockRifRollupAccount } from "./testCases/2unlockRifRollupAccount.js";
// import { checkInformation } from "./testCases/3checkInformtion.js";
// import { transfering } from "./testCases/4makeATransfer.js";
import { withdrawToL1 } from "./testCases/5withdraw.js";

export async function executeAllTests() {
  // await depositingToMyself();
  // await unlockRifRollupAccount();
  // await checkInformation();
  // await transfering();
  await withdrawToL1();
}

