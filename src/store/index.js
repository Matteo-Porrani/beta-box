import {createStore} from 'vuex'

import entity from "./modules/store-entity";
import form from "./modules/store-form";
import list from "./modules/store-list";



export default createStore({
    modules: {
        entity,
        form,
        list,
    }
})
