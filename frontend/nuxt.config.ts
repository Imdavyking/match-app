// https://nuxt.com/docs/api/configuration/nuxt-config
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@invictus.codes/nuxt-vuetify",
    "@vueuse/nuxt",
  ],
  build: {
    transpile: ["vue-sonner"],
  },
  css: ["~/assets/css/solana.css"],
  vite: {
    esbuild: {
      target: "esnext",
    },
    plugins: [nodePolyfills()],
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    define: {
      "process.env.BROWSER": true,
      "process.browser": true,
    },
    resolve: {
      alias: {
        crypto: "crypto-browserify",
      },
    },
  },
  ssr: false,
  runtimeConfig: {
    public: {
      appName: "Match",
      appContactEmail:
        process.env.MATCH_CONTACT_EMAIL || "kingsmen.hackers@gmail.com",
      lightHouseApiKey: process.env.LIGHTHOUSE_API_KEY,
      contractId: process.env.CONTRACT_ID,
      chainId: process.env.CHAIN_ID,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      solanaRpcUrl: process.env.SOLANA_RPC_URL,
      solanaChainId: process.env.SOLANA_CHAIN_ID,
      solMint: process.env.SOL_MINT,
      pyUsdMint: process.env.PY_USD_MINT,
      timeTillLock: process.env.TIME_TILL_LOCK,
      serverUrl: process.env.SERVER_URL,
    },
  },
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // @TODO: list all vuetify options
    },
  },
});
