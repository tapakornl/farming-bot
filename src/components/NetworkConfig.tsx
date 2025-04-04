import React, { useState } from "react";
import { Network } from "../types";

interface Props {
  onNetworkAdd: (network: Network) => void;
  networks: Network[];
}

const NetworkConfig: React.FC<Props> = ({ onNetworkAdd, networks }) => {
  const [network, setNetwork] = useState<Network>({
    id: "",
    name: "",
    rpcUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNetworkAdd(network);
    setNetwork({ id: "", name: "", rpcUrl: "" });
  };

  return (
    <div className="network-config">
      <h3>Networks</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Network Name"
          value={network.name}
          onChange={(e) =>
            setNetwork((prev) => ({
              ...prev,
              name: e.target.value,
              id: Date.now().toString(),
            }))
          }
        />
        <input
          placeholder="RPC URL"
          value={network.rpcUrl}
          onChange={(e) =>
            setNetwork((prev) => ({ ...prev, rpcUrl: e.target.value }))
          }
        />
        <button type="submit">Add Network</button>
      </form>
      <div className="network-list">
        {networks.map((net) => (
          <div key={net.id}>
            {net.name} - {net.rpcUrl}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkConfig;
