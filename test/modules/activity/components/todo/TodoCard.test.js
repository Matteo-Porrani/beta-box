/**
 * TESTING VUE SINGLE FILE COMPONENTS (SFC) - Key Concepts & Patterns
 *
 * This test suite demonstrates comprehensive testing patterns for Vue SFCs:
 *
 * 1. ISOLATION: Mock external dependencies (components, constants, APIs)
 * 2. FACTORY PATTERN: Use factory functions for consistent component creation
 * 3. LIFECYCLE: Test component mounting, updating, and unmounting behaviors
 * 4. REACTIVITY: Test Vue's reactive system using nextTick() for DOM updates
 * 5. INTERACTION: Test user events (clicks, keyboard, drag & drop)
 * 6. COMMUNICATION: Test component events and prop passing
 * 7. STATE MANAGEMENT: Test internal reactive state and computed properties
 * 8. DOM RENDERING: Test conditional rendering and class/style bindings
 * 9. CLEANUP: Proper wrapper unmounting to prevent memory leaks
 *
 * Key Vue Test Utils concepts used:
 * - mount(): Creates a wrapper with full rendering
 * - wrapper.find(): Query DOM elements with CSS selectors
 * - wrapper.findComponent(): Query child Vue components
 * - wrapper.vm: Access component instance (props, data, methods, computed)
 * - wrapper.emitted(): Track emitted events for parent-child communication
 * - wrapper.trigger(): Simulate user interactions
 * - nextTick(): Wait for Vue's reactivity system to update DOM
 */

// Testing Vue SFC (Single File Components) requires specific setup and patterns
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils' // Vue Test Utils provides the mount function for testing Vue components
import { nextTick } from 'vue' // nextTick is essential for testing reactive updates and DOM changes
import TodoCard from '@/modules/activity/components/todo/TodoCard.vue'

// Mock the ColorSelector component to avoid complex child component dependencies
// This isolates the TodoCard component and prevents external dependencies from affecting tests
vi.mock('@/modules/activity/components/todo/ColorSelector.vue', () => ({
	default: {
		name: 'ColorSelector',
		template: '<div class="color-selector">ColorSelector Mock</div>',
		props: ['todo', 'visible'],
		emits: ['update', 'delete', 'copy', 'close']
	}
}))

// Mock external constants to control test environment and avoid file system dependencies
// This ensures tests are predictable and don't rely on external configuration
vi.mock('@/modules/activity/const/activity-const', () => ({
	ACTIVITY_COLOR_MAP: {
		'$R': 'bg-red-500',
		'$G': 'bg-green-500',
		'$B': 'bg-blue-500',
		'$Y': 'bg-yellow-500',
		'$D': 'bg-stone-700'
	}
}))

