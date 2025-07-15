import React from 'react';
import { theme } from '../theme';

const LoginPage = () => {
    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background,
            padding: theme.spacing.xl
        },
        card: {
            background: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            width: '100%',
            maxWidth: '400px',
            boxShadow: theme.shadows.lg,
            textAlign: 'center'
        },
        title: {
            color: theme.colors.text.primary,
            fontSize: '24px',
            fontWeight: 500,
            marginBottom: theme.spacing.lg
        },
        button: {
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.light,
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            border: 'none',
            width: '100%'
        },
        logo: {
            width: '150px'
        },
        logoContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
            width: '100%',
            height: '60px',
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.text.primary
        },
        description: {
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xl,
            fontSize: '14px',
            lineHeight: '1.5'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card} className="card">
                <div style={styles.logoContainer}>
                    <img 
                        src="https://aps.autodesk.com/static/1.0.0.20250710172814/images/aps-logo--white.svg" 
                        alt="Autodesk Logo" 
                        style={styles.logo}
                    />
                </div>
                <h1 style={styles.title}>Welcome to Hub Explorer</h1>
                <p style={styles.description}>
                    Sign in with your Autodesk account to access and browse your hubs
                </p>
                <button 
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`}
                    style={styles.button}
                    className="button-primary"
                >
                    Sign in with Autodesk
                </button>
            </div>
        </div>
    );
};

export default LoginPage;