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

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // set to true if using HTTPS
        sameSite: 'lax',
    },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/hubs', hubsRouter);
app.use('/api', projectsRouter);

app.get('/health', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT || 3000, () => {
    console.log(`Server listening at http://localhost:${PORT || 3000}`);
});