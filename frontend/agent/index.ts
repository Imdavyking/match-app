/** @format */

import { callLLMApi } from "../services/llm.services";
import { useRequestsStore } from "@/pinia/request";
import { useUserStore } from "@/pinia/user";
import { useStoreStore } from "@/pinia/store";
import { AiResponseType, ToolCall, AccountType } from "../types";
import { generateSlug, RandomWordOptions } from "random-word-slugs";
import { createPinia, setActivePinia } from "pinia";

const pinia = createPinia();
setActivePinia(pinia);
const requestStore = useRequestsStore();
const userStore = useUserStore();
const storeStore = useStoreStore();

const options: RandomWordOptions<2> = {
  format: "kebab",
  categories: {
    noun: ["people"],
  },
  partsOfSpeech: ["noun", "noun"],
};

export class AIAgent {
  tools: { [key: string]: Function };
  toolsInfo: { [key: string]: string };

  constructor() {
    this.tools = {
      createUserAI: async ({
        username,
        account_type,
        phone,
      }: {
        username: string | undefined;
        account_type: AccountType;
        phone: string;
      }) => {
        try {
          const lat = 0;
          const long = 0;

          const usernameSlug = generateSlug(2, options);
          await userStore.createUser({
            username: username || usernameSlug,
            phone,
            lat,
            long,
            account_type,
          });
          return `User created with username ${username}`;
        } catch (error) {
          return `Failed to create user: ${error}`;
        }
      },
      updateUserAI: async ({}: {}) => {
        try {
          await userStore.updateUser({
            account_type: userStore.accountType,
            long: userStore.location?.[0]!,
            lat: userStore.location?.[1]!,
          });
          return `User updated`;
        } catch (error) {
          return `Failed to update user: ${error}`;
        }
      },
      createRequestAI: async ({
        name,
        description,
      }: {
        name: string;
        description: string;
      }) => {
        try {
          const images: string[] = [];
          await requestStore.createRequest({
            name,
            description,
            images,
            longitude: userStore.location?.[0]!,
            latitude: userStore.location?.[1]!,
          });
          return `Request created`;
        } catch (error) {
          return `Failed to create request: ${error}`;
        }
      },
      getRequestAI: async ({ id }: { id: string }) => {
        try {
          const request = await requestStore.getRequest(+id);
          return JSON.stringify(request);
        } catch (error) {
          return `Failed to get request: ${error}`;
        }
      },
      createStoreAI: async ({
        name,
        description,
      }: {
        name: string;
        description: string;
      }) => {
        try {
          const latitude = 0;
          const longitude = 0;
          const phone = "";

          const response = await storeStore.createStore({
            name,
            description,
            latitude,
            longitude,
            phone,
          });
          return `Store created with id ${response.id}`;
        } catch (error) {
          return `Failed to create store: ${error}`;
        }
      },
      toggleLocationAI: async ({ isEnabled }: { isEnabled: boolean }) => {
        try {
          await userStore.toggleEnableLocation(isEnabled);
          return `Location is now ${isEnabled ? "enabled" : "disabled"}`;
        } catch (e) {
          return `Failed to toggle location: ${e}`;
        }
      },
      fetchUserByIdAI: async ({ id }: { id: string }) => {
        try {
          const response = await userStore.fetchUserById(+id);
          return JSON.stringify(response);
        } catch (error) {
          return `Failed to fetch user: ${error}`;
        }
      },
    };

    this.toolsInfo = {
      createRequest:
        "Example: create a request with Gucci Bag(name), A nice bag(description)",
      getRequest: "Example: get request with id 1",
      createStore:
        "Example: create a store with Gucci Store(name), A nice store(description)",
      createUser:
        "Example: create a user with John Doe(username), 123456(phone), and buyer(account_type)",
      updateUser: "Example: update user with John Doe(username), 123456(phone)",
      toggleLocation: "Example: toggle location to true",
      fetchUserById: "Example: fetch user with id 1",
    };
  }

  private async executeAction(action: ToolCall) {
    const tool = this.tools[action.name];
    if (!tool) {
      return `Tool ${action.name} not found`;
    }
    return tool.bind(this)(action.args ? action.args : {});
  }

  public async solveTask(task: string): Promise<string[]> {
    // const action = (await callLLMApi({
    //   task,
    // })) as AiResponseType; // REAL one
    const action: AiResponseType = {
      content: "",
      tool_calls: [
        {
          name: "createUserAI",
          args: {
            username: "Good",
            account_type: "user",
          },
          type: "tool_call",
          id: 4,
        },
      ],
    };

    const results: string[] = [];

    if (action.tool_calls.length === 0 && action.content.trim() !== "") {
      results.push(action.content);
    }
    try {
      console.log(`Connecting to Solana`);
      await userStore.connectToSolana();
    } catch (error) {
      console.log(error);
    }
    for (const toolCall of action.tool_calls) {
      const result = await this.executeAction(toolCall);
      results.push(result);
    }

    return results;
  }
}

// USAGE

// const agent = new AIAgent();
// const data = "create a request with Gucci Bag(name), A nice bag(description)";
// const response = await agent.solveTask(data); // the ai response
// please find a way to get images for createRequestAI
// find a way to get the latitude and longitude when neccessary
