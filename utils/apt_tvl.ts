import { Tool } from "@langchain/core/tools"
import { type AgentRuntime, parseJson } from "move-agent-kit"
import axios from 'axios';

const DEFI_LLAMA_API = "https://api.llama.fi/chains"
export class AptosTVLTool extends Tool {
	name = "get_aptos_tvl"
	description = `Fetches the current Total Value Locked (TVL) on the Aptos blockchain.`

	constructor(private agent: AgentRuntime) {
		super()
	}

	protected async _call(input: string): Promise<string> {
		try {
     
    console.log("AptosTVLTool input:", input)
       // Send a GET request to fetch TVL data
    const response = await axios.get(DEFI_LLAMA_API);
    const data = response.data;

    // Loop through the data to find the Aptos chain and its TVL
    var tvl=0;
    for (let chain of data) {
      if (chain.name.toLowerCase() === "aptos") {
        tvl = chain.tvl;
        console.log(`Aptos TVL: $${tvl.toLocaleString()}`) ;
      }
    }

      return JSON.stringify({
        status: "success",
        tvl: tvl
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