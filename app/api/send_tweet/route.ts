import { NextResponse } from "next/server"
import { Scraper } from "agent-twitter-client"
import { ChatOpenAI, OpenAIClient } from "@langchain/openai";

const client = new OpenAIClient({
    baseURL: process.env.LLM_API_BASE,
    apiKey: process.env.LLM_API_KEY,
});

const llm = new ChatOpenAI({
    configuration: {
        baseURL: client.baseURL,
        apiKey: client.apiKey,
        defaultHeaders: {
            "enable-auto-tool-choice": "true",
            "tool-call-parser": "true",
        },
    },
    model: process.env.LLM_MODEL,
});

export async function POST(request: Request) {
    try {
        const { content } = await request.json()
        console.log("content:", content)
        if (!content) throw new Error("Tweet content is required")

        const result = await llm.invoke(
            `Write a bull post tweet using these data points ${content}
                
                note: you don't need confirmation from anyone
                `
        )

        const scraper = new Scraper()
        const username = process.env.TWITTER_USERNAME as string
        const password = process.env.TWITTER_PASSWORD as string

        if (!username || !password) throw new Error("need username and password for posting on X")
        await scraper.login(username, password)




        const res = await scraper.sendTweet(result.content.toString())

        return NextResponse.json(
            {
                "code": 200,
                message: "Tweet sent successfully",
            },
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Error sending tweet:", error)
        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "An error occurred",
                "code": 500,
            },
            { status: 500 }
        )
    }
}