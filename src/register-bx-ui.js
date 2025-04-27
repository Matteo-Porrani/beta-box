
const GLOBALS = [
	"BxButton",
	"BxIconButton",
]

const COMPONENTS = {}

for (const c of GLOBALS) {
	console.log("c", c)
	COMPONENTS[c] = await import(`@/modules/ui/components/${c}.vue`)
}

console.log("COMPONENTS", COMPONENTS)

export function registerBxUi(app) {
	
	for (const key of Object.keys(COMPONENTS)) {
		app.component(key, COMPONENTS[key]);
		console.log(key, "...registered")
	}
}


