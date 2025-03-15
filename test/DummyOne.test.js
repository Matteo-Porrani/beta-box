
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { isNull } from "@/utils/core-utils";
import DummyOne from "@/components/DummyOne.vue";



describe("", () => {
	it('should ', () => {
		
		const test = isNull("abc");
		// expect(true).toBe(true);
		expect(test).toBe(false);
	
	});
	
})



describe("", () => {
	it('should ', () => {
		
		const wrapper = mount(DummyOne, {
			props: {
				count: 125,
			}
		});
		console.log(wrapper.html());
		

		// expect(test).toBe(false);
	
	});
	
})

