import { defineStore } from "pinia";

export const useMessageStore = defineStore("message", {
  state: () => ({
    showMessage: false,
    messageType: "",
    messageText: "",
  }),
});
