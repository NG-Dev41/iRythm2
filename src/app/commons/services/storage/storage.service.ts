
// /**
//  * Abstract storage class.
//  * SessionStorage and LocalStorage make use of this parent class
//  */
// export class StorageService {


// 	/**
// 	 * Ctor - sets storage type passed in from child class.
// 	 * Ex. SessionStorage, LocalStorage, etc...
// 	 *
// 	 * @param {[type]} storage
// 	 */
// 	public constructor(
// 		protected storage: any
// 	) {	}



// 	/**
// 	 * Returns data from storage based on key param.
// 	 *
// 	 * @param  {string} key
// 	 * @return {any}
// 	 */
// 	protected getItem(key: any): any {

// 		let result;
//         const payload = this.storage.getItem(key);

//         try {
//             result = <object>JSON.parse(payload);
//         }
//         catch (e) {
//             result = <string>payload;
//         }

//         return result;
// 	}


// 	/**
// 	 * Adds data to storage based on key param and data param.
// 	 *
// 	 * @param {string} key  Key to store data under
// 	 * @param {any}    data Data to store
// 	 */
// 	protected setItem(key: any, data: any): void {
// 		this.storage.setItem(key, (typeof data === 'object') ? JSON.stringify(data) : data);
// 	}


// 	/**
// 	 * Removes item from storage based on key.
// 	 *
// 	 * @param {string} key
// 	 */
// 	public removeItem(key: any): void {
// 		this.storage.removeItem(key);
// 	}


// 	/**
// 	 * Removes all data from storage
// 	 */
// 	public clear(): void {
// 		this.storage.clear();
//     }


//     /**
//      * Calculate size of localStorage
//      */
//     public calculateStorageSize(): void {
//         // alert(1024 * 1024 * 5 - escape(encodeURIComponent(JSON.stringify(localStorage))).length);
//         // console.warn('LOCAL STORAGE SIZE:', escape(encodeURIComponent(JSON.stringify(this.storage))).length / 1048576 , ' MB');
//     }

// }
