class ExportSrv {
	
	static instance;
	
	// constructor() {}
	
	static getInstance() {
		if (!ExportSrv.instance) {
			ExportSrv.instance = new ExportSrv();
		}
		
		return ExportSrv.instance;
	}
	
	_parseFileName() {
		let now = new Date();
		let y = now.getFullYear();
		let m = (now.getMonth() + 1).toString().padStart(2, '0'); // we add 1 because months are zero based
		let d = now.getDate().toString().padStart(2, '0');
		let h = now.getHours().toString().padStart(2, '0');
		let min = now.getMinutes().toString().padStart(2, '0');
		
		return `beta_box_BACKUP_${y}_${m}_${d}_${h}_${min}.txt`; // the file name
	}
	
	downloadJson(data) {
		// The JSON object to download
		const str = JSON.stringify(data);
		
		// Create a blob object representing the data as a text file
		const blob = new Blob([str], { type: 'text/plain' });
		
		// Create a link element
		const link = document.createElement('a');
		
		// Set the href and download. When the user clicks this link, it will download the data
		link.href = URL.createObjectURL(blob);
		link.download = this._parseFileName();
		
		// Add the link to the DOM
		document.body.appendChild(link);
		// Simulate click to start the download process
		link.click();
		// Remove the link from the DOM
		document.body.removeChild(link);
	}
}

export const exportSrv = ExportSrv.getInstance();
