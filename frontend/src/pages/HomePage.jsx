import React, { useEffect, useState } from 'react';
import HubTile from '../components/HubTile';
import { theme } from '../theme';

const HomePage = () => {
    const [hubs, setHubs] = useState([]);

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
            fontSize: '16px'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: theme.spacing.lg,
            padding: theme.spacing.md
        },
        error: {
            color: theme.colors.error,
            textAlign: 'center',
            padding: theme.spacing.xl
        }
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/hubs`, {
            credentials: 'include'
        })
            .then((response) => {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                return response.json();
            })
            .then((data) => {
                if (data) setHubs(data);
            });
    }, []);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Autodesk Construction Cloud Hub Explorer</h1>
            </header>
            <div style={styles.grid}>
                {hubs.length > 0 ? (
                    hubs.map((hub) => <HubTile key={hub.id} hub={hub} />)
                ) : (
                    <p style={styles.error}>No hubs found. Please check your connection and permissions.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
