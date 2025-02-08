<template>
  <div>
    <input
      @change="handleFileUpload"
      type="file"
      class="tw-w-full tw-px-3 tw-py-2 tw-border tw-text-black tw-rounded-l-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-[#28334e]"
    />
    <v-icon class="tw-w-5 tw-h-5 tw-animate-spin" v-if="isUploading">
      mdi-loading
    </v-icon>
  </div>
</template>

<script setup lang="ts">
import { useChatBot } from "@/pinia/chatbot";
const { progress, uploadFile } = useLightHouseUpload();
const chatBotStore = useChatBot();
const isUploading = ref(false);

const handleFileUpload = async (e: any) => {
  try {
    isUploading.value = true;
    const file = await uploadFile(e.target.files[0]);
    chatBotStore.uploadedImages = file;
  } catch (error) {
    console.log(error);
  } finally {
    isUploading.value = false;
  }
};
</script>
