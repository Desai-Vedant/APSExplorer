import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { theme } from '../theme';

const ProjectTile = ({ project }) => {
    const navigate = useNavigate();
    const { hub_id } = useParams();

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
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: theme.spacing.sm
        },
        title: {
            color: theme.colors.text.primary,
            fontSize: '18px',
            fontWeight: 500,
            marginBottom: theme.spacing.xs
        },
        status: {
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '12px',
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.light
        },
        description: {
            color: theme.colors.text.secondary,
            fontSize: '14px',
            lineHeight: '1.5',
            marginBottom: theme.spacing.md
        },
        details: {
            display: 'flex',
            gap: theme.spacing.md,
            color: theme.colors.text.secondary,
            fontSize: '12px',
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: theme.spacing.md
        }
    };

    return (
        <div 
            style={styles.container}
            onClick={() => navigate(`/hubs/${hub_id}/projects/${project.id}`)}
            className="card"
        >
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>{project.attributes?.name || project.id}</h3>
                    <span style={styles.status}>{project.attributes?.status || 'Active'}</span>
                </div>
            </div>
            <p style={styles.description}>
                {(project.attributes?.scopes?.[0]) || 'No scopes specified'}
            </p>
            <div style={styles.details}>
                <span>ID: {project.id}</span>
                <span>•</span>
                <span>Type: {project.attributes?.extension?.type || 'Unknown'}</span>
            </div>
        </div>
    );
};

export default ProjectTile;