import { RunnableSequence } from "@langchain/core/runnables"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { StateType } from "../state"
import { ChatOpenAI } from "@langchain/openai"

const PROTOCOL_TRACK_SYSTEM_PROMPT = `You are a Web3 protocol metrics analyst focused on the Aptos blockchain.
Your role is to track and analyze protocol adoption metrics by:

1. Monitoring key protocol usage statistics
2. Analyzing user growth and engagement trends
3. Tracking transaction volumes and patterns
4. Identifying adoption barriers and opportunities

Provide comprehensive analysis of protocol performance metrics.
Format data in a structured way for actionable insights on growth.
`

const prompt = ChatPromptTemplate.fromMessages([
    ["system", PROTOCOL_TRACK_SYSTEM_PROMPT],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
])

const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.1,
})

export const protocolTrackNode = RunnableSequence.from([
    {
        input: (state: StateType) => state.input,
        chat_history: (state: StateType) => state.intermediate_steps,
        community_analysis: (state: StateType) => state.community_analysis,
    },
    prompt,
    model,
    {
        protocol_metrics: (output: any) => output,
    },
])