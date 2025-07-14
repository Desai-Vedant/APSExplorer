import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { RichTreeView } from '@mui/x-tree-view';
import { TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ModelViewer from '../components/ModelViewer';

function ProjectDetails() {
    const { hub_id, project_id } = useParams();
    const [treeData, setTreeData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [expanded, setExpanded] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [runtime, setRuntime] = useState({ accessToken: '' });

    const loadFolderContents = useCallback(async (folderId = null) => {
        try {
            setLoading(true);
            const url = `${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects/${project_id}/contents${folderId ? `?folder_id=${folderId}` : ''}`;
            const response = await fetch(url, { credentials: 'include' });
            
            if (response.status === 401) {
                window.location.href = '/';
                return;
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch project contents.');
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                if (!folderId) {
                    setTreeData(data.map(item => ({ ...item, children: [] })));
                } else {
                    setTreeData(prevData => updateTreeData(prevData, folderId, data.map(item => ({ ...item, children: [] }))));
                }
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [project_id]);

    const loadVersions = async (itemId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects/${project_id}/contents/${itemId}/versions`,
                { credentials: 'include' }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch versions.');
            }

            const versions = await response.json();
            setTreeData(prevData => updateTreeData(prevData, itemId, versions));
        } catch (err) {
            setError(err.message);
        }
    };

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

        // Get project contents
        loadFolderContents();
    }, [project_id, loadFolderContents]);

    const updateTreeData = useCallback((data, parentId, newChildren) => {
        return data.map(node => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: newChildren
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, parentId, newChildren)
                };
            }
            return node;
        });
    }, []);

    const handleFileSelect = async (event, nodeId) => {
        const findNode = (data, id) => {
            for (const node of data) {
                if (node.id === id) return node;
                if (node.children) {
                    const found = findNode(node.children, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const node = findNode(treeData, nodeId);
        if (node) {
            if (node.type === 'folders') {
                await loadFolderContents(node.id);
            } else if (node.type === 'items') {
                await loadVersions(node.id);
            } else if (node.type === 'versions') {
                setSelectedFile(node.id);
            }
        }
    };

    const handleNodeToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const getNodeIcon = (type) => {
        switch (type) {
            case 'folders':
                return <FolderIcon />;
            case 'items':
                return <DescriptionIcon />;
            case 'versions':
                return <AccessTimeIcon />;
            default:
                return null;
        }
    };

    const renderTree = (node) => {
        if (!node) return null;
        
        const nodeId = node.id || '';
        const label = node.attributes?.displayName || node.id;
        const children = node.children || [];
        
        return (
            <TreeItem 
                key={nodeId} 
                nodeId={nodeId} 
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                        {getNodeIcon(node.type)}
                        <Typography sx={{ ml: 1 }}>{label}</Typography>
                    </Box>
                }
            >
                {Array.isArray(children) && children.length > 0
                    ? children.map((child) => renderTree(child))
                    : null}
            </TreeItem>
        );
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Project Files
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, height: '70vh', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>File Browser</Typography>
                        <RichTreeView
                            aria-label="file system navigator"
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                            expanded={expanded}
                            onNodeSelect={handleFileSelect}
                            onNodeToggle={handleNodeToggle}
                            sx={{ 
                                height: '100%', 
                                flexGrow: 1, 
                                maxWidth: 400,
                                overflowY: 'auto',
                                '& .MuiTreeItem-root': {
                                    '& .MuiTreeItem-content': {
                                        py: 1,
                                    },
                                },
                            }}
                        >
                            {Array.isArray(treeData) && treeData.map((node) => renderTree(node))}
                        </RichTreeView>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ height: '70vh' }}>
                        <ModelViewer runtime={runtime} urn={selectedFile} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProjectDetails;
