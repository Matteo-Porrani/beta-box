import {createStore} from 'vuex'

import entity from "./modules/store-entity";
import form from "./modules/store-form";
import list from "./modules/store-list";
import notif from "./modules/store-notif";



export default createStore({
    modules: {
        entity,
        form,
        list,
        notif,
    },
    
    state: {
        APP_VERSION: "0.3.5",
    }
})
