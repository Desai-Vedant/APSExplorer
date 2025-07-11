import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { PORT, SESSION_SECRET } from './config.js';
import authRouter from './routes/auth.js';
import hubsRouter from './routes/hubs.js';
import projectsRouter from './routes/projects.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend origin
    credentials: true // Allow cookies to be sent
}));

app.set('trust proxy', 1); // Trust first proxy if behind one (for secure cookies in production)

app.use(session({
    secret: SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false, // Only save session if something is stored
    cookie: {
        secure: false, // Set to true if using HTTPS in production
        httpOnly: true, // Prevent JS access to cookie
        sameSite: 'lax', // Helps with CSRF
    },
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