import { Tool } from "@langchain/core/tools"
import { type AgentRuntime } from "move-agent-kit"
import axios from 'axios';

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/aptos/market_chart?vs_currency=usd&days=1";

export class AptosPriceChangeTool extends Tool {
  name = "get_aptos_price_change"
  description = `Fetches the daily price change (percentage) of Aptos (APT) cryptocurrency.`

  constructor(private agent: AgentRuntime) {
    super()
  }

  protected async _call(input: string): Promise<string> {
    try {
      console.log("input:", input)
      const response = await axios.get(COINGECKO_API);
      const data = response.data;

      // Get the price data for the last 24 hours
      const prices = data.prices;
      const firstPrice = prices[0][1]; // Price at the start of the day
      const lastPrice = prices[prices.length - 1][1]; // Price at the end of the day

      // Calculate the daily price change percentage
      const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
      const priceChangeFormatted = `${priceChange.toFixed(2)}%`;

      return JSON.stringify({
        status: "success",
        increase_ratio: priceChangeFormatted
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