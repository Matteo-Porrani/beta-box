<template>
	<section
		data-test="ticket-detail-footer-root"
		class="grid grid-cols-4 items-center"
	>
		<div class="flex gap-2 items-center">
			<DetailIcon icon="sprint"/>
			<p class="text-xl font-bold">{{ sprints }}</p>
		</div>

		<div class="col-span-2 flex gap-2 items-center border border-stone-500 rounded p-1">
			<button
				@click="onCopy"
				class="text-stone-500 hover:text-sky-500"
			>
				<BxIcon icon="copy"/>
			</button>

			<div class="text-nowrap overflow-x-hidden overflow-ellipsis pe-4">
				<a
					:href="ticket.url"
					class="font-mono text-xs hover:text-violet-400 hover:underline"
					target="_blank"
				>{{ ticket.url }}</a>
			</div>
		</div>

		<div class="flex justify-end gap-2">
			<p>{{ activeBadge.name }}</p>
			<span
				class="size-6 rounded-full"
				:class="`bg-${activeBadge.color}-${activeBadge.shade}`"
			/>
		</div>
	</section>
</template>


<script>
import DetailIcon from "@/modules/project/components/detail/DetailIcon.vue";

export default {
	name: "TicketDetailFooter",
	components: {
		DetailIcon,
	},

	props: {
		ticket: Object
	},

	computed: {
		sprints() {
			return this.ticket.sprint ? this.ticket.sprint.map(s => s.name).join(" / ") : "-";
		},

		activeBadge() {
			return {
				name: this.ticket.active ? "active" : "inactive",
				color: this.ticket.active ? "lime" : "rose",
				shade: this.ticket.active ? "500" : "600",
			}
		}
	},

	methods: {
		async onCopy() {
			try {
				await navigator.clipboard.writeText(this.ticket.url);
				// copyBtn.value.classList.toggle("confirm-copy")
				// setTimeout(() => copyBtn.value.classList.toggle("confirm-copy"), 500)
			} catch(err) {
				console.error(err);
			}
		}

	}
}
</script>

