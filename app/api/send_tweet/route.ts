import { NextResponse } from "next/server"
import { Scraper } from "agent-twitter-client"

export async function POST(request: Request) {
    try {
        const { content } = await request.json()
        console.log("content:", content)
        if (!content) throw new Error("Tweet content is required")

        const scraper = new Scraper()
        const username = process.env.TWITTER_USERNAME as string
        const password = process.env.TWITTER_PASSWORD as string

        if (!username || !password) throw new Error("need username and password for posting on X")
        await scraper.login(username, password)

        const res = await scraper.sendTweet(content)

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