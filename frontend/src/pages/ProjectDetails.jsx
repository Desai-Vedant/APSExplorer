import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import InspireTree from 'inspire-tree';
import InspireTreeDOM from 'inspire-tree-dom';
import 'inspire-tree-dom/dist/inspire-tree-light.css';
import ModelViewer from '../components/ModelViewer';

function ProjectDetails2() {
    const { project_id, hub_id } = useParams();
    const [runtime, setRuntime] = useState({ accessToken: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const treeContainer = useRef(null);
    const treeInstance = useRef(null);

    function createTreeNode(id, text, icon, children = false) {
        return { id, text, children, itree: { icon } };
    }

    async function getContents(folderId = null) {
        try {
            const url = `${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects/${project_id}/contents${folderId ? `?folder_id=${folderId}` : ''}`;
            const response = await fetch(url, { credentials: 'include' });
            
            if (response.status === 401) {
                window.location.href = '/';
                return [];
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch project contents.');
            }

            const data = await response.json();
            return data.map(item => {
                const isFolder = item.type === 'folders';
                return createTreeNode(
                    `${item.type}|${item.id}`,
                    item.attributes?.displayName || item.name || item.id,
                    isFolder ? 'fa fa-folder' : 'fa fa-file',
                    item.type === 'folders' || item.type === 'items'
                );
            });
        } catch (error) {
            console.error('Error fetching contents:', error);
            return [];
        }
    }

    async function getVersions(itemId) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects/${project_id}/contents/${itemId}/versions`,
                { credentials: 'include' }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch versions.');
            }

            const versions = await response.json();
            return versions.map(version => 
                createTreeNode(
                    `version|${version.id}`,
                    new Date(version.attributes.createTime).toLocaleString(),
                    'fa fa-clock-o'
                )
            );
        } catch (error) {
            console.error('Error fetching versions:', error);
            return [];
        }
    }

    useEffect(() => {
        // Get viewer token
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/token`, {
            credentials: 'include',
        })
            .then(response => {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data) setRuntime({ accessToken: data.access_token });
            });

        // Initialize Inspire Tree
        if (treeContainer.current && hub_id && project_id) {
            const tree = new InspireTree({
                data: function (node) {
                    if (!node || !node.id) {
                        return getContents();
                    } else {
                        const [type, id] = node.id.split('|');
                        switch (type) {
                            case 'folders':
                                return getContents(id);
                            case 'items':
                                return getVersions(id);
                            default:
                                return [];
                        }
                    }
                }
            });

            tree.on('node.click', function (event, node) {
                event.preventTreeDefault();
                const [type, id] = node.id.split('|');
                if (type === 'version') {
                    setSelectedFile(id);
                }
            });

            // Create the DOM tree
            const dom = new InspireTreeDOM(tree, {
                target: treeContainer.current,
                dragAndDrop: false
            });

            // Store both tree and dom in the ref
            treeInstance.current = { tree, dom };
        }

        return () => {
            if (treeInstance.current) {
                // Remove the tree content from the DOM
                if (treeContainer.current) {
                    treeContainer.current.innerHTML = '';
                }
                // Clear the ref
                treeInstance.current = null;
            }
        };
    }, [hub_id, project_id]);

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px' }}>
            <div style={{ width: '300px', marginRight: '20px', overflow: 'auto' }}>
                <div ref={treeContainer} style={{ height: '100%' }} className="inspire-tree"></div>
            </div>
            <div style={{ flex: 1, height: '100%' }}>
                {selectedFile && <ModelViewer runtime={runtime} urn={selectedFile} urnEncoded={btoa(selectedFile)}/>}
            </div>
        </div>
    );
}

export default ProjectDetails2;
