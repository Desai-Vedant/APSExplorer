
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { PORT, SESSION_SECRET } from './config.js';
import authRouter from './routes/auth.js';
import hubsRouter from './routes/hubs.js';
import projectsRouter from './routes/projects.js';

const app = express();

app.use(session({
    secret: SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/hubs', hubsRouter);
app.use('/api/hubs/:hub_id/projects', projectsRouter);

app.get('/health', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT || 3000, () => {
    console.log(`Server listening at http://localhost:${PORT || 3000}`);
});
