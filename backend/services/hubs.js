import { DataManagementClient } from '@aps_sdk/data-management';
import { APS_CLIENT_ID, APS_CLIENT_SECRET } from '../config.js';

const dataManagementClient = new DataManagementClient();

export const getHubs = async (accessToken) => {
    const hubs = await dataManagementClient.getHubs({accessToken});
    return hubs.data;
};

export const getProjects = async (accessToken, hubId) => {
    const projects = await dataManagementClient.getHubProjects(hubId, {accessToken});
    return projects.data;
};