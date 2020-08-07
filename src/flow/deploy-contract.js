import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import * as types from "@onflow/types";

export default async () => {
  const { authorization } = fcl.currentUser();

  // Let's deploy simple contract, with a single pulbic method hello
  const contract = `
    pub contract HelloWorld {
      pub let greeting: String
  
      init() {
          self.greeting = "Hello, Cadence!"
      }
  
      pub fun hello(): String {
          return self.greeting
      }
    }
  `;

  const code = Buffer.from(contract, "utf8").toString("hex");
  return fcl.send([
    sdk.transaction`
      transaction(code: String) {
        prepare(acct: AuthAccount) {
          acct.setCode(code.decodeHex())
        }
      }
    `,
    sdk.args([sdk.arg(code, types.String)]),
    sdk.payer(authorization),
    sdk.proposer(authorization),
    sdk.authorizations([authorization])
  ]);
};
