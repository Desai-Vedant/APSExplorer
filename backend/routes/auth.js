import express from 'express';
import { getLoginUrl, exchangeCodeForToken, refreshToken, getUserProfile } from '../services/auth.js';

const router = express.Router();

router.get('/login', (req, res) => {
    res.redirect(getLoginUrl());
});

router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const credentials = await exchangeCodeForToken(code);
        req.session.credentials = credentials;
        const userProfile = await getUserProfile(credentials);
        req.session.user_profile = userProfile;
        req.session.user_email = userProfile.email;
        // Redirect to frontend after successful login
        const { FRONTEND_URL } = await import('../config.js');
        res.redirect(`${FRONTEND_URL}/home`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.get('/token', (req, res) => {
    if (req.session.credentials && req.session.credentials.access_token) {
        res.json({ access_token: req.session.credentials.access_token });
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
