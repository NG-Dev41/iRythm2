import { Route, Data } from '@angular/router';

import { PageKey } from 'app/commons/constants/page-meta.const';


/**
 * Purpose of this is to allow typehinting of the route data property
 */
export interface AppRouteData extends Data {
	processRedirect?: true;
}

export interface AppRoute extends Route {
	data?: AppRouteData;
}

export type AppRoutes = AppRoute[];