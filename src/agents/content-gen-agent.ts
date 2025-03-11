import { RunnableSequence } from "@langchain/core/runnables"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { StateType } from "../state"
import { ChatOpenAI } from "@langchain/openai"

const CONTENT_GEN_SYSTEM_PROMPT = `You are a Web3 content creation specialist focused on the Aptos blockchain.
Your role is to generate engaging and viral content by:

1. Creating informative and engaging posts about blockchain technology
2. Crafting viral-worthy content that explains complex Web3 concepts
3. Generating educational material about protocol features and updates
4. Developing content strategies for different social platforms

Ensure content is accurate, engaging, and optimized for social media reach.
Format output in a structured way that includes the content, target platform, and engagement strategy.
`

const prompt = ChatPromptTemplate.fromMessages([
    ["system", CONTENT_GEN_SYSTEM_PROMPT],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
])

const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
})

export const contentGenNode = RunnableSequence.from([
    {
        input: (state: StateType) => state.input,
        chat_history: (state: StateType) => state.intermediate_steps,
    },
    prompt,
    model,
    {
        content_data: (output: any) => output,
    },
])