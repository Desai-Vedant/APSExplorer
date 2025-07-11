
import express from 'express';
import { getLoginUrl, exchangeCodeForToken, refreshToken, getUserProfile } from '../services/auth.js';

const router = express.Router();

router.get('/url', (req, res) => {
    res.json({ url: getLoginUrl() });
});

router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const credentials = await exchangeCodeForToken(code);
        req.session.credentials = credentials;
        req.session.user_profile = await getUserProfile(credentials);
        res.redirect('http://localhost:5173/home'); // Redirect to your frontend application
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/token', (req, res) => {
    if (req.session.credentials) {
        res.json(req.session.credentials);
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

router.get('/refresh', async (req, res) => {
    try {
        const { credentials } = req.session;
        const newCredentials = await refreshToken(credentials);
        req.session.credentials = newCredentials;
        res.json(newCredentials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/status', (req, res) => {
    res.json({ authenticated: !!req.session.credentials });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ status: 'success' });
});

export default router;
