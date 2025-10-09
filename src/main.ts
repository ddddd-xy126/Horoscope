// 正确的完整代码
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import "./assets/styles/global.scss";

const app = createApp(App);

// 使用 Element Plus
app.use(ElementPlus);

app.mount("#app");
