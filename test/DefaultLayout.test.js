import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";


function factory({ $p }) {
	
	return shallowMount(DefaultLayout, {
		props: {
			...$p
		}
	})
	
}


describe('Renders elements of layout according to props', () => {
	let wrapper;
	
	it('renders root element', () => {
		const $p = { viewTitle: "Hello" };
	
		wrapper = factory({ $p });
		const findEl = wrapper.find("[data-test='default-layout-root']");
		expect(findEl.exists()).toBe(true);
	});
	
	it('renders view title with proper content', () => {
		const $p = { viewTitle: "Hello" };
	
		wrapper = factory({ $p });
		const findEl = wrapper.find("[data-test='view-title']");
		expect(findEl.exists()).toBe(true);
		expect(findEl.text()).toBe($p.viewTitle);
	});
	
	it("does NOT render view title if 'viewTitle' prop is not passed", () => {
		const $p = { };
	
		wrapper = factory({ $p });
		const findEl = wrapper.find("[data-test='view-title']");
		expect(findEl.exists()).toBe(false);
	});
	
	it("renders breadcrumb wrapper if 'hasBreadcrumb' prop is true", () => {
		const $p = { hasBreadcrumb: true };
	
		wrapper = factory({ $p });
		const findEl = wrapper.find("[data-test='breadcrumb-wrapper']");
		expect(findEl.exists()).toBe(true);
	});
	
});

