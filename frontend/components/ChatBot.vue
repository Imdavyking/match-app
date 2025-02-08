<template>
  <div>
    <div class="fixed bottom-24 right-0 mb-4 mr-10">
      <button
        @click="toggleChatbox"
        class="bg-[#28334e] text-white py-2 px-4 rounded-full hover:bg-[#28334e] transition duration-300 flex items-center h-12 cursor-pointer"
      >
        Perform action with AI Agent
      </button>
    </div>

    <div v-if="isChatboxOpen" class="fixed bottom-24 right-4 w-96 z-50">
      <div class="bg-white shadow-md rounded-lg max-w-lg w-full relative">
        <div
          v-if="messages.length === 0"
          class="bg-gray-100 rounded-lg p-4 absolute top-20 left-1/2 transform -translate-x-1/2 w-10/12"
        >
          <h3 class="text-lg font-semibold text-gray-700">Commands</h3>
          <ul class="list-disc ml-5 mt-2 text-gray-600">
            <li v-for="(desc, key) in agent.toolsInfo" :key="key">
              <strong>{{ key }}:</strong> {{ desc }}.
            </li>
          </ul>
        </div>

        <div
          class="p-4 border-b bg-[#28334e] text-white rounded-t-lg flex justify-between items-center"
        >
          <p class="text-lg font-semibold">AI Agent</p>
          <button
            @click="toggleChatbox"
            class="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
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

        <div class="p-4 h-80 overflow-y-auto">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="{ 'text-right': message.sender === 'user' }"
            class="mb-2"
          >
            <p
              :class="
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              "
              class="rounded-lg py-2 px-4 inline-block"
            >
              {{ message.text }}
            </p>
          </div>
        </div>

        <div class="p-4 border-t flex">
          <input
            v-model="userInput"
            @keypress.enter="handleSend"
            type="text"
            placeholder="Type a message"
            class="w-full px-3 py-2 border text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#28334e]"
          />
          <button
            @click="handleSend"
            class="bg-[#28334e] text-white px-4 py-2 rounded-r-md hover:bg-[#28334e] transition duration-300"
          >
            <div v-if="isProcessing" class="w-5 h-5 animate-spin">loading</div>
            <span v-else>Send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { AIAgent } from "../agent/index";
import { toast } from "vue-sonner";

export default {
  components: {},
  setup() {
    const isChatboxOpen = ref(true);
    const agent = new AIAgent();
    const messages = ref([]);
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
          const response = await agent.solveTask(data);
          respondToUser(response);
        } catch (error) {
          toast.error(`Failed to perform action ${error.message}`);
        } finally {
          isProcessing.value = false;
        }
      }
    };

    const respondToUser = (response) => {
      setTimeout(() => {
        response.forEach((res) => {
          messages.value.push({ text: res, sender: "bot" });
        });
      }, 500);
    };

    return {
      isChatboxOpen,
      agent,
      messages,
      userInput,
      isProcessing,
      toggleChatbox,
      handleSend,
    };
  },
};
</script>

<style></style>
