// import { Injectable } from '@angular/core';

// import { IStorageService } from './'


// @Injectable({
//     providedIn: 'root'
// })
// export class LocalStorageService implements IStorageService {

//     // Storage container
//     public storage = localStorage;


//     /**
//      * Ctor
//      */
//     public constructor() { }


//     /**
//      * Returns data from storage based on key param.
//      *
//      * @param  {string} key
//      * @return {any}
//      */
//     public get(key: any): any {

//         let result;
//         const payload = this.storage.getItem(key);

//         try {
//             result = <object>JSON.parse(payload);
//         }
//         catch (e) {
//             result = <string>payload;
//         }

//         return result;
//     }


//     /**
//      * Adds data to storage based on key param and data param.
//      *
//      * @param {string} key  Key to store data under
//      * @param {any}    data Data to store
//      */
//     public set(key: any, data: any): any {
//         return this.storage.setItem(key, (typeof data === 'object') ? JSON.stringify(data) : data);
//     }


//     /**
//      * Removes item from storage based on key.
//      *
//      * @param {string} key
//      */
//     public remove(key: any): any {
//         this.storage.removeItem(key);
//     }


//     /**
//      * Removes all data from storage
//      */
//     public clear(): void {
//         this.storage.clear();
//     }
// }
