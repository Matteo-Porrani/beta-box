import {createStore} from 'vuex'

import form from "./modules/store-form";
import task from './modules/store-task'


export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        form,
        task,
    }
})
