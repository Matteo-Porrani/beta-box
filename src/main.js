import { createApp } from 'vue'
import { registerModules } from "./register-modules";

import "@/assets/css/main.css"


import App from './App.vue'
import router from './router'
import store from './store/index.js'

/* modules */
import taskModule from "./modules/task"

/**
 * The new import syntax imports all exports from the moment module and assigns them to the 'moment' namespace
 * This matches the type expectations of the extendMoment function from moment-range
 */
import * as moment from "moment";
import { extendMoment } from "moment-range";

extendMoment(moment);
moment.locale("fr");

registerModules({
	task: taskModule,
});

const app = createApp(App)
app.config.globalProperties.moment = moment;


app.use(store).use(router).mount('#app')
