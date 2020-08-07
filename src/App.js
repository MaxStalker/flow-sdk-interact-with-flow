import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

import simpleScript from "./flow/simple-script";
import scriptWithArguments from "./flow/script-with-arguments";
import simpleTransaction from "./flow/simple-transaction";
import deployContract from "./flow/deploy-contract";
import callContract from "./flow/call-contract";

// Setup handshake endpoint
fcl
  .config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate");

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    return fcl.currentUser().subscribe(setUser);
  }, []);

  // "cid" field will be null, when user is not logged in
  const loggedIn = user && user.cid;

  const [scriptResult, setScriptResult] = useState(null);
  const runSimpleScript = async () => {
    const result = await simpleScript();
    setScriptResult(result);
  };

  const [sum, setSum] = useState(null);
  const runWithArguments = async () => {
    const result = await scriptWithArguments(10, 15);
    setSum(result);
  };

  const runSimpleTransaction = async () => {
    const tx = await simpleTransaction();
    fcl.tx(tx).subscribe(status => {
      if (fcl.tx.isSealed(status)) {
        console.log("Transaction was successfully executed");
      }
    });
  };

  const [contractAddress, setContract] = useState(null);
  const runDeploy = async () => {
    const deployTx = await deployContract();
    fcl.tx(deployTx).subscribe(async status => {
      if (fcl.tx.isSealed(status)) {
        console.log("Contract successfully deployed!");
        const { addr } = await fcl.currentUser().snapshot();
        setContract(addr);
      }
    });
  };

  const [greeting, setGreeting] = useState(null);
  const runCallContract = async () => {
    const result = await callContract(contractAddress);
    setGreeting(result);
  };

  return (
    <div>
      <h1>Anonymous Area</h1>
      <div>
        <h2>Simple Script</h2>
        {scriptResult && <p>Result: {scriptResult}</p>}
        <button onClick={runSimpleScript}>Run</button>
      </div>

      <div>
        <h2>Script With Arguments</h2>
        {sum && <p>Result: {sum}</p>}
        <button onClick={runWithArguments}>Run</button>
      </div>

      <h1>Authenticated Area</h1>
      <div>
        {loggedIn ? (
          <div>
            <p>Welcome, {user.identity.name}</p>
            <p>Your address: {user.addr}</p>
            <button onClick={runSimpleTransaction}>Send Simple Tx</button>
            {greeting && <p>Contract says: {greeting}</p>}
            <button onClick={runCallContract}>CallContract</button>
            <button onClick={runDeploy}>Deploy Contract</button>
            <button onClick={fcl.unauthenticate}>Disconnect</button>
          </div>
        ) : (
          <button onClick={fcl.authenticate}>Connect Wallet</button>
        )}
      </div>
    </div>
  );
}

export default App;
