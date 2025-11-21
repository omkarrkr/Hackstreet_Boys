import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import goalsRoutes from './routes/goals';
import financesRoutes from './routes/finances';
import habitsRoutes from './routes/habits';
import tasksRoutes from './routes/tasks';
import healthRoutes from './routes/health';
import bucketlistRoutes from './routes/bucketlist';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'LifeBoard API is running' });
});

app.use('/auth', authRoutes);
app.use('/goals', goalsRoutes);
app.use('/finances', financesRoutes);
app.use('/habits', habitsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/health', healthRoutes);
app.use('/bucketlist', bucketlistRoutes);

app.use(errorHandler);

export default app;
