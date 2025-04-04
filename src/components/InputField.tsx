import React, { useRef, useState } from "react";

interface Props {
  onConnect: (privateKey: string, rpcUrl: string) => void;
}

const InputField: React.FC<Props> = ({ onConnect }) => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [rpcUrl, setRpcUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (privateKey && rpcUrl) {
      onConnect(privateKey, rpcUrl);
      inputRef.current?.blur();
    }
  };

  return (
    <form className="input" onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Enter your private key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        className="input__box"
      />
      <input
        type="text"
        placeholder="Enter RPC URL"
        value={rpcUrl}
        onChange={(e) => setRpcUrl(e.target.value)}
        className="input__box"
      />
      <button type="submit" className="input_submit">
        Connect
      </button>
    </form>
  );
};

export default InputField;
