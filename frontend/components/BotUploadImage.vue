<template>
  <div>
    <input
      v-show="!isUploading"
      @change="handleFileUpload"
      type="file"
      class="file:tw-mr-4 file:tw-rounded-full filetw-:border-0 file:tw-bg-violet-50
      file:tw-px-4 file:tw-py-2 file:tw-text-sm file:tw-font-semibold file:tw-text-black
      hover:file:tw-bg-violet-100"
    />
    <v-icon
      v-show="isUploading"
      class="tw-w-5 tw-h-5 tw-animate-spin" v-if="isUploading">
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
