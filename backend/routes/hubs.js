
import express from 'express';
import { getHubs, getProjects } from '../services/hubs.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const hubs = await getHubs(req.session.credentials);
        res.json(hubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:hub_id/projects', async (req, res) => {
    try {
        const { hub_id } = req.params;
        const projects = await getProjects(hub_id, req.session.credentials);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
