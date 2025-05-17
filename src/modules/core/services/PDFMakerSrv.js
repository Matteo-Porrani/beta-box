import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";



class PDFMakerSrv {
	
	static #instance;
	
	static getInstance() {
		if (!PDFMakerSrv.#instance) {
			PDFMakerSrv.#instance = new PDFMakerSrv();
		}
		return PDFMakerSrv.#instance;
	}
	
	// =============================================
	
	downloadSprintReview(id, tableRows) {
		
		console.log(id, tableRows)
		
		
		// Create a new PDF document
		const doc = new jsPDF({
			orientation: "landscape",  // Landscape mode
			unit: "mm",                // Default unit (millimeters)
			format: "a4"               // A4 size (can be "letter", "a5", etc.)
		});
		
		doc.setFont("courier", "bold");
		
		// doc.text("This is italic Times.", 10, 10);
		doc.text(`Sprint ${id} Review`, 5, 10); // x, y
		
		autoTable(doc, {
			head: [['Date', 'Tickets']],
			body: tableRows,
			/*
				body: [
					[1, 'Alice', 'alice@example.com\nLine2\nLine3'],
					[2, 'Bob', 'bob@example.com'],
					[3, 'Charlie', 'charlie@example.com']
				],
			 */
			startY: 20,
			styles: {
				font: 'courier',   // Set font to courier
				fontSize: 10,
				textColor: 0,         // Black text
				lineColor: 0,         // Black border
				lineWidth: 0.1,        // Thin border lines
				cellWidth: 'wrap'   // Enable wrapping
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
		doc.save(`sprint_${id}_review.pdf`);
	}
	
	
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
		
	}
	
	
	formattedPDF() {
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
		
		
		// Save the PDF (this triggers a download in the browser)
		doc.save("example.pdf");
	}
}


export default PDFMakerSrv.getInstance();

