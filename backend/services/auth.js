import { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_CALLBACK_URL } from '../config.js';
import { AuthenticationClient, Scopes , ResponseType} from '@aps_sdk/authentication';

const authClient = new AuthenticationClient();

export const getLoginUrl = () => {
    const scopes = [Scopes.DataRead, Scopes.DataWrite, Scopes.BucketRead, Scopes.BucketCreate, Scopes.UserProfileRead, Scopes.UserProfileWrite, Scopes.BucketDelete, Scopes.BucketUpdate];
    return authClient.authorize(APS_CLIENT_ID, ResponseType.Code,  APS_CALLBACK_URL, scopes);
};

export const exchangeCodeForToken = async (code) => {
    const credentials = await authClient.getThreeLeggedToken(APS_CLIENT_ID ,code, APS_CALLBACK_URL, {clientSecret: APS_CLIENT_SECRET});
    return credentials;
};

export const refreshToken = async (credentials) => {
    const newCredentials = await authClient.refreshToken(credentials.refresh_token , APS_CLIENT_ID, {clientSecret: APS_CLIENT_SECRET});
    return newCredentials;
};

export const getUserProfile = async (credentials) => {
    const resp = await authClient.getUserInfo(credentials.access_token);
    return resp;
};