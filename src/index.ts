import { END, START, StateGraph } from "@langchain/langgraph"
import {StateAnnotation} from "./state"
import { managerNode, managerRouter } from "./agents/manager"
import { contentGenNode } from "./agents/content-gen-agent"
import { communityManageNode } from "./agents/community-manage-agent"
import { protocolTrackNode } from "./agents/protocol-track-agent"

// Create a workflow for Web3 social operations
const workflow = new StateGraph(StateAnnotation)
    .addNode("manager", managerNode)
    .addNode("contentGen", contentGenNode)
    .addNode("communityManage", communityManageNode)
    .addNode("protocolTrack", protocolTrackNode)
    .addEdge("contentGen", "communityManage")
    .addEdge("communityManage", "protocolTrack")
    .addEdge(START, "manager")
    .addConditionalEdges("manager", managerRouter)
    .addEdge("protocolTrack", END)

export const graph = workflow.compile()