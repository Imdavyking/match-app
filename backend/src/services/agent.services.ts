import { ChatOpenAI } from "@langchain/openai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const tools = {
  createRequestAI: tool(() => undefined, {
    name: "createRequestAI",
    description: "Create a new request.",
    schema: z.object({
      name: z.string().describe("The name of the request"),
      description: z.string().describe("The description of the request"),
    }),
  }),
  getRequestAI: tool(() => undefined, {
    name: "getRequestAI",
    description: "Fetch a request by ID.",
    schema: z.object({
      id: z.string().describe("The ID of the request"),
    }),
  }),
  createStoreAI: tool(() => undefined, {
    name: "createStoreAI",
    description: "Create a new store.",
    schema: z.object({
      name: z.string().describe("The name of the store"),
      description: z.string().describe("The description of the store"),
    }),
  }),
  createUserAI: tool(() => undefined, {
    name: "createUserAI",
    description: "Create a new user.",
    schema: z.object({
      username: z.string().describe("The username of the user"),
      account_type: z.enum(["buyer", "seller"]).describe("The account type"),
      phone: z.string().describe("The user's phone number"),
    }),
  }),
  updateUserAI: tool(() => undefined, {
    name: "updateUserAI",
    description: "Update an existing user.",
    schema: z.object({}),
  }),
  toggleLocationAI: tool(() => undefined, {
    name: "toggleLocationAI",
    description: "Enable or disable location tracking.",
    schema: z.object({
      isEnabled: z
        .boolean()
        .describe("Whether location should be enabled or not"),
    }),
  }),
  fetchUserByIdAI: tool(() => undefined, {
    name: "fetchUserByIdAI",
    description: "Fetch user details by ID.",
    schema: z.object({
      id: z.string().describe("The user's ID"),
    }),
  }),
};

export async function runAIAgent(messages: (AIMessage | HumanMessage)[]) {
  const llm = new HuggingFaceInference({
    model: "gpt-4o-mini",
    apiKey: process.env.HUGGINGFACE_API_KEY!,
  }).bind({
    tools: Object.values(tools),
  });

  const systemPrompt = new SystemMessage(
    `You are an assistant that converts user prompts into structured formats.`
  );
  const result = await llm.invoke([systemPrompt, ...messages]);
  return { content: result.content, tool_calls: result.tool_calls };
}
