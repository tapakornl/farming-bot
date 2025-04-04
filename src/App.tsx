import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import InputField from "./components/InputField";
import ActionSelector from "./components/ActionSelector";
import { Action } from "./types";
import { executeAction, Web3Service } from "./utils/web3";

const App: React.FC = () => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleConnect = (key: string, rpcUrl: string) => {
    try {
      const network = { id: "1", name: "Custom", rpcUrl };
      setWeb3Service(new Web3Service(network, key));
      setPrivateKey(key);
    } catch (error) {
      console.error("Failed to initialize web3 service:", error);
      alert("Failed to connect. Please check your private key and RPC URL.");
    }
  };

  const handleAddAction = (action: Action) => {
    setActions((prev) => [...prev, action]);
  };

  const toggleAutomation = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (!isRunning || !web3Service) return;

    let isExecuting = false;
    const executeActions = async () => {
      console.log("Executing actions...", actions);
      if (isExecuting) return;
      isExecuting = true;

      try {
        for (let i = 0; i < actions.length; i++) {
          console.log({ i });
          if (!isRunning) break;

          const action = actions[i];
          if (action.status === "completed" || action.status === "failed")
            continue;
          console.log("Executing action:", action);
          // Update status to running
          setActions((prev) =>
            prev.map((a) =>
              a.id === action.id ? { ...a, status: "running" } : a
            )
          );

          try {
            console.log("web3 service execute action", action);
            console.log("web3 service", web3Service);
            const success = await web3Service.executeAction(action);
            // const success = await executeAction(action);
            console.log("web3 service done");
            setActions((prev) =>
              prev.map((a) =>
                a.id === action.id
                  ? { ...a, status: success ? "completed" : "failed" }
                  : a
              )
            );
          } catch (error) {
            console.error(`Action ${action.name} failed:`, error);
            setActions((prev) =>
              prev.map((a) =>
                a.id === action.id ? { ...a, status: "failed" } : a
              )
            );
          }

          // If we reached the end, reset all actions to pending
          if (i === actions.length - 1) {
            setActions((prev) =>
              prev.map((a) => ({ ...a, status: "pending" }))
            );
          }
        }
      } finally {
        isExecuting = false;
      }
    };

    const interval = setInterval(executeActions, 3000); // Check every second
    return () => clearInterval(interval);
  }, [isRunning, web3Service, actions]);

  return (
    <div className="App">
      <span className="heading">Web3 Automation</span>
      {!privateKey ? (
        <InputField onConnect={handleConnect} />
      ) : (
        <>
          <ActionSelector onAddAction={handleAddAction} />
          <div className="actions-list">
            {actions.map((action) => (
              <div key={action.id}>
                {action.name} - {action.status}
              </div>
            ))}
          </div>
          <button onClick={toggleAutomation}>
            {isRunning ? "Stop" : "Start"} Automation
          </button>
        </>
      )}
    </div>
  );
};

export default App;
