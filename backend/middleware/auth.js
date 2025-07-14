export const authMiddleware = (req, res, next) => {
    if (req.session && req.session.credentials && req.session.credentials.access_token) {
        req.headers.authorization = `Bearer ${req.session.credentials.access_token}`;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};