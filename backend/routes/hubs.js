import express from 'express';
import { getHubs, getProjects } from '../services/hubs.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const hubs = await getHubs(req.session.credentials.access_token);
        res.json(hubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:hub_id/projects', authMiddleware, async (req, res) => {
    try {
        const { hub_id } = req.params;
        const projects = await getProjects(req.session.credentials.access_token, hub_id);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
