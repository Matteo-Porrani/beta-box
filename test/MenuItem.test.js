import {describe, it, expect} from "vitest";
import {mount} from "@vue/test-utils";
import MenuItem from "@/components/UI/MenuItem.vue";
import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
	history: createWebHistory(),
	routes: []
});

describe('MenuItem Component', () => {
	const wrapper = mount(MenuItem, {
		props: {
			dest: "/hello",
			label: "Hello"
		},
		global: {
			plugins: [router]
		}
	});
	
	it('should render with correct props', () => {
		
		console.log(wrapper.html())
		
		expect(wrapper.props().dest).toBe('/hello');
		expect(wrapper.props().label).toBe('Hello');
		expect(wrapper.find('a').exists()).toBe(true);
		expect(wrapper.text()).toContain('Hello');
	});
});

