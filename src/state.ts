import { RunnableConfig } from "@langchain/core/runnables"
import { AgentAction, AgentFinish } from "@langchain/core/agents"

export interface StateType {
    input: string
    content_data?: any
    community_analysis?: any
    protocol_metrics?: any
    current_step?: string
    intermediate_steps: (AgentAction | AgentFinish)[]
    next_step?: string
}

export class StateAnnotation {
    static channels = {
        input: { type: "string" },
        content_data: { type: "any" },
        community_analysis: { type: "any" },
        protocol_metrics: { type: "any" },
        current_step: { type: "string" },
        intermediate_steps: { type: "array" },
        next_step: { type: "string" },
        output: { type: "any" },
        messages: { type: "array" }
    }
   
    static create(input: string): StateType {
        return {
            input,
            intermediate_steps: [],
        }
    }

    static get_config(state: StateType): RunnableConfig {
        return {
            configurable: {
                content_data: state.content_data,
                community_analysis: state.community_analysis,
                protocol_metrics: state.protocol_metrics,
                current_step: state.current_step,
                intermediate_steps: state.intermediate_steps,
            },
        }
    }
}