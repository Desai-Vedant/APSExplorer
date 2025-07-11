import express from 'express';
import { getHubs, getProjects } from '../services/hubs.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        if (!req.session.credentials || !req.session.credentials.access_token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const hubs = await getHubs(req.session.credentials.access_token);
        res.json(hubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:hub_id/projects', async (req, res) => {
    try {
        if (!req.session.credentials || !req.session.credentials.access_token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { hub_id } = req.params;
        const projects = await getProjects(req.session.credentials.access_token, hub_id);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