describe('TodoCard.vue', () => {
	let wrapper

	const mockTodo = {
		id: 1,
		desc: 'Test todo description',
		color: '$D',
		starred: false,
		done: false
	}

	const mockPosition = {
		row: 0,
		column: 1
	}

	// Factory function pattern: creates consistent component instances with customizable props
	// This reduces test duplication and provides a consistent baseline for testing
	function factory(props = {}) {
		const defaultProps = {
			todo: mockTodo,
			position: mockPosition,
			textSize: 1,
			...props // Allows overriding defaults for specific tests
		}

		return mount(TodoCard, {
			props: defaultProps,
			global: {
				stubs: {
					// Stub child components to isolate the component under test
					ColorSelector: true
				}
			}
		})
	}

	// Cleanup between tests to prevent memory leaks and test interference
	// Vue Test Utils wrappers should always be unmounted after use
	beforeEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	describe('Component Props', () => {
		it('renders with required props', () => {
			wrapper = factory()
			expect(wrapper.exists()).toBe(true)
		})

		it('uses default values for optional props', () => {
			// Testing default prop values requires mounting WITHOUT the factory
			// to avoid the factory's default prop assignments
			wrapper = mount(TodoCard, {
				props: {
					todo: mockTodo
					// position and textSize should use defaults
				},
				global: {
					stubs: {
						ColorSelector: true
					}
				}
			})

			// wrapper.vm provides access to the component's internal state and computed properties
			expect(wrapper.vm.position).toEqual({ row: null, column: null })
			expect(wrapper.vm.textSize).toBe(1)
		})

		it('accepts custom position and textSize props', () => {
			const customPosition = { row: 2, column: 3 }
			wrapper = factory({
				position: customPosition,
				textSize: 2
			})

			expect(wrapper.vm.position).toEqual(customPosition)
			expect(wrapper.vm.textSize).toBe(2)
		})
	})

	// Testing computed properties: Vue's reactivity system automatically updates computed values
	// We test these by checking wrapper.vm.computedPropertyName
	describe('Text Size Classes', () => {
		it('applies text-lg font-semibold for starred todos', () => {
			const starredTodo = { ...mockTodo, starred: true }
			wrapper = factory({ todo: starredTodo, textSize: 1 })

			// Testing computed properties via wrapper.vm gives direct access to component logic
			expect(wrapper.vm.textSizeClasses).toBe('text-lg font-semibold')
			expect(wrapper.vm.editTextSizeClasses).toBe('text-lg font-semibold text-white')
		})

		it('applies text-xs for non-starred todos when textSize is 1', () => {
			wrapper = factory({ textSize: 1 })

			expect(wrapper.vm.textSizeClasses).toBe('text-xs text-stone-800')
			expect(wrapper.vm.editTextSizeClasses).toBe('text-xs text-stone-800')
		})

		it('applies text-sm for non-starred todos when textSize is 2', () => {
			wrapper = factory({ textSize: 2 })

			expect(wrapper.vm.textSizeClasses).toBe('text-sm text-stone-800')
			expect(wrapper.vm.editTextSizeClasses).toBe('text-sm text-stone-800')
		})

		it('handles different textSize values correctly', () => {
			wrapper = factory({ textSize: 1 })
			expect(wrapper.vm.textSizeClasses).toBe('text-xs text-stone-800')

			wrapper = factory({ textSize: 2 })
			expect(wrapper.vm.textSizeClasses).toBe('text-sm text-stone-800')
		})
	})

	describe('Card Classes', () => {
		it('applies transparent background for starred todos', () => {
			const starredTodo = { ...mockTodo, starred: true }
			wrapper = factory({ todo: starredTodo })

			const classes = wrapper.vm.cardClasses
			expect(classes).toContain('bg-transparent')
			expect(classes).not.toContain('hover:border-stone-500')
		})

		it('applies color-based background for regular todos', () => {
			wrapper = factory()

			const classes = wrapper.vm.cardClasses
			expect(classes).toContain('hover:border-stone-500')
			expect(classes).toContain('bg-stone-700')
		})

		it('applies green background and line-through for completed todos', () => {
			const completedTodo = { ...mockTodo, done: true }
			wrapper = factory({ todo: completedTodo })

			const classes = wrapper.vm.cardClasses
			expect(classes).toContain('bg-green-500 line-through')
		})

		it('applies color-specific background classes', () => {
			const redTodo = { ...mockTodo, color: '$R' }
			wrapper = factory({ todo: redTodo })

			const classes = wrapper.vm.cardClasses
			expect(classes).toContain('bg-red-500')
		})
	})

	// Testing DOM rendering: wrapper.find() lets us query the rendered DOM
	// This verifies that the component's template renders correctly based on state
	describe('Text Display', () => {
		it('displays todo description in paragraph when not editing', () => {
			wrapper = factory()

			// wrapper.find() uses CSS selectors to locate elements in the rendered DOM
			const paragraph = wrapper.find('p')
			expect(paragraph.exists()).toBe(true)
			expect(paragraph.text()).toBe(mockTodo.desc)

			// Testing conditional rendering: verify elements that should NOT be present
			const textarea = wrapper.find('textarea')
			expect(textarea.exists()).toBe(false)
		})

		it('applies correct text size classes to paragraph', () => {
			wrapper = factory({ textSize: 1 })

			const paragraph = wrapper.find('p')
			expect(paragraph.classes()).toContain('text-xs')
			expect(paragraph.classes()).toContain('text-stone-800')
		})
	})

	describe('Editing Functionality', () => {
		it('switches to edit mode when paragraph is double-clicked', async () => {
			wrapper = factory()

			// Testing user interactions: trigger() simulates DOM events
			const paragraph = wrapper.find('p')
			await paragraph.trigger('dblclick')

			// Check reactive state changes immediately after event
			expect(wrapper.vm.isEditing).toBe(true)

			// nextTick() waits for Vue's reactivity system to update the DOM
			// Essential when testing DOM changes that happen after state updates
			await nextTick()

			// Verify DOM has re-rendered with new elements
			const textarea = wrapper.find('textarea')
			expect(textarea.exists()).toBe(true)
			expect(textarea.element.value).toBe(mockTodo.desc) // Access native DOM element properties

			// Verify conditional rendering: original element should be gone
			const paragraphAfter = wrapper.find('p')
			expect(paragraphAfter.exists()).toBe(false)
		})

		it('applies correct text size classes to textarea in edit mode', async () => {
			wrapper = factory({ textSize: 2 })

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const textarea = wrapper.find('textarea')
			expect(textarea.classes()).toContain('text-sm')
			expect(textarea.classes()).toContain('text-stone-800')
		})

		it('emits update event when saving changes', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			// Testing form interactions: setValue() and trigger() for form elements
			const textarea = wrapper.find('textarea')
			await textarea.setValue('Updated todo description')
			await textarea.trigger('blur') // Simulate losing focus

			// Testing component events: wrapper.emitted() captures all emitted events
			// This is crucial for testing parent-child communication in Vue
			const updateEvents = wrapper.emitted('update')
			expect(updateEvents).toHaveLength(1)
			expect(updateEvents[0][0]).toEqual({ // First event, first argument
				...mockTodo,
				desc: 'Updated todo description'
			})
		})

		it('does not emit update event if text unchanged', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const textarea = wrapper.find('textarea')
			await textarea.trigger('blur')

			const updateEvents = wrapper.emitted('update')
			expect(updateEvents).toBeFalsy()
		})

		it('saves edit when Tab key is pressed', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const textarea = wrapper.find('textarea')
			await textarea.setValue('Tab saved todo')
			await textarea.trigger('keydown', { key: 'Tab' })

			const updateEvents = wrapper.emitted('update')
			expect(updateEvents).toHaveLength(1)
			expect(updateEvents[0][0].desc).toBe('Tab saved todo')
			expect(wrapper.vm.isEditing).toBe(false)
		})

		it('allows Enter key for new lines in textarea', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const textarea = wrapper.find('textarea')
			const keydownEvent = vi.fn()
			textarea.element.addEventListener('keydown', keydownEvent)

			await textarea.trigger('keydown', { key: 'Enter' })

			// Should not prevent default behavior for Enter
			expect(wrapper.vm.isEditing).toBe(true)
		})
	})

	describe('Drag and Drop', () => {
		it('is draggable when not editing', () => {
			wrapper = factory()

			const cardElement = wrapper.find('[draggable]')
			expect(cardElement.exists()).toBe(true)
			expect(cardElement.attributes('draggable')).toBe('true')
		})

		it('is not draggable when editing', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const cardElement = wrapper.find('[draggable]')
			expect(cardElement.attributes('draggable')).toBe('false')
		})

		it('sets drag data on dragstart', () => {
			wrapper = factory()

			// Testing complex browser APIs: mock the DataTransfer interface
			// since it's not available in the test environment
			const mockDataTransfer = {
				setData: vi.fn(), // Vitest mock functions to track calls
				effectAllowed: null
			}

			const dragEvent = {
				dataTransfer: mockDataTransfer,
				preventDefault: vi.fn()
			}

			// Testing component methods directly via wrapper.vm
			wrapper.vm.handleDragStart(dragEvent)

			// Verify the method calls were made with correct parameters
			expect(mockDataTransfer.setData).toHaveBeenCalledWith('text/plain', '1')
			expect(mockDataTransfer.effectAllowed).toBe('move')
			expect(dragEvent.preventDefault).not.toHaveBeenCalled()
		})

		it('prevents drag when editing', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const mockDataTransfer = {
				setData: vi.fn(),
				effectAllowed: null
			}

			const dragEvent = {
				dataTransfer: mockDataTransfer,
				preventDefault: vi.fn()
			}

			wrapper.vm.handleDragStart(dragEvent)

			expect(dragEvent.preventDefault).toHaveBeenCalled()
			expect(mockDataTransfer.setData).not.toHaveBeenCalled()
		})
	})

	describe('Color Selector', () => {
		it('shows three dots menu button', () => {
			wrapper = factory()

			const menuButton = wrapper.find('button')
			expect(menuButton.exists()).toBe(true)
			expect(menuButton.text()).toBe('⋯')
		})

		it('toggles color selector when menu button is clicked', async () => {
			wrapper = factory()

			expect(wrapper.vm.showColorSelector).toBe(false)

			const menuButton = wrapper.find('button')
			await menuButton.trigger('click')

			expect(wrapper.vm.showColorSelector).toBe(true)

			await menuButton.trigger('click')
			expect(wrapper.vm.showColorSelector).toBe(false)
		})

		it('renders ColorSelector when visible', async () => {
			wrapper = factory()

			await wrapper.find('button').trigger('click')
			await nextTick()

			// Testing child component rendering: findComponent() locates Vue components
			// Use this instead of find() when looking for Vue components vs DOM elements
			const colorSelector = wrapper.findComponent({ name: 'ColorSelector' })
			expect(colorSelector.exists()).toBe(true)
		})
	})

	describe('Event Emissions', () => {
		it('emits update event through handleTodoUpdate', () => {
			wrapper = factory()

			const updatedTodo = { ...mockTodo, desc: 'Updated' }
			wrapper.vm.handleTodoUpdate(updatedTodo)

			const updateEvents = wrapper.emitted('update')
			expect(updateEvents).toHaveLength(1)
			expect(updateEvents[0][0]).toEqual(updatedTodo)
		})

		it('emits delete event through handleTodoDelete', () => {
			wrapper = factory()

			wrapper.vm.handleTodoDelete()

			const deleteEvents = wrapper.emitted('delete')
			expect(deleteEvents).toHaveLength(1)
			expect(deleteEvents[0][0]).toBe(mockTodo.id)
		})

		it('emits copy event through handleTodoCopy', () => {
			wrapper = factory()

			wrapper.vm.handleTodoCopy()

			const copyEvents = wrapper.emitted('copy')
			expect(copyEvents).toHaveLength(1)
			expect(copyEvents[0][0]).toBe(mockTodo.id)
		})
	})

	describe('Cursor Styling', () => {
		it('shows move cursor when not editing', () => {
			wrapper = factory()

			const cardElement = wrapper.find('.cursor-move')
			expect(cardElement.exists()).toBe(true)
		})

		it('shows text cursor when editing', async () => {
			wrapper = factory()

			await wrapper.find('p').trigger('dblclick')
			await nextTick()

			const cardElement = wrapper.find('.cursor-text')
			expect(cardElement.exists()).toBe(true)
		})
	})

	describe('Click Outside Handling', () => {
		it('sets up click outside listener on mount', () => {
			// Testing lifecycle hooks: spy on global APIs to verify component behavior
			// This ensures the component properly sets up and tears down event listeners
			const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

			wrapper = factory()

			// Verify that onMounted lifecycle hook executed correctly
			expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
		})

		it('removes click outside listener on unmount', () => {
			const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

			wrapper = factory()
			const clickHandler = wrapper.vm.handleClickOutside
			wrapper.unmount()

			expect(removeEventListenerSpy).toHaveBeenCalledWith('click', clickHandler)
		})
	})
})