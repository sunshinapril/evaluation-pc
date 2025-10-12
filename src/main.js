import { createApp } from "vue";
 
// import "element-plus/dist/index.css";


import App from "./App.vue";
import router from "./router";
import "@pureadmin/table/dist/style.css";
import "animate.css";
import "./assets/styles/index.less";
import PureTable from "@pureadmin/table";
import { setupStore } from "@/store";
import { setupComponents } from "@/components";

const app = createApp(App);
app.use(PureTable, { locale: "zhCn" });

// 自定义指令
import * as directives from "./directives";
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});

app.use(router);
setupStore(app);
setupComponents(app);

app.mount("#app");
