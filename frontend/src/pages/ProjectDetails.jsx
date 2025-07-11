
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Paper, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { useParams } from 'react-router-dom';
import ModelViewer from '../components/ModelViewer';

function ProjectDetails() {
    const { hub_id, project_id } = useParams();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(project_id);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [runtime, setRuntime] = useState({ accessToken: '' });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/token`)
            .then(response => response.json())
            .then(data => setRuntime({ accessToken: data.access_token }));

        fetch(`${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects`)
            .then((response) => response.json())
            .then((data) => setProjects(data));

        fetch(`${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects/${selectedProject}/contents`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch project contents.');
                }
                return response.json();
            })
            .then((data) => {
                setFiles(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [hub_id, selectedProject]);

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const handleFileSelect = (event, nodeId) => {
        const findFile = (nodes) => {
            for (const node of nodes) {
                if (node.id === nodeId) {
                    return node;
                }
                if (node.children) {
                    const found = findFile(node.children);
                    if (found) {
                        return found;
                    }
                }
            }
            return null;
        };
        const file = findFile(files);
        if (file && file.type === 'items') {
            setSelectedFile(file.id);
        }
    };

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.attributes.displayName}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

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
                    Project Details
                </Typography>
                <Select value={selectedProject} onChange={handleProjectChange}>
                    {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                            {project.attributes.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, height: '70vh', overflowY: 'auto' }}>
                        <Typography variant="h6">Files</Typography>
                        <SimpleTreeView
                            aria-label="file system navigator"
                            onNodeSelect={handleFileSelect}
                            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                        >
                            {files.map((node) => renderTree(node))}
                        </SimpleTreeView>
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
