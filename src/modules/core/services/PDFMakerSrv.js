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
}


export default PDFMakerSrv.getInstance();

