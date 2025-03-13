import { NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit"
import { Aptos, AptosConfig, Network, PrivateKey, PrivateKeyVariants, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk"

// 复用已有的 OpenAI 客户端配置
const llm = new ChatOpenAI({
    configuration: {
        baseURL: "https://inference.nebulablock.com/v1",
        apiKey: "sk-CuuB677iOeR15xCPeAlzcw",
        defaultHeaders: {
            "enable-auto-tool-choice": "true",
            "tool-call-parser": "true",
        },
    },
    modelName: "meta-llama/Llama-3.3-70B-Instruct",
    model: "meta-llama/Llama-3.3-70B-Instruct",
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { content } = body

        if (!content) {
            return NextResponse.json(
                { error: "Tweet content is required" },
                { status: 400 }
            )
        }

        // 初始化 Aptos 配置
        const aptosConfig = new AptosConfig({
            network: Network.DEVNET,
        })
        const aptos = new Aptos(aptosConfig)

        // 验证并获取私钥
        const privateKeyStr = process.env.APTOS_PRIVATE_KEY
        if (!privateKeyStr) {
            throw new Error("Missing APTOS_PRIVATE_KEY environment variable")
        }

        // 设置账户和签名者
        const account = await aptos.deriveAccountFromPrivateKey({
            privateKey: new Secp256k1PrivateKey(PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Secp256k1)),
        })

        const signer = new LocalSigner(account, Network.DEVNET)
        const aptosAgent = new AgentRuntime(signer, aptos, {
            PANORA_API_KEY: process.env.PANORA_API_KEY,
        })

        // TODO: 实现发送推文的具体逻辑
        // 这里需要根据你的具体需求来实现
        // 可能需要调用特定的智能合约或其他服务

        return NextResponse.json(
            {
                status: "success",
                message: "Tweet sent successfully",
                content: content
            },
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Error sending tweet:", error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "An error occurred",
                status: "error",
            },
            { status: 500 }
        )
    }
}