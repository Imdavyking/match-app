import { defineStore } from "pinia";
import { STORE_KEY } from "@/types";

type BotStore = {
  addImages: boolean;
};

export const useChatBot = defineStore(STORE_KEY, {
  state: (): BotStore => ({
    addImages: true,
  }),
  getters: {},
  actions: {},
});
