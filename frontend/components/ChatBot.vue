<template>
  <div>
    <div class="tw-fixed tw-bottom-24 tw-right-0 tw-mb-4 tw-mr-10">
      <button
        @click="toggleChatbox"
        class="tw-bg-[#28334e] tw-text-white tw-py-2 tw-px-4 tw-rounded-full hover:tw-bg-[#28334e] tw-transition tw-duration-300 tw-flex tw-items-center tw-h-12 tw-cursor-pointer"
      >
        Perform action with AI Agent
      </button>
    </div>

    <div
      v-if="isChatboxOpen"
      class="tw-fixed tw-bottom-24 tw-right-4 tw-w-96 tw-z-50"
    >
      <div
        class="tw-bg-white tw-shadow-md tw-rounded-lg tw-max-w-lg tw-w-full tw-relative"
      >
        <div
          v-if="messages.length === 0"
          class="tw-bg-gray-100 tw-rounded-lg tw-p-4 tw-absolute tw-top-20 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-w-10/12 tw-max-h-40 tw-overflow-y-auto"
        >
          <h3 class="tw-text-lg tw-font-semibold tw-text-gray-700">Commands</h3>
          <ul class="tw-list-disc tw-ml-5 tw-mt-2 tw-text-gray-600">
            <li v-for="(desc, key) in chatBotStore.toolsInfo" :key="key">
              <strong>{{ key }}:</strong> {{ desc }}.
            </li>
          </ul>
        </div>

        <div
          class="tw-p-4 tw-border-b tw-bg-[#28334e] tw-text-white tw-rounded-t-lg tw-flex tw-justify-between tw-items-center"
        >
          <p class="tw-text-lg tw-font-semibold">AI Agent</p>
          <button
            @click="toggleChatbox"
            class="tw-text-gray-300 hover:tw-text-gray-400 focus:tw-outline-none focus:tw-text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="tw-w-6 tw-h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="tw-p-4 tw-h-80 tw-overflow-y-auto">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="{ 'tw-text-right': message.sender === 'user' }"
            class="tw-mb-2"
          >
            <p
              :class="
                message.sender === 'user'
                  ? 'tw-bg-blue-500 tw-text-white'
                  : 'tw-bg-gray-200 tw-text-gray-700'
              "
              class="tw-rounded-lg tw-py-2 tw-px-4 tw-inline-block"
            >
              {{ message.text }}
            </p>
          </div>
        </div>

        <BotUploadImage v-if="chatBotStore.addImages" class="tw-mx-8 tw-mb-3" />

        <div class="tw-p-4 tw-border-t tw-flex">
          <input
            v-model="userInput"
            @keypress.enter="handleSend"
            type="text"
            placeholder="Type a message"
            class="tw-w-full tw-px-3 tw-py-2 tw-border tw-text-black tw-rounded-l-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#28334e]"
          />
          <button
            @click="handleSend"
            class="tw-bg-[#28334e] tw-text-white tw-px-4 tw-py-2 tw-rounded-r-md hover:tw-bg-[#28334e] tw-transition tw-duration-300"
          >
            <v-icon v-if="isProcessing" class="tw-w-5 tw-h-5 tw-animate-spin">
              mdi-loading
            </v-icon>
            <span v-else>Send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { AIAgent } from "@/agent/index";
import { toast } from "vue-sonner";
import { useChatBot } from "@/pinia/chatbot";
import BotUploadImage from "@/components/BotUploadImage.vue";

const chatBotStore = useChatBot();

const isChatboxOpen = ref(true);

const messages = ref<
  {
    text: string;
    sender: "user" | "bot";
  }[]
>([]);

// { text: res, sender: "bot" }
const userInput = ref("");
const isProcessing = ref(false);

const toggleChatbox = () => {
  isChatboxOpen.value = !isChatboxOpen.value;
};

const handleSend = async () => {
  if (userInput.value.trim() !== "") {
    messages.value.push({ text: userInput.value, sender: "user" });
    const data = userInput.value;
    userInput.value = "";
    try {
      isProcessing.value = true;
      const response = await chatBotStore.solveTask(data);
      respondToUser(response);
    } catch (error: any) {
      toast.error(`Failed to perform action ${error.message}`);
    } finally {
      isProcessing.value = false;
    }
  }
};

const respondToUser = (response: string[]) => {
  setTimeout(() => {
    response.forEach((res) => {
      messages.value.push({ text: res, sender: "bot" });
    });
  }, 500);
};
</script>

<style></style>
