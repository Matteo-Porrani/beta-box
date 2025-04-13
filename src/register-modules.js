import router from "./router";
import store from "./store";

const registerModule = (name, module) => {
	if (module.store) {
		store.registerModule(name, module.store);
	}
	
	if (module.router) {
		module.router(router);
	}
};

export function registerModules(modules) {
	Object.keys(modules).forEach(key => {
		
		console.log("...registering", key)
		
		const module = modules[key];
		registerModule(key, module);
	});
}

