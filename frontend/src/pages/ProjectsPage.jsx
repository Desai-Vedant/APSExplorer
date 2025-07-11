
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProjectTile from '../components/ProjectTile';

function ProjectsPage() {
    const { hub_id } = useParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch projects.');
                }
                return response.json();
            })
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [hub_id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Projects in Hub
            </Typography>
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <ProjectTile project={project} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default ProjectsPage;
