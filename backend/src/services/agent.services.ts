import { ChatOpenAI } from "@langchain/openai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { HfAgent, defaultTools } from "@huggingface/agents";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const tools = [
  {
    name: "createRequestAI",
    description: "Create a new request.",
    examples: [
      {
        prompt:
          "Create a request with name Gucci Bag and description Nice Bag .",
        code: `const output = createRequestAI({ name: 'Gucci Bag', description: 'Nice Bag' })`,
        tools: ["createRequestAI"],
      },
    ],
    call: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      return {
        name,
        description,
        toolName: "createRequestAI",
      };
    },
  },
  {
    name: "getRequestAI",
    description: "Fetch a request by ID.",
    examples: [
      {
        prompt: "Get details for request ID 123.",
        code: `const output = getRequestAI({ id: '123' })`,
        tools: ["getRequestAI"],
      },
    ],
    call: async ({ id }: { id: string }) => {
      return { id, toolName: "getRequestAI" };
    },
  },
  {
    name: "createStoreAI",
    description: "Create a new store.",
    examples: [
      {
        prompt:
          "Create a store with name Kingsmen and description we are best.",
        code: `const output = createStoreAI({ name: 'Kingsmen', description: 'we are best' })`,
        tools: ["createStoreAI"],
      },
    ],
    call: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      return {
        name,
        description,
        toolName: "createStoreAI",
      };
    },
  },
  {
    name: "createUserAI",
    description: "Create a new user.",
    examples: [
      {
        prompt:
          "Create a new buyer user with name john_doe and phone 1234567890.",
        code: `const output = createUserAI({ username: 'john_doe', account_type: 'buyer', phone: '1234567890' })`,
        tools: ["createUserAI"],
      },
    ],

    call: async ({
      username,
      account_type,
      phone,
    }: {
      username: string;
      account_type: string;
      phone: string;
    }) => {
      return { username, account_type, phone, toolName: "createUserAI" };
    },
  },
  {
    name: "updateUserAI",
    description: "Update an existing user.",
    examples: [
      {
        prompt: "Update user information.",
        code: `const output = updateUserAI({})`,
        tools: ["updateUserAI"],
      },
    ],
    call: async ({}) => {
      return {
        toolName: "updateUserAI",
      };
    },
  },
  {
    name: "toggleLocationAI",
    description: "Enable or disable location tracking.",
    examples: [
      {
        prompt: "Enable location tracking.",
        code: `const output = toggleLocationAI({ isEnabled: true })`,
        tools: ["toggleLocationAI"],
      },
    ],
    call: async ({ isEnabled }: { isEnabled: boolean }) => {
      return { isEnabled, toolName: "toggleLocationAI" };
    },
  },
  {
    name: "fetchUserByIdAI",
    description: "Fetch user details by ID.",
    examples: [
      {
        prompt: "Get details for user ID 456.",
        code: `const output = fetchUserByIdAI({ id: '456' })`,
        tools: ["fetchUserByIdAI"],
      },
    ],
    call: async ({ id }: { id: string }) => {
      return {
        id,
        toolName: "fetchUserByIdAI",
      };
    },
  },
  ...defaultTools,
];

export async function runAIAgent(messages: string) {
  const agent = new HfAgent(
    process.env.HUGGINGFACE_API_KEY!,
    undefined,
    tools as any
  );

  return await agent.evaluateCode(messages);
}
