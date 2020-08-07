import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";

export default async contractAddress => {
  const response = await fcl.send([
    sdk.script`
      import HelloWorld from 0x${contractAddress}

      pub fun main():String {
        return HelloWorld.hello()
      }
    `
  ]);
  return fcl.decode(response);
};
