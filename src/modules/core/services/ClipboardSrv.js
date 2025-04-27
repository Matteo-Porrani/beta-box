import { dataSrv } from "@/modules/core/services/DataSrv";

/**
 * Service for handling clipboard operations, particularly focused on image handling.
 * Implements the Singleton pattern to ensure only one instance exists.
 */
class ClipboardSrv {
	
	/** @private */
	static #instance;
	
	/**
	 * Gets the singleton instance of ClipboardSrv
	 * @returns {ClipboardSrv} The singleton instance
	 */
	static getInstance() {
		if (!ClipboardSrv.#instance) {
			ClipboardSrv.#instance = new ClipboardSrv();
		}
		return ClipboardSrv.#instance;
	}
	
	// =============================================
	
	/**
	 * Reads the clipboard content and processes any images found.
	 * @returns {Promise<string>} A promise that resolves to the base64 string of the image
	 * @throws {Error} If no image is found in the clipboard or if there's an error reading the clipboard
	 */
	async pasteClipboardContent() {
		try {
			const clipboardItems = await navigator.clipboard.read();
			
			for (const item of clipboardItems) {
				if (item.types.includes('image/png')) {
					const blob = await item.getType('image/png');
					const base64String = await this._convertContentToBase64(blob);
					
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
	
	/**
	 * Stores an image in the data service
	 * @private
	 * @param {string} base64String - The base64 encoded image data
	 * @returns {Promise<void>}
	 */
	async _storeImage(base64String) {
		await dataSrv.add(
			"content",
			{
				name: this._getFileName(),
				data: base64String
			}
		)
	}
	
	// =============================================
	
	/**
	 * Converts a Blob to a base64 string
	 * @private
	 * @param {Blob} blob - The Blob object containing the image data
	 * @returns {Promise<string>} A promise that resolves to the base64 string
	 * @throws {Error} If the conversion fails
	 */
	async _convertContentToBase64(blob) {
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
	
	/**
	 * Generates a unique filename for the image based on the current date and timestamp
	 * @private
	 * @returns {string} A filename in the format "image_DD_MM_YYYY_timestamp"
	 */
	_getFileName() {
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

