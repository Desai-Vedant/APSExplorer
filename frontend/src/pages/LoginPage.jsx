
import React, { useEffect, useState } from 'react';
import { Button, Container, Box, Typography } from '@mui/material';

function LoginPage() {
    const [loginUrl, setLoginUrl] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/url`)
            .then((response) => response.json())
            .then((data) => setLoginUrl(data.url));
    }, []);

    const handleLogin = () => {
        window.location.href = loginUrl;
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Hubs Explorer
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please log in with your Autodesk account to continue.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleLogin} disabled={!loginUrl}>
                    Login with Autodesk
                </Button>
            </Box>
        </Container>
    );
}

export default LoginPage;
