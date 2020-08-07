import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import * as types from "@onflow/types";

export default async () => {
  const { authorization } = fcl.currentUser();

  return fcl.send([
    sdk.transaction`
      transaction(number: Int) {

        prepare(acct: AuthAccount) {
          log("The number I thought of is:")
          log(number)
        }
      
        execute {
          log("Executed successfully")
        }
      }
    `,
    sdk.args([sdk.arg(12, types.Int)]),
    sdk.payer(authorization),
    sdk.proposer(authorization),
    sdk.authorizations([authorization])
  ]);
};
