import React, { useState } from "react";
import { Action, ActionParameter } from "../types";

interface Props {
  onAddAction: (action: Action) => void;
}

const predefinedActions = [
  { id: "uniswap-swap", name: "Uniswap Swap" },
  { id: "aave-lend", name: "Aave Lend" },
  { id: "sleep", name: "Sleep" },
];

const ActionSelector: React.FC<Props> = ({ onAddAction }) => {
  const [selectedAction, setSelectedAction] = useState("");
  const [parameters, setParameters] = useState<ActionParameter[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [customParams, setCustomParams] = useState({
    to: "",
    data: "",
    value: "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAction: Action = {
      id: Date.now().toString(),
      name: isCustom ? "custom-transaction" : selectedAction,
      type: isCustom ? "custom" : "predefined",
      network: { id: "1", name: "Custom", rpcUrl: "" }, // Default network
      parameters: isCustom
        ? [
            { name: "to", type: "address", value: customParams.to },
            { name: "data", type: "string", value: customParams.data },
            { name: "value", type: "string", value: customParams.value },
          ]
        : parameters,
      status: "pending",
    };
    onAddAction(newAction);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        onChange={(e) => {
          setSelectedAction(e.target.value);
          setIsCustom(e.target.value === "custom");
        }}
      >
        <option value="">Select Action</option>
        {predefinedActions.map((action) => (
          <option key={action.id} value={action.id}>
            {action.name}
          </option>
        ))}
        <option value="custom">Custom Transaction</option>
      </select>

      {isCustom && (
        <div className="custom-params">
          <input
            placeholder="To Address"
            value={customParams.to}
            onChange={(e) =>
              setCustomParams((prev) => ({ ...prev, to: e.target.value }))
            }
          />
          <input
            placeholder="Data (hex)"
            value={customParams.data}
            onChange={(e) =>
              setCustomParams((prev) => ({ ...prev, data: e.target.value }))
            }
          />
          <input
            placeholder="Value (ETH)"
            type="number"
            value={customParams.value}
            onChange={(e) =>
              setCustomParams((prev) => ({ ...prev, value: e.target.value }))
            }
          />
        </div>
      )}

      <button type="submit">Add Action</button>
    </form>
  );
};

export default ActionSelector;
