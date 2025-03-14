import { Tool } from "@langchain/core/tools"
import { type AgentRuntime, parseJson } from "move-agent-kit"
import axios from 'axios';

export class AptosWalletBalanceTool extends Tool {
	name = "get_aptos_wallet_balance"
	description = `Query the balance of an Aptos wallet by entering the Aptos wallet address.`

	constructor(private agent: AgentRuntime) {
		super()
	}

	protected async _call(input: string): Promise<string> {
		try {
      const APTOS_API_URL = "https://api.devnet.aptoslabs.com/v1";
      console.log("AptosWalletBalanceTool input:", input)
      const walletAddress = input
			const url = `${APTOS_API_URL}/accounts/${walletAddress}/resources`;
			// Make a GET request to fetch the wallet resources
      const response = await axios.get(url);
      const data = response.data;

      var balance =0;

      // Iterate over the resources to find the one with Aptos balance
      for (let resource of data) {
          if (resource.type.includes("0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>")) {
              balance = parseInt(resource.data.coin.value) / 1e8; // Convert to APT
              console.log(`The balance of wallet ${walletAddress} is ${balance} APT.`)
          }
      }
      return JSON.stringify({
        status: "success",
        balance,
        wallet: walletAddress
      })
		} catch (error: any) {
			return JSON.stringify({
				status: "error",
				message: error.message,
				code: error.code || "UNKNOWN_ERROR",
			})
		}
	}
}