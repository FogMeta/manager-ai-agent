import { RunnableSequence } from "@langchain/core/runnables"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { StateType } from "../state"
import { ChatOpenAI } from "@langchain/openai"

const MANAGER_SYSTEM_PROMPT = `You are a Web3 social operations manager focused on the Aptos blockchain.
Your role is to coordinate different operations based on user input:

1. For content creation and social media strategy, use 'contentGen'
2. For community analysis and engagement, use 'communityManage'
3. For protocol adoption tracking and metrics, use 'protocolTrack'

Analyze the user's input and determine which operation to perform next.
Respond with the appropriate next step.
`

const prompt = ChatPromptTemplate.fromMessages([
    ["system", MANAGER_SYSTEM_PROMPT],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
])

const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
})

export const managerNode = RunnableSequence.from([
    {
        input: (state: StateType) => state.input,
        chat_history: (state: StateType) => state.intermediate_steps,
    },
    prompt,
    model,
])

export const managerRouter = (state: StateType) => {
    const lastStep = state.intermediate_steps[state.intermediate_steps.length - 1]
    if (!lastStep) return "contentGen"

    const content = lastStep.toString()
    if (content.includes("community") || content.includes("engagement")) return "communityManage"
    if (content.includes("protocol") || content.includes("metrics")) return "protocolTrack"
    return "contentGen"
}