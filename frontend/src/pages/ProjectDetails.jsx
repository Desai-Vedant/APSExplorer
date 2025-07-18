import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import InspireTree from 'inspire-tree';
import InspireTreeDOM from 'inspire-tree-dom';
import 'inspire-tree-dom/dist/inspire-tree-light.css';
import ModelViewer from '../components/ModelViewer';
import { theme } from '../theme';

function ProjectDetails() {
    const { project_id, hub_id } = useParams();
    const [runtime, setRuntime] = useState({ accessToken: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedUploadFile, setSelectedUploadFile] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const treeContainer = useRef(null);
    const treeInstance = useRef(null);

    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            backgroundColor: theme.colors.background
        },
        sidebar: {
            width: '350px',
            backgroundColor: theme.colors.surface,
            borderRight: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        treeContainer: {
            flex: 1,
            overflow: 'auto',
            padding: theme.spacing.md
        },
        viewer: {
            flex: 1,
            height: '100%',
            backgroundColor: theme.colors.background,
            position: 'relative'
        },
        header: {
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.surface
        },
        footer: {
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.surface
        },
        button: {
            disabled: false,
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.light,
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '16px',
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            border: 'none',
            width: '100%'
        },
        button_disabled: {
            disabled: true,
            backgroundColor: theme.colors.secondary,
            color: theme.colors.text.light,
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '16px',
            fontWeight: 400,
            cursor: 'not-allowed',
            transition: 'background-color 0.2s ease',
            border: 'none',
            width: '100%'
        },
        title: {
            color: theme.colors.text.primary,
            fontSize: '18px',
            fontWeight: 500,
            marginBottom: theme.spacing.xs
        },
        subtitle: {
            color: theme.colors.text.secondary,
            fontSize: '14px'
        },
        fileinput: {
            display: 'block',
            margin: `${theme.spacing.sm} 0`,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            border: `1px solid ${theme.colors.border}`,
            width: '100%',
            fontSize: '14px',
            color: theme.colors.text.primary
        },
        footerfont: { marginBottom: theme.spacing.sm, color: theme.colors.text.secondary, fontSize: '10px' }
    };

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
                    setSelectedFolder(null);
                }
                if (type === 'folders') {
                    console.log('Folder selected:', id);
                    setSelectedFolder(id);
                }
                if (type === 'items') {
                    setSelectedFolder(null);
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
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Project Browser</h2>
                    <p style={styles.subtitle}>Browse project files and models</p>
                </div>
                <div style={styles.treeContainer}>
                    <div ref={treeContainer} className="inspire-tree"></div>
                </div>
                <div style={styles.footer}>
                    {selectedFolder ? (
                        <p style={styles.footerfont}>
                            Selected Folder: {selectedFolder}
                        </p>
                    ) : (
                        <p style={styles.footerfont}>
                            No folder selected
                        </p>
                    )}
                    <input type="file" style={styles.fileinput} onChange={(e) => setSelectedUploadFile(e.target.files[0])}></input>
                    <button style={selectedUploadFile ? styles.button : styles.button_disabled}>Upload</button>
                </div>
            </div>
            <div style={styles.viewer}>
                {selectedFile && (
                    <ModelViewer
                        runtime={runtime}
                        urn={selectedFile}
                        urnEncoded={btoa(selectedFile)}
                    />
                )}
            </div>
        </div>
    );
}

export default ProjectDetails;
