import { DataManagementClient } from '@aps_sdk/data-management';
import { APS_CLIENT_ID, APS_CLIENT_SECRET } from '../config.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const dataManagementClient = new DataManagementClient();

export const getContents = async (projectId, folderId, token) => {
    if (folderId) {
        const contents = await dataManagementClient.getFolderContents(projectId, folderId, null, token);
        return contents.data;
    } else {
        const contents = await dataManagementClient.getProjectTopFolders(projectId, token);
        return contents.data;
    }
};

export const getVersions = async (projectId, itemId, token) => {
    const versions = await dataManagementClient.getItemVersions(projectId, itemId, null, token);
    return versions.data;
};

export const createFolder = async (projectId, folderName, parentFolderId, token) => {
    const newFolder = await dataManagementClient.postFolder(projectId, { jsonapi: { version: '1.0' }, data: { type: 'folders', attributes: { name: folderName, extension: { type: 'folders:autodesk.core:Folder', version: '1.0' } }, relationships: { parent: { data: { type: 'folders', id: parentFolderId } } } } }, token);
    return newFolder.data;
};

export const uploadFile = async (projectId, fileName, parentFolderId, filePath, token) => {
    // 1. Create a storage location in the folder
    const storagePayload = {
        jsonapi: { version: '1.0' },
        data: {
            type: 'objects',
            attributes: { name: fileName },
            relationships: {
                target: {
                    data: {
                        type: 'folders',
                        id: parentFolderId
                    }
                }
            }
        }
    };
    const storageRes = await dataManagementClient.createStorage(token.access_token, projectId, undefined, storagePayload);
    const storageId = storageRes.data.data.id; // e.g. urn:adsk.objects:os.object:bucketKey/objectKey
    const uploadUrl = storageRes.data.data.links.upload.href;

    // 2. Upload the file to OSS using the upload URL
    const fileStream = fs.createReadStream(filePath);
    await axios.put(uploadUrl, fileStream, {
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    });

    // 3. Create the item in the folder referencing the storage
    const itemPayload = {
        jsonapi: { version: '1.0' },
        data: {
            type: 'items',
            attributes: {
                name: fileName,
                extension: {
                    type: 'items:autodesk.bim360:File',
                    version: '1.0'
                }
            },
            relationships: {
                parent: {
                    data: {
                        type: 'folders',
                        id: parentFolderId
                    }
                }
            }
        },
        included: [
            {
                type: 'versions',
                id: '1',
                attributes: {
                    name: fileName,
                    extension: {
                        type: 'versions:autodesk.bim360:File',
                        version: '1.0'
                    }
                },
                relationships: {
                    storage: {
                        data: {
                            type: 'objects',
                            id: storageId
                        }
                    }
                }
            }
        ]
    };
    const itemRes = await dataManagementClient.createItem(token.access_token, projectId, undefined, undefined, itemPayload);
    // Optionally, delete the temp file
    fs.unlink(filePath, () => {});
    return itemRes.data;
};