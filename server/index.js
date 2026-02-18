import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import notesRouter from './routes/notes.js';
import agentsRouter from './routes/agents.js';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', tasksRouter);
app.use('/api', notesRouter);
app.use('/api', agentsRouter);
app.use('/api', settingsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
