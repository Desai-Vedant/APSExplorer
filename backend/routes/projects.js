import express from 'express';
import multer from 'multer';
import { getContents, getVersions, createFolder, uploadFile } from '../services/projects.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper to get access_token from session
function getAccessToken(req) {
    return req.session.credentials && req.session.credentials.access_token;
}

router.get('/:project_id/contents', async (req, res) => {
    try {
        const accessToken = getAccessToken(req);
        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { project_id } = req.params;
        const { folder_id } = req.query;
        const contents = await getContents(project_id, folder_id, accessToken);
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:project_id/items/:item_id/versions', async (req, res) => {
    try {
        const accessToken = getAccessToken(req);
        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { project_id, item_id } = req.params;
        const versions = await getVersions(project_id, item_id, accessToken);
        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:project_id/folders', async (req, res) => {
    try {
        const accessToken = getAccessToken(req);
        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { project_id } = req.params;
        const { folder_name, parent_folder_id } = req.body;
        const newFolder = await createFolder(project_id, folder_name, parent_folder_id, accessToken);
        res.json(newFolder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:project_id/files', upload.single('file'), async (req, res) => {
    try {
        const accessToken = getAccessToken(req);
        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { project_id } = req.params;
        const { parent_folder_id } = req.body;
        const { originalname, path } = req.file;
        const newFile = await uploadFile(project_id, originalname, parent_folder_id, path, accessToken);
        res.json(newFile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
