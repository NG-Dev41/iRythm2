import { Injectable } from '@angular/core';

/**
* Describes response returned from the /info url
*/
export interface IGetInfoResponse {
	build_number: string;
	version: string;
}


/**
* Model class representing server info
*/
export class MInfo {
	buildNumber: string;
	version: string;

	/**
	* Ctor
	*
	* @param {string} buildNumber
	* @param {string} version
	*/
	public constructor(buildNumber: string, version: string) {
		this.buildNumber = buildNumber;
		this.version = version;
	}
}


/**
* Serialize/Deseralize data from and to API
*/
@Injectable({
	providedIn: 'root',
})
export class InfoSerializer {

	/**
	* Deserialize /info response data to MInfo object.
	*
	* @param  {IGetInfoResponse} input Response data returned from /info endpoint
	* @return {MInfo}
	*/
	public deserialize(input: IGetInfoResponse): MInfo {
		return new MInfo(input.build_number, input.version);
	}
}