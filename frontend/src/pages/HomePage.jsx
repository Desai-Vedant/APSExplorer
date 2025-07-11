import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import HubTile from '../components/HubTile';

function HomePage() {
    const [hubs, setHubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/hubs`, {
            credentials: 'include', // Send cookies for session auth
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch hubs.');
                }
                return response.json();
            })
            .then((data) => {
                setHubs(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Hubs
            </Typography>
            <Grid container spacing={3}>
                {hubs.map((hub) => (
                    <Grid item xs={12} sm={6} md={4} key={hub.id}>
                        <HubTile hub={hub} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default HomePage;
