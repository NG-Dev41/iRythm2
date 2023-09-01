

/**
 * RecordUtils
 *
 * Static convience methods that need no state can be added here
 */
export class RecordUtils {


	/**
	 * Method builds out a record url based.
	 * url param should be the part of the url that needs to come after /record/serialNumber/path
	 *
	 * @param  {string} serialNumber
	 * @param  {string} path = ''
	 * @return {string}
	 */
	public static buildUrl(serialNumber: string, path: string = ''): string {

		path = (path) ? `/${path}` : ''
		return `/record/${serialNumber}${path}`
	}
}
