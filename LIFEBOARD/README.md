# LifeBoard - Your Personal Operating System

LifeBoard is a comprehensive personal management platform that combines goal tracking, financial management, habit building, task management, health tracking, and bucket list planning.

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- Supabase (PostgreSQL)
- JWT Authentication
- Deployed on Railway

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Router DOM
- Deployed on Vercel

## Project Structure

```
LIFEBOARD/
├── backend/          # Node.js + Express API
└── frontend/         # React + Vite SPA
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd LIFEBOARD/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env` and update with your Supabase credentials
   - Update JWT secrets for production

4. Run development server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd LIFEBOARD/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Update `.env` with your backend API URL

4. Run development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Database Schema

You'll need to create these tables in Supabase:

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### goals
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  target_date DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### goal_steps
```sql
CREATE TABLE goal_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline DATE,
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### budgets
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### habits
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  frequency VARCHAR(20) DEFAULT 'daily',
  target_count INTEGER,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### habit_logs
```sql
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'todo',
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### health_metrics
```sql
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL(5, 2),
  sleep_hours DECIMAL(4, 2),
  water_intake DECIMAL(5, 2),
  mood VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### workouts
```sql
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  intensity VARCHAR(20),
  calories_burned INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### bucket_items
```sql
CREATE TABLE bucket_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  target_date DATE,
  status VARCHAR(20) DEFAULT 'not_started',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

### Goals
- `GET /goals` - Get all goals
- `POST /goals` - Create goal
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal
- `POST /goals/:id/steps` - Create goal step
- `GET /goals/:id/steps` - Get goal steps
- `POST /goals/ai-roadmap` - Generate AI roadmap

### Finances
- `GET /finances/transactions` - Get transactions
- `POST /finances/transactions` - Create transaction
- `PUT /finances/transactions/:id` - Update transaction
- `DELETE /finances/transactions/:id` - Delete transaction
- `GET /finances/summary` - Get financial summary
- `GET /finances/budget` - Get budgets
- `POST /finances/budget` - Create budget

### Habits
- `GET /habits` - Get all habits
- `POST /habits` - Create habit
- `PUT /habits/:id` - Update habit
- `DELETE /habits/:id` - Delete habit
- `POST /habits/:id/log` - Log habit completion
- `GET /habits/:id/logs` - Get habit logs

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Health
- `GET /health/metrics` - Get health metrics
- `POST /health/metrics` - Create health metric
- `GET /health/workouts` - Get workouts
- `POST /health/workouts` - Create workout

### Bucket List
- `GET /bucketlist` - Get bucket items
- `POST /bucketlist` - Create bucket item
- `PUT /bucketlist/:id` - Update bucket item
- `DELETE /bucketlist/:id` - Delete bucket item

## Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy from main branch

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

## Features

- ✅ User authentication with JWT
- ✅ Goal tracking with AI roadmap suggestions
- ✅ Financial management (transactions, budgets, analytics)
- ✅ Habit tracking with streaks
- ✅ Task management
- ✅ Health & fitness tracking
- ✅ Bucket list / vision board
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes
- ✅ Token refresh mechanism

## License

MIT
