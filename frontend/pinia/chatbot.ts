import { defineStore } from "pinia";
import { useRequestsStore } from "@/pinia/request";
import { useUserStore } from "@/pinia/user";
import { useStoreStore } from "@/pinia/store";
import { AiResponseType, ToolCall } from "../types";
import { callLLMApi } from "../services/llm.services";

type BotStore = {
  addImages: boolean;
  toolsInfo: { [key: string]: string };
  uploadedImages: string | null;
};

const STORE_KEY = "@chatBotStore";

export const useChatBot = defineStore(STORE_KEY, {
  state: (): BotStore => ({
    addImages: false,
    uploadedImages: null,
    toolsInfo: {
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
    },
  }),
  getters: {},
  actions: {
    async solveTask(task: string): Promise<string[]> {
      const userStore = useUserStore();
      const action: AiResponseType = await callLLMApi({
        task,
      });

      const results: string[] = [];

      if (action.tool_calls.length === 0 && action.content.trim() !== "") {
        results.push(action.content);
      }
      try {
        await userStore.connectToSolana();
      } catch (error) {
        console.log(error);
      }
      for (const toolCall of action.tool_calls) {
        const result = await this.executeAction(toolCall);
        results.push(result);
      }

      return results;
    },
    async executeAction(action: ToolCall) {
      try {
        const tools: Record<string, any> = {
          createRequest: this.createRequest,
          getRequest: this.getRequest,
          createStore: this.createStore,
          updateUser: this.updateUser,
          toggleLocation: this.toggleLocation,
          fetchUserById: this.fetchUserById,
        };

        const tool = tools[action.name];

        if (!tool) {
          return `Tool ${action.name} not found`;
        }
        return tool.bind(this)(action.args ? action.args : {});
      } catch (error) {
        console.log(error);
      }
    },
    async updateUser({}: {}) {
      const userStore = useUserStore();
      try {
        userStore.username;
        await userStore.updateUser({
          account_type: userStore.accountType,
          long: userStore.location?.[0]!,
          lat: userStore.location?.[1]!,
        });
        return `User updated`;
      } catch (error) {
        return `Failed to update user with username ${userStore.username}`;
      }
    },
    async createRequest({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) {
      const requestStore = useRequestsStore();
      const userStore = useUserStore();
      try {
        this.uploadedImages = null;
        this.addImages = true;

        // Wait for the user to upload images
        while (this.uploadedImages === null) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        const images: string[] = [this.uploadedImages!];

        console.log(images);
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
      } finally {
        this.addImages = false;
      }
    },
    async getRequest({ id }: { id: string }) {
      const requestStore = useRequestsStore();
      try {
        const request = await requestStore.getRequest(+id);
        return JSON.stringify(request);
      } catch (error) {
        return `Failed to get request: ${id}`;
      }
    },
    async createStore({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) {
      const storeStore = useStoreStore();
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
        return `Failed to create store with name ${name}`;
      }
    },
    async toggleLocation({ isEnabled }: { isEnabled: boolean }) {
      const userStore = useUserStore();
      try {
        await userStore.toggleEnableLocation(isEnabled);
        return `Location is now ${isEnabled ? "enabled" : "disabled"}`;
      } catch (e) {
        return `Failed to toggle location to ${isEnabled}`;
      }
    },
    async fetchUserById({ id }: { id: string }) {
      const userStore = useUserStore();
      try {
        const response = await userStore.fetchUserById(+id);
        return JSON.stringify(response);
      } catch (error) {
        return `Failed to fetch user with id ${id}`;
      }
    },
  },
});
