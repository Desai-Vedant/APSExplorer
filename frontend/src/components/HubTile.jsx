import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const HubTile = ({ hub }) => {
    const navigate = useNavigate();

    const styles = {
        container: {
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.lg,
            margin: theme.spacing.md,
            boxShadow: theme.shadows.sm,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: `1px solid ${theme.colors.border}`,
            '&:hover': {
                boxShadow: theme.shadows.md,
                transform: 'translateY(-2px)'
            }
        },
        title: {
            color: theme.colors.text.primary,
            fontSize: '18px',
            fontWeight: 500,
            marginBottom: theme.spacing.sm
        },
        description: {
            color: theme.colors.text.secondary,
            fontSize: '14px',
            marginBottom: theme.spacing.md
        },
        details: {
            display: 'flex',
            gap: theme.spacing.md,
            color: theme.colors.text.secondary,
            fontSize: '12px'
        }
    };

    return (
        <div 
            style={styles.container} 
            onClick={() => navigate(`/hubs/${hub.id}/projects`)}
            className="card"
        >
            <h3 style={styles.title}>{hub.attributes?.name || hub.id}</h3>
            <p style={styles.description}>{hub.attributes?.extension?.type || 'No type specified'}</p>
            <div style={styles.details}>
                <span>ID: {hub.id}</span>
                <span>•</span>
                <span>Region: {hub.attributes?.region || 'Unknown'}</span>
            </div>
        </div>
    );
};

export default HubTile;