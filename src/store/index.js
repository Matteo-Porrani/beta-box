import {createStore} from 'vuex'

import entity from "./modules/store-entity";
import form from "./modules/store-form";
import list from "./modules/store-list";
import task from './modules/store-task';



export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        entity,
        form,
        list,
        task,
    }
})
