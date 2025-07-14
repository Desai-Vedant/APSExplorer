import { DataManagementClient } from '@aps_sdk/data-management';

const dataManagementClient = new DataManagementClient();

export const getContents = async (hubId, projectId, folderId, accessToken) => {
    try {
        if (!folderId) {
            // Get top-level folders for the project
            const resp = await dataManagementClient.getProjectTopFolders(hubId, projectId, { accessToken });
            return resp.data.map(item => ({
                id: item.id,
                type: item.type,
                attributes: {
                    displayName: item.attributes.displayName,
                    extension: item.attributes.extension
                }
            }));
        } else {
            // Get contents of a folder
            const resp = await dataManagementClient.getFolderContents(projectId, folderId, { accessToken });
            return resp.data.map(item => ({
                id: item.id,
                type: item.type,
                attributes: {
                    displayName: item.attributes.displayName,
                    extension: item.attributes.extension
                }
            }));
        }
    } catch (error) {
        console.error('Error getting contents:', error);
        throw error;
    }
};

export const getVersions = async (hubId, projectId, itemId, accessToken) => {
    try {
        const resp = await dataManagementClient.getItemVersions(projectId, itemId, { accessToken });
        return resp.data.map(version => ({
            id: version.id,
            type: 'versions',
            attributes: {
                displayName: new Date(version.attributes.createTime).toLocaleString(),
                createTime: version.attributes.createTime
            }
        }));
    } catch (error) {
        console.error('Error getting versions:', error);
        throw error;
    }
};