import { RunnableSequence } from "@langchain/core/runnables"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { StateType } from "../state"
import { ChatOpenAI } from "@langchain/openai"

const COMMUNITY_MANAGE_SYSTEM_PROMPT = `You are a Web3 community manager focused on the Aptos blockchain.
Your role is to analyze community engagement and manage interactions by:

1. Analyzing community sentiment and feedback
2. Tracking protocol adoption metrics and growth
3. Identifying key community influencers and advocates
4. Suggesting community engagement strategies

Provide detailed analysis of community health and growth metrics.
Format recommendations in a structured way for actionable insights.
`

const prompt = ChatPromptTemplate.fromMessages([
    ["system", COMMUNITY_MANAGE_SYSTEM_PROMPT],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
])

const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.2,
})

export const communityManageNode = RunnableSequence.from([
    {
        input: (state: StateType) => state.input,
        chat_history: (state: StateType) => state.intermediate_steps,
        content_data: (state: StateType) => state.content_data,
    },
    prompt,
    model,
    {
        community_analysis: (output: any) => output,
    },
])