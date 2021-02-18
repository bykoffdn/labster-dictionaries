import { createApp } from "vue";
// UI library plugin
// @ts-ignore
import { darwinStudioUiPlugin } from "@darwin-studio/ui-vue";
// store
import store from "./store/index";
// root component
import App from "./App.vue";

const darwinUiPluginOptions = {
  resetStyles: true,
  googleFonts: [
    {
      family: "Montserrat"
    }
  ]
};

createApp(App)
  .use(darwinStudioUiPlugin, darwinUiPluginOptions)
  .use(store)
  .mount("#app");
