import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { Network, Action } from "../types";

export async function executeAction(action: Action) {
  console.log("in executeAction");
  return true;
}

export class Web3Service {
  private provider: JsonRpcProvider;
  private wallet: Wallet;

  constructor(network: Network, privateKey: string) {
    this.provider = new JsonRpcProvider(network.rpcUrl);
    this.wallet = new Wallet(privateKey, this.provider);
  }

  async executeAction(action: Action): Promise<boolean> {
    console.log("in executeAction");
    if (!this.provider || !this.wallet) {
      throw new Error("Web3 service not properly initialized");
    }

    try {
      console.log("action name: ", action.name);
      switch (action.name) {
        case "uniswap-swap":
          return await this.executeUniswapSwap(action);
        case "aave-lend":
          return await this.executeAaveLend(action);
        case "sleep":
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return true;
        case "custom-transaction":
          return await this.executeCustomAction(action);
        default:
          throw new Error(`Unknown action: ${action.name}`);
      }
    } catch (error) {
      console.error(`Failed to execute ${action.name}:`, error);
      throw error;
    }
  }

  private async executeUniswapSwap(action: Action): Promise<boolean> {
    // Here you would implement actual Uniswap interaction
    // For now, just simulating with a delay
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log({ action });
    return true;
  }

  private async executeAaveLend(action: Action): Promise<boolean> {
    // Here you would implement actual Aave interaction
    // For now, just simulating with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true;
  }

  private async executeCustomAction(action: Action): Promise<boolean> {
    const tx = {
      to: action.parameters.find((p) => p.name === "to")?.value,
      data: action.parameters.find((p) => p.name === "data")?.value || "0x",
      value: ethers.parseEther(
        action.parameters.find((p) => p.name === "value")?.value || "0"
      ),
    };

    try {
      const response = await this.wallet.sendTransaction(tx);
      const receipt = await response.wait();
      return receipt?.status === 1;
    } catch (error) {
      console.error("Custom action failed:", error);
      throw error;
    }
  }
}
