import {createStore} from 'vuex'

import form from "./modules/store-form";
import list from "./modules/store-list";
import task from './modules/store-task';



export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        form,
        list,
        task,
    }
})
