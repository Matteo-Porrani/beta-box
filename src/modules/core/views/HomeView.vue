<template>
	<DefaultLayout>
		<div class="grid place-content-center py-8">

			<div
				v-if="needsInitialization"
				class="bg-stone-800 border border-stone-500 rounded-lg p-8 max-w-lg mx-auto my-10 text-center shadow-xl">
				<div class="w-20 h-20 mx-auto mb-6">
					<img src="@/assets/robot-init.svg" alt="Robot initialization icon" class="w-full h-full" />
				</div>
				<h2 class="text-yellow-400 text-xl font-semibold mb-3">App Initialization Required</h2>
				<p class="text-stone-400 mb-6">This application needs to be initialized before you can start using it.</p>
				<button 
					class="bg-yellow-400 text-stone-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
					@click="initializeApp"
				>
					Initialize App
				</button>
			</div>

			<div
				v-else
				class="flex flex-col items-center"
			>
				<img
					src="@/assets/images/smiling-robot.svg"
					alt="Friendly Robot"
					class="size-56 rounded-full object-cover border border-stone-500"
				/>
				<h1 class="text-4xl font-bold mt-6">Welcome to BetaBox !</h1>
			</div>


			<div>
				<BxButton
					label="Test 1"
					@click="multiPagePDF"
				/>
			</div>

		</div>
	</DefaultLayout>
</template>

<script>
import { mapState } from "vuex";
import DefaultLayout from "@/modules/core/components/layout/DefaultLayout.vue";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default {
	name: 'HomeView',

	components: {
		DefaultLayout,
	},

	data() {
		return {
			needsInitialization: false
		}
	},

	computed: {
		...mapState({
			tasks: state => state.task.tasks,
		})
	},

	async mounted() {
		await this.checkIfDatabaseExists()
	},

	methods: {
		async checkIfDatabaseExists() {
			const dbName = 'betaBoxDatabase'; // Replace with your database name

			await indexedDB.databases().then(databases => {
				const exists = databases.some(db => db.name === dbName);
				console.log(`Database "${dbName}" ${exists ? 'exists' : 'does not exist'}`);
				this.needsInitialization = !exists;
			}).catch(error => {
				console.error('Error checking databases:', error);
			});
		},

		initializeApp() {
			this.$router.push("/data-manager");
		},

		testPDF() {

			const LONG_TEXT = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam ea eius fuga nobis porro rerum! Atque aut distinctio itaque laboriosam nostrum. Expedita, ipsam neque odio pariatur quam quisquam sequi. Quia. Aliquid animi commodi culpa enim error esse et inventore, ipsum modi mollitia nesciunt nobis obcaecati officia omnis perferendis possimus quis quisquam quo, quos rem sequi similique sit ut, veniam vero!";


			// Create a new PDF document
			const doc = new jsPDF({
				orientation: "landscape",  // Landscape mode
				unit: "mm",                // Default unit (millimeters)
				format: "a4"               // A4 size (can be "letter", "a5", etc.)
			});

			// Add text to the PDF: (text, x-coordinate, y-coordinate)
			// doc.text("Hello, this is a simple PDF with text only.", 10, 10);

			doc.setFont("courier", "bold");

			// doc.text("This is italic Times.", 10, 10);
			doc.text("This is italic Times.", 5, 20); // x, y

			doc.setFont("courier", "normal");
			doc.setFontSize(18);

			let t = "";
			for (let i = 1; i < 20; i++) {
				t += LONG_TEXT + "\n";
			}

			doc.text(t, 5, 30, {
				maxWidth: 250 // specify max width in mm
			});

			// doc.text("Table Example", 10, 10);

			autoTable(doc, {
				head: [['ID', 'Name', 'Email']],
				body: [
					[1, 'Alice', 'alice@example.com\nLine2\nLine3'],
					[2, 'Bob', 'bob@example.com'],
					[3, 'Charlie', 'charlie@example.com']
				],
				startY: 80,
				styles: {
					font: 'courier',   // Set font to courier
					fontSize: 10,
					textColor: 0,         // Black text
					lineColor: 0,         // Black border
					lineWidth: 0.1,        // Thin border lines
					cellWidth: 'wrap'   // 👈 Enable wrapping
				},
				headStyles: {
					fillColor: [210, 210, 210],  // Grey background
					textColor: 0,                // Black text
					lineColor: 0,
					lineWidth: 0.1
				},
				bodyStyles: {
					fillColor: [255, 255, 255],  // White background
					textColor: 0,                // Black text
					lineColor: 0,
					lineWidth: 0.1
				},
				alternateRowStyles: {
					fillColor: [255, 255, 255]   // Disable row striping
				},
				// columnStyles: {
				// 	// Optionally, set a fixed width to constrain wrapping
				// 	2: { cellWidth: 60 }  // Column index 2 (e.g., Email) wraps at 60mm
				// }
			});

			// Save the PDF (this triggers a download in the browser)
			doc.save("example.pdf");
		},

		multiPagePDF() {
			const doc = new jsPDF({ orientation: "portrait" });

			const margin = 15;
			const lineHeight = 6; // Adjust based on font size
			const pageHeight = doc.internal.pageSize.getHeight();
			const pageWidth = doc.internal.pageSize.getWidth();

			doc.setFont("courier");
			doc.setFontSize(20);

// Example long text
			const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `.repeat(100);
			const wrappedLines = doc.splitTextToSize(longText, pageWidth - margin * 2);

			let y = margin;

			wrappedLines.forEach(line => {
				if (y + lineHeight > pageHeight - margin) {
					doc.addPage();       // Add new page if beyond bottom margin
					y = margin;          // Reset y for new page
				}
				doc.text(line, margin, y);
				y += lineHeight;
			});

			doc.save("long-text-with-pages.pdf");

		},


	}
};
</script>


