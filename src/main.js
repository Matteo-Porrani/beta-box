import "@/assets/css/main.css"

import { createApp } from 'vue'
import { registerModules } from "./register-modules";

import App from './App.vue'
import router from './router'
import store from './store/index.js'

// =============================================
// MODULES
import taskModule from "./modules/task" // this will import ./modules/task/index.js
// =============================================

/**
 * The new import syntax imports all exports from the moment module and assigns them to the 'moment' namespace
 * This matches the type expectations of the extendMoment function from moment-range
 */
import * as moment from "moment";
import { extendMoment } from "moment-range";

extendMoment(moment);
moment.locale("fr");

// Create the app instance
const app = createApp(App)

// Add global properties
app.config.globalProperties.moment = moment;

// Register modules
registerModules({
	task: taskModule,
});

// Install plugins
app.use(store)



app.use(router)

// Mount the app
app.mount('#app')
