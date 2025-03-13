import { Tool } from "@langchain/core/tools"
import { type AgentRuntime } from "move-agent-kit"
import axios from 'axios';

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/aptos/market_chart?vs_currency=usd&days=1";

export class AptosVolumeTool extends Tool {
  name = "get_aptos_volume"
  description = `Fetch the daily trading volume of APT on the Aptos network.`

  constructor(private agent: AgentRuntime) {
    super()
  }

  protected async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(COINGECKO_API);
      const data = response.data;

      // Get the volume data for the last 24 hours
      const volumes = data.total_volumes;

      // The total volume for the last 24 hours (last entry in the array)
      const dailyVolume = volumes[volumes.length - 1][1];  // volume in USD

      // Format the volume to include commas for better readability
      const formattedVolume = dailyVolume.toLocaleString();

      return JSON.stringify({
        status: "success",
        volume: formattedVolume
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