import { DataManagementClient } from '@aps_sdk/data-management';
import {OssClient} from '@aps_sdk/oss'

const dataManagementClient = new DataManagementClient();
const ossClient = new OssClient();

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

export const uploadFile = async (hubId, projectId, folderId, file, accessToken) => {
    try {
        const storagePayload = {
            "jsonapi": {
            "version": "1.0"
            },
            "data": {
            "type": "objects",
            "attributes": {
                "name": file.name
            },
            "relationships": {
                "target": {
                "data": {
                    "type": "folders",
                    "id": folderId
                }
                }
            }
            }
        }
        // Create a storage location for the file
        const storageLocation = await dataManagementClient.createStorage(projectId, storagePayload, { accessToken });
        const bucketKey = storageLocation.data.id.split(':')[-1].split('/')[0];
        const objectKey = storageLocation.data.id.split(':')[-1].split('/')[-1];
        // Upload file to OSS
        const uploadResponse = await ossClient.uploadFile(bucketKey, objectKey, file, { accessToken, signedUrl });
        // Complete the Upload
        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file.');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}