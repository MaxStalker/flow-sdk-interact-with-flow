import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import * as types from "@onflow/types";

export default async (a = 40, b = 2) => {
  const response = await fcl.send([
    sdk.script`
      pub fun main(a:Int, b:Int ):Int {
        return a + b
      }
    `,
    sdk.args([
      sdk.arg(a, types.Int),
      sdk.arg(b, types.Int)])
  ]);

  return fcl.decode(response);
};
