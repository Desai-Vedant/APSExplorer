import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProjectTile from '../components/ProjectTile';
import { theme } from '../theme';

function ProjectsPage() {
    const { hub_id } = useParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const styles = {
        container: {
            padding: theme.spacing.xl,
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            marginBottom: theme.spacing.xl,
            textAlign: 'center'
        },
        title: {
            color: theme.colors.text.primary,
            fontSize: '32px',
            fontWeight: 500,
            marginBottom: theme.spacing.md
        },
        subtitle: {
            color: theme.colors.text.secondary,
            fontSize: '16px',
            marginBottom: theme.spacing.xl
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: theme.spacing.lg,
            padding: theme.spacing.md
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
        },
        error: {
            backgroundColor: '#FFF3F3',
            color: theme.colors.error,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
            textAlign: 'center',
            margin: theme.spacing.xl,
            border: `1px solid ${theme.colors.error}`
        }
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/hubs/${hub_id}/projects`, {
            credentials: 'include', // Send cookies for session auth
        })
            .then((response) => {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch projects.');
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setProjects(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [hub_id]);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <CircularProgress sx={{ 
                    color: theme.colors.primary,
                    '& .MuiCircularProgress-circle': {
                        strokeWidth: 3
                    }
                }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <Typography 
                    variant="h1" 
                    component="h1" 
                    style={styles.title}
                >
                    Project Explorer
                </Typography>
            </header>
            <div style={styles.grid}>
                {projects.map((project) => (
                    <ProjectTile 
                        key={project.id} 
                        project={project} 
                        hubId={hub_id}
                    />
                ))}
                {projects.length === 0 && (
                    <Typography 
                        variant="body1" 
                        style={{ 
                            textAlign: 'center', 
                            gridColumn: '1/-1',
                            color: theme.colors.text.secondary 
                        }}
                    >
                        No projects found in this hub
                    </Typography>
                )}
            </div>
        </div>
    );
}

export default ProjectsPage;
