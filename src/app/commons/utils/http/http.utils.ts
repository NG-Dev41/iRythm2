import { GenericHttpResponse } from "app/commons/constants/endpoint-url.const";


/**
 * Static methods supporting http related operations
 */
export class HttpUtils {


	/**
	 * Returns true if we have a good response with no errors specifically returned from the backend.
	 * Note: We will still have a 200 status code.
	 *
	 * @param  {GenericHttpResponse} response
	 * @return {boolean}
	 */
	public static hasError(response: GenericHttpResponse): boolean {
		return (!response || response.errorInfo.hasError);
	}

}