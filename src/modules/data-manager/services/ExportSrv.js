class ExportSrv {
	
	static instance;
	
	static getInstance() {
		if (!ExportSrv.instance) {
			ExportSrv.instance = new ExportSrv();
		}
		
		return ExportSrv.instance;
	}
	
	downloadJson(data, tableName = null) {
		const str = JSON.stringify(data);
		const filename = this.#parseFileName(tableName);
		this.#downloadFileFromBlob(str, 'text/plain', filename);
	}
	
	downloadImage(base64data, filename) {
		// NOTE : base64data holds the data WITHOUT the prefix 'data:image/png;base64,'
		// dataUrl - 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...'
		// base64data - 'iVBORw0KGgoAAAANSUhEUgAAA...'
		
		filename = filename.replaceAll(".", "_"); // necessary to avoid confusion on file format
		
		// Convert base64 to binary
		const binaryString = atob(base64data);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		this.#downloadFileFromBlob(bytes, 'image/png', filename);
	}
	
	// ============================================= DOWNLOAD
	
	#downloadFileFromBlob(data, type, filename) {
		// Create a blob object representing the data with the provided data type
		const blob = new Blob([data], { type: type });
		
		// Create a link element
		const link = document.createElement('a');
		
		// Set the href and download.
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		
		// Add the link to the DOM
		document.body.appendChild(link);
		// Simulate click to start the download process
		link.click();
		// Remove the link from the DOM
		document.body.removeChild(link);
	}
	
	// ============================================= UTILITY
	
	#parseFileName(tableName) {
		let now = new Date();
		let y = now.getFullYear();
		let m = (now.getMonth() + 1).toString().padStart(2, '0'); // we add 1 because months are zero based
		let d = now.getDate().toString().padStart(2, '0');
		let h = now.getHours().toString().padStart(2, '0');
		let min = now.getMinutes().toString().padStart(2, '0');
		
		let filename = `beta_box_BACKUP_${y}_${m}_${d}_${h}_${min}`;
		if (tableName) filename += `_${tableName}`;
		
		return filename + ".txt";
	}
	
}

export default ExportSrv.getInstance();
