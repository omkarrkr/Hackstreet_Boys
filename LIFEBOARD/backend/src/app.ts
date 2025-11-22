import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import goalsRoutes from './routes/goals';
import financesRoutes from './routes/finances';
import habitsRoutes from './routes/habits';
import tasksRoutes from './routes/tasks';
import healthRoutes from './routes/health';
import bucketlistRoutes from './routes/bucketlist';
import userRoutes from './routes/user';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'LifeBoard API is running' });
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/goals', goalsRoutes);
app.use('/finances', financesRoutes);
app.use('/habits', habitsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/health', healthRoutes);
app.use('/bucketlist', bucketlistRoutes);

app.use(errorHandler);

export default app;
