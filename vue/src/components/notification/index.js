import Notification from "./Notification.vue";

export const Notify = {
  install(app, options) {
    app.component("Notification", Notification);

    app.config.globalProperties.$notify = (message) => {};
  },
};
