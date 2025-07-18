import express from 'express';
import { getContents, getVersions } from '../services/projects.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/hubs/:hub_id/projects/:project_id/contents', async (req, res) => {
    try {
        const { hub_id, project_id } = req.params;
        const { folder_id } = req.query;
        const accessToken = req.session.credentials.access_token;
        
        const contents = await getContents(hub_id, project_id, folder_id, accessToken);
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/hubs/:hub_id/projects/:project_id/contents/:item_id/versions', async (req, res) => {
    try {
        const { hub_id, project_id, item_id } = req.params;
        const accessToken = req.session.credentials.access_token;
        
        const versions = await getVersions(hub_id, project_id, item_id, accessToken);
        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/hubs/:hub_id/projects/:project_id/contents/upload', async (req, res) => {
    try {
        const { hub_id, project_id } = req.params;
        const { folder_id } = req.body;
        const file = req.file;
        const accessToken = req.session.credentials.access_token;

        const uploadResponse = await uploadFile(hub_id, project_id, folder_id, file, accessToken);
        res.json(uploadResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
