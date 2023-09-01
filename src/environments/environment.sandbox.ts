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
    name: 'sandbox',
    domain: 'https://traceqaui-ussbx-k8s.dev.zioreports.com/',

    api: {
        domain: 'https://traceqajavaws-sandbox.dev.zioreports.com/'
    },

    oktaConfig: OktaConfig
};