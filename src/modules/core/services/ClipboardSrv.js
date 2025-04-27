import { dataSrv } from "@/modules/core/services/DataSrv";


class ClipboardSrv {
	
	static #instance;
	
	static getInstance() {
		if (!ClipboardSrv.#instance) {
			ClipboardSrv.#instance = new ClipboardSrv();
		}
		return ClipboardSrv.#instance;
	}
	
	// =============================================
	
	/**
	 * The public method, that is called from ContentView.vue
	 *
	 * This method
	 * 1. Takes the clipboard content and passes it to  _convertContentToBase64(blob)
	 * 2. Logs the base64 string
	 */
	async pasteClipboardContent() {
		try {
			const clipboardItems = await navigator.clipboard.read();
			
			for (const item of clipboardItems) {
				if (item.types.includes('image/png')) {
					const blob = await item.getType('image/png');
					const base64String = await this._convertContentToBase64(blob);
					
					console.log('///////// Base64 string:', base64String);
					
					await this._storeImage(base64String);
					
					return base64String;
				}
			}
			
			throw new Error('No image found in clipboard');
		} catch (error) {
			console.error('Error reading clipboard:', error);
			throw error;
		}
	}
	
	
	
	// =============================================
	
	async _storeImage(base64String) {
		
		console.log("🟢 storeImage")
		
		const contentItem = {
			name: this._getFileName(),
			data: base64String
		}
		
		await dataSrv.add("content", contentItem)
	}
	
	
	// =============================================
	
	/*
	I've implemented the method with the following features:
	- Returns a Promise since FileReader operations are asynchronous
	- Uses FileReader to convert the Blob to a base64 string
	- Splits the result to get only the base64 data (removing the data URL prefix)
	Handles both success and error cases
	
	A few important notes:
	The method assumes this.clipboardItem is a Blob containing the image data
	The base64 string will be the raw base64 data without the data URL prefix (e.g., "data:image/png;base64,")
	The method is asynchronous and should be used with await or .then()
	 */
	async _convertContentToBase64(blob) {
		/*
		 - Extract the image data from the clipboard item

     When reading from the clipboard using navigator.clipboard.read(),
     the image data will be available as a 'ClipboardItem'.

     For images, specifically:
     The clipboard item will have a MIME type of image/png (for screenshots) or other image formats like image/jpeg
     The actual image data will be available as a Blob object.
     
     Convert Blob to a base64 and log the base64 string
		 */
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const base64String = reader.result.split(',')[1];
				resolve(base64String);
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}
	
	// =============================================
	
	_getFileName() {
		// creates a string in format "image_(day)_(month)_(year)" from current datetime
		const now = new Date();
		const ts = now.getTime();
		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		const year = now.getFullYear();
		
		return `image_${day}_${month}_${year}_${ts}`;
	}
	
	
	// =============================================
}


export default ClipboardSrv.getInstance();

