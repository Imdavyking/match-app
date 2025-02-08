import { HfAgent, LLMFromHub, defaultTools } from "@huggingface/agents";
import dotenv from "dotenv";
import type { Tool } from "@huggingface/agents/src/types";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
type Data = string | Blob | ArrayBuffer;
const tools: Tool[] = [
  {
    name: "createRequestAI",
    description:
      "Create a new request with name and description, convert arguments to JSON.",
    examples: [
      {
        prompt:
          "Create a request with name Gucci Bag and description Nice Bag .",
        code: `const output = createRequestAI('{"name":"Gucci Bag","description":"Nice Bag"}')`,
        tools: ["createRequestAI"],
      },
    ],
    call: async (input: Promise<Data>) => {
      const data = await input;
      if (typeof data === "string") {
        throw new Error("Invalid input");
      }
      const { name, description } = JSON.parse(data.toString());
      return JSON.stringify({
        name: "createRequestAI",
        args: {
          name,
          description,
        },
        type: "tool_call",
        id: 1,
      });
    },
  },
  // {
  //   name: "getRequestAI",
  //   description: "Fetch a request by ID.",
  //   examples: [
  //     {
  //       prompt: "Get details for request ID 123.",
  //       code: `const output = getRequestAI({ id: '123' })`,
  //       tools: ["getRequestAI"],
  //     },
  //   ],
  //   call: async ({ id }: { id: string }) => {
  //     return {
  //       name: "getRequestAI",
  //       args: {
  //         id,
  //       },
  //       type: "tool_call",
  //       id: 2,
  //     };
  //   },
  // },
  // {
  //   name: "createStoreAI",
  //   description: "Create a new store.",
  //   examples: [
  //     {
  //       prompt:
  //         "Create a store with name Kingsmen and description we are best.",
  //       code: `const output = createStoreAI({ name: 'Kingsmen', description: 'we are best' })`,
  //       tools: ["createStoreAI"],
  //     },
  //   ],
  //   call: async ({
  //     name,
  //     description,
  //   }: {
  //     name: string;
  //     description: string;
  //   }) => {
  //     return {
  //       name: "createStoreAI",
  //       args: {
  //         name,
  //         description,
  //       },
  //       type: "tool_call",
  //       id: 3,
  //     };
  //   },
  // },
  // {
  //   name: "createUserAI",
  //   description: "Create a new user.",
  //   examples: [
  //     {
  //       prompt:
  //         "Create a new buyer user with name john_doe and phone 1234567890.",
  //       code: `const output = createUserAI({ username: 'john_doe', account_type: 'buyer', phone: '1234567890' })`,
  //       tools: ["createUserAI"],
  //     },
  //   ],

  //   call: async ({
  //     username,
  //     account_type,
  //     phone,
  //   }: {
  //     username: string;
  //     account_type: string;
  //     phone: string;
  //   }) => {
  //     return {
  //       name: "createUserAI",
  //       args: {
  //         username,
  //         account_type,
  //         phone,
  //       },
  //       type: "tool_call",
  //       id: 4,
  //     };
  //   },
  // },
  // {
  //   name: "updateUserAI",
  //   description: "Update an existing user.",
  //   examples: [
  //     {
  //       prompt: "Update user information.",
  //       code: `const output = updateUserAI({})`,
  //       tools: ["updateUserAI"],
  //     },
  //   ],
  //   call: async ({}) => {
  //     return {
  //       name: "updateUserAI",
  //       args: {},
  //       type: "tool_call",
  //       id: 5,
  //     };
  //   },
  // },
  // {
  //   name: "toggleLocationAI",
  //   description: "Enable or disable location tracking.",
  //   examples: [
  //     {
  //       prompt: "Enable location tracking.",
  //       code: `const output = toggleLocationAI({ isEnabled: true })`,
  //       tools: ["toggleLocationAI"],
  //     },
  //   ],
  //   call: async ({ isEnabled }: { isEnabled: boolean }) => {
  //     return {
  //       name: "toggleLocationAI",
  //       args: {
  //         isEnabled,
  //       },
  //       type: "tool_call",
  //       id: 6,
  //     };
  //   },
  // },
  // {
  //   name: "fetchUserByIdAI",
  //   description: "Fetch user details by ID.",
  //   examples: [
  //     {
  //       prompt: "Get details for user ID 456.",
  //       code: `const output = fetchUserByIdAI({ id: '456' })`,
  //       tools: ["fetchUserByIdAI"],
  //     },
  //   ],
  //   call: async ({ id }: { id: string }) => {
  //     return {
  //       name: "fetchUserByIdAI",
  //       args: {
  //         id,
  //       },
  //       type: "tool_call",
  //       id: 7,
  //     };
  //   },
  // },
];

const api = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

const llmOpenAI = async (prompt: string): Promise<string> => {
  // console.log({ prompt });
  const completion = await api.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  console.log({ choices: completion.data.choices[0].message });

  if (completion.data.choices[0]?.message?.content) {
    return completion.data.choices[0].message.content;
  }
  return "";
};

export async function runAIAgent(messages: string) {
  try {
    const agent = new HfAgent(
      process.env.HUGGINGFACE_API_KEY!,
      llmOpenAI,
      tools
    );

    return await agent.run(messages);
  } catch (error) {
    console.error(error);
    return {};
  }
}
