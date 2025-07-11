
import express from 'express';
import multer from 'multer';
import { getContents, getVersions, createFolder, uploadFile } from '../services/projects.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/:project_id/contents', async (req, res) => {
    try {
        const { project_id } = req.params;
        const { folder_id } = req.query;
        const contents = await getContents(project_id, folder_id, req.session.credentials);
        res.json(contents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:project_id/items/:item_id/versions', async (req, res) => {
    try {
        const { project_id, item_id } = req.params;
        const versions = await getVersions(project_id, item_id, req.session.credentials);
        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:project_id/folders', async (req, res) => {
    try {
        const { project_id } = req.params;
        const { folder_name, parent_folder_id } = req.body;
        const newFolder = await createFolder(project_id, folder_name, parent_folder_id, req.session.credentials);
        res.json(newFolder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:project_id/files', upload.single('file'), async (req, res) => {
    try {
        const { project_id } = req.params;
        const { parent_folder_id } = req.body;
        const { originalname, path } = req.file;
        const newFile = await uploadFile(project_id, originalname, parent_folder_id, path, req.session.credentials);
        res.json(newFile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
