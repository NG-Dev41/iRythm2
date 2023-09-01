
// -- Start Okta Config
import { OktaAuthOptions } from '@okta/okta-auth-js';

const OktaConfig: OktaAuthOptions = {
    clientId: '0oa44sxbolYOo5CKr0x7',
    issuer: 'https://login-test.ziosuite.com/oauth2/default',
    redirectUri: window.location.origin + '/auth/callback',
    scopes: ['openid', 'profile', 'email'],
    postLogoutRedirectUri: window.location.origin + '/auth/login'
};
// -- End Okta Config


export const environment = {
    production: false,
    name: 'default',
    domain: 'https://traceqajavaws-dev.zioreports.com',

    // Authenticated endpoints
    // api: {
    //     domain: 'https://traceqaws-backend-dev.zioreports.com/'
    // },

    api: {
        domain: 'https://traceqajavaws-dev.zioreports.com/'
    },

    oktaConfig: OktaConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
