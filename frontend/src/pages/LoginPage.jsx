import { Button, Container, Box, Typography } from '@mui/material';

function LoginPage() {
    const handleLogin = () => {
        // Redirect the browser to the backend login endpoint
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login`;
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
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Login with Autodesk
                </Button>
            </Box>
        </Container>
    );
}

export default LoginPage;