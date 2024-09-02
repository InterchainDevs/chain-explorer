import "./assets/main.css";
// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import VueApexCharts from "vue3-apexcharts";

import "animate.css";

// Fix bigint issue
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
  },
});

app.use(createPinia());

app.use(router);
app.use(vuetify);
app.use(VueApexCharts);

// await router.isReady();
app.mount("#app");
