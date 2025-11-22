# Health & Fitness Feature - Complete Implementation Prompt

## Overview
Generate the complete, integrated full-stack implementation for the Health & Fitness Feature of the LifeBoard application. Adhere strictly to the established React/TypeScript/Tailwind frontend and Node/Express/TypeScript/Supabase backend architecture.

## 1. Database Implementation (Supabase/PostgreSQL)

### Tables Required

**health_metrics table:**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- date (date, not null)
- weight (decimal, optional)
- sleep_hours (decimal, optional)
- water_intake (decimal, optional)
- mood (varchar, optional: excellent/good/okay/bad/terrible)
- notes (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

**workouts table:**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- date (date, not null)
- type (varchar, not null: Running/Gym/Yoga/Swimming/Cycling/Other)
- duration_minutes (integer, not null)
- intensity (varchar, not null: low/medium/high)
- calories_burned (integer, optional)
- notes (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### Indexes
- Index on user_id and date for both tables
- Composite index on (user_id, date DESC) for efficient queries

## 2. Backend Implementation

### File Structure
```
backend/src/
├── controllers/
│   └── healthController.ts
├── models/
│   └── Health.ts
├── routes/
│   └── health.ts
└── types/
    └── Health.ts
```


### API Endpoints Required

#### Health Metrics Endpoints
- `GET /health/metrics` - Get all health metrics for authenticated user
- `POST /health/metrics` - Log new health metric
- `GET /health/metrics/:id` - Get specific health metric
- `PUT /health/metrics/:id` - Update health metric
- `DELETE /health/metrics/:id` - Delete health metric

#### Workouts Endpoints
- `GET /health/workouts` - Get all workouts for authenticated user
- `POST /health/workouts` - Log new workout
- `GET /health/workouts/:id` - Get specific workout
- `PUT /health/workouts/:id` - Update workout
- `DELETE /health/workouts/:id` - Delete workout

#### Summary Endpoint
- `GET /health/summary?period=week|month&startDate=YYYY-MM-DD` - Get comprehensive health summary
  - Returns: latest metrics, workout stats, trends, historical data for charts

### Controller Logic (healthController.ts)

**getMetrics:**
- Fetch all health metrics for user, ordered by date DESC
- Support optional date range filtering
- Return with proper error handling

**createMetric:**
- Validate input data (weight > 0, sleep_hours 0-24, water_intake >= 0)
- Check for duplicate entry on same date (update if exists)
- Insert into database
- Return created metric

**updateMetric:**
- Verify ownership (user_id matches)
- Validate input data
- Update database
- Return updated metric

**deleteMetric:**
- Verify ownership
- Delete from database
- Return success message


**getWorkouts:**
- Fetch all workouts for user, ordered by date DESC
- Support optional date range filtering
- Calculate total duration and calories
- Return with proper error handling

**createWorkout:**
- Validate input data (duration > 0, valid intensity, valid type)
- Insert into database
- Return created workout

**updateWorkout:**
- Verify ownership
- Validate input data
- Update database
- Return updated workout

**deleteWorkout:**
- Verify ownership
- Delete from database
- Return success message

**getSummary:**
- Fetch metrics and workouts for specified period
- Calculate aggregations:
  - Latest weight, average sleep, total water intake
  - Total workouts, total duration, total calories
  - Weight trend (change from period start)
  - Sleep trend (average vs previous period)
  - Workout frequency
- Prepare chart data (arrays of date/value pairs)
- Return comprehensive summary object

## 3. Frontend Implementation

### File Structure
```
frontend/src/
├── pages/dashboard/
│   └── HealthPage.tsx
├── components/health/
│   ├── MetricsCard.tsx
│   ├── WorkoutCard.tsx
│   ├── HealthChart.tsx
│   ├── MetricModal.tsx
│   ├── WorkoutModal.tsx
│   └── QuickActions.tsx
├── services/
│   └── health.ts
└── types/
    └── Health.ts
```


### TypeScript Types (Health.ts)

```typescript
interface HealthMetric {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  sleep_hours?: number;
  water_intake?: number;
  mood?: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';
  notes?: string;
  created_at: string;
}

interface Workout {
  id: string;
  user_id: string;
  date: string;
  type: string;
  duration_minutes: number;
  intensity: 'low' | 'medium' | 'high';
  calories_burned?: number;
  notes?: string;
  created_at: string;
}

interface HealthSummary {
  currentMetrics: {
    weight?: number;
    sleep?: number;
    water?: number;
    mood?: string;
  };
  workoutStats: {
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
  };
  trends: {
    weightChange: number;
    sleepAverage: number;
    workoutFrequency: number;
  };
  chartData: {
    weight: Array<{ date: string; value: number }>;
    sleep: Array<{ date: string; value: number }>;
    water: Array<{ date: string; value: number }>;
    workouts: Array<{ date: string; duration: number; calories: number }>;
  };
}
```

### API Service (health.ts)

Implement all CRUD operations:
- `getMetrics()` - Fetch all metrics
- `createMetric(data)` - Log new metric
- `updateMetric(id, data)` - Update metric
- `deleteMetric(id)` - Delete metric
- `getWorkouts()` - Fetch all workouts
- `createWorkout(data)` - Log new workout
- `updateWorkout(id, data)` - Update workout
- `deleteWorkout(id)` - Delete workout
- `getSummary(period, startDate)` - Get summary data


## 4. UI/UX Requirements (HealthPage.tsx)

### Design Aesthetic
- **Theme:** Dark mode with purple/pink/blue gradients
- **Background:** Gradient from gray-900 via purple-900 to gray-900
- **Cards:** Dark slate-800 with backdrop blur and border effects
- **Accent Colors:** Purple-500, Pink-600, Blue-500, Cyan-600
- **Typography:** White headings, gray-300 body text
- **Hover Effects:** Smooth transitions with shadow and border color changes

### Layout Structure

**Header Section:**
- Page title: "Health & Fitness" (4xl, bold, white)
- Two action buttons:
  - "Log Metric" (purple-to-pink gradient)
  - "Log Workout" (blue-to-cyan gradient)

**Stats Cards Grid (4 columns):**
1. Current Weight (purple gradient)
   - Display latest weight in kg
   - Show trend indicator (up/down arrow)
2. Last Sleep (blue gradient)
   - Display sleep hours
   - Show quality indicator
3. Total Workouts (green gradient)
   - Display count for period
   - Show frequency
4. Calories Burned (orange gradient)
   - Display total calories
   - Show daily average

**Charts Section (2 columns):**
1. Weight Trend Chart
   - Line chart with purple line
   - X-axis: dates, Y-axis: weight in kg
   - Smooth curve with dots
2. Sleep Pattern Chart
   - Line chart with blue line
   - X-axis: dates, Y-axis: hours
   - Show recommended sleep line (8h)

**Recent Activity Section (2 columns):**
1. Recent Metrics
   - Card list showing last 5 metrics
   - Display date, weight, sleep, water, mood
   - Edit/delete buttons
2. Recent Workouts
   - Card list showing last 5 workouts
   - Display date, type, duration, calories
   - Edit/delete buttons


### Interactive Features

**Metric Logging Modal:**
- Form fields:
  - Date picker (default: today)
  - Weight input (number, kg)
  - Sleep hours input (number, 0-24)
  - Water intake input (number, liters)
  - Mood selector (dropdown with emojis)
  - Notes textarea (optional)
- Validation:
  - At least one metric must be filled
  - Weight > 0 if provided
  - Sleep 0-24 if provided
  - Water >= 0 if provided
- Submit button: "Log Metric"
- Cancel button

**Workout Logging Modal:**
- Form fields:
  - Date picker (default: today)
  - Workout type (dropdown: Running, Gym, Yoga, Swimming, Cycling, Other)
  - Duration (number, minutes, required)
  - Intensity (radio buttons: Low/Medium/High)
  - Calories burned (number, optional)
  - Notes textarea (optional)
- Validation:
  - Type and duration required
  - Duration > 0
  - Calories >= 0 if provided
- Submit button: "Log Workout"
- Cancel button

**Date Range Filter:**
- Tabs: Week / Month / Custom
- Week: Last 7 days
- Month: Last 30 days
- Custom: Date range picker
- Updates all charts and stats

**Quick Actions Panel:**
- Quick buttons for common actions:
  - "Log Weight" - Opens metric modal with weight field focused
  - "Log Sleep" - Opens metric modal with sleep field focused
  - "Log Water" - Opens metric modal with water field focused
  - "Quick Workout" - Opens workout modal
- Positioned as floating action buttons or sidebar

**Progress Indicators:**
- Daily goals section:
  - Water goal: 2L (circular progress)
  - Sleep goal: 8h (circular progress)
  - Workout goal: 30min (circular progress)
- Show percentage completion
- Motivational messages based on progress


### Chart Specifications (Using Recharts)

**Weight Trend Chart:**
- Type: LineChart
- Data: Array of {date, weight}
- Line color: #a855f7 (purple)
- Stroke width: 2
- Dots: Visible, filled
- Grid: Dashed, subtle
- Tooltip: Dark theme, shows date and weight
- Responsive container: 100% width, 250px height

**Sleep Pattern Chart:**
- Type: LineChart
- Data: Array of {date, hours}
- Line color: #3b82f6 (blue)
- Stroke width: 2
- Dots: Visible, filled
- Reference line at 8 hours (recommended)
- Grid: Dashed, subtle
- Tooltip: Dark theme, shows date and hours
- Responsive container: 100% width, 250px height

**Water Intake Chart (Optional Enhancement):**
- Type: AreaChart
- Data: Array of {date, liters}
- Fill: Gradient from cyan to transparent
- Line color: #06b6d4 (cyan)
- Goal line at 2L

**Workout Chart (Optional Enhancement):**
- Type: BarChart
- Data: Array of {date, duration, calories}
- Bars: Duration (blue), Calories (orange)
- Stacked or grouped
- Tooltip shows both values

### Responsive Design

**Desktop (>1024px):**
- 4-column stats grid
- 2-column charts section
- 2-column recent activity
- Full-width modals (max 600px)

**Tablet (768px-1024px):**
- 2-column stats grid
- 1-column charts (stacked)
- 1-column recent activity
- Full-width modals

**Mobile (<768px):**
- 1-column layout throughout
- Stacked stats cards
- Stacked charts
- Stacked recent activity
- Full-screen modals
- Touch-friendly buttons (min 44px height)


## 5. State Management

### React State Structure
```typescript
const [metrics, setMetrics] = useState<HealthMetric[]>([]);
const [workouts, setWorkouts] = useState<Workout[]>([]);
const [summary, setSummary] = useState<HealthSummary | null>(null);
const [loading, setLoading] = useState(true);
const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
const [period, setPeriod] = useState<'week' | 'month'>('week');
const [filter, setFilter] = useState<'all' | 'metrics' | 'workouts'>('all');
```

### Data Flow
1. Component mounts → Load summary data
2. User clicks "Log Metric" → Open modal
3. User submits form → POST to API → Reload data
4. User changes period → Fetch new summary
5. User clicks edit → Populate modal with data
6. User clicks delete → Confirm → DELETE to API → Reload data

## 6. Error Handling

### Backend
- Validate all inputs
- Return appropriate HTTP status codes
- Provide clear error messages
- Handle database errors gracefully

### Frontend
- Show loading spinners during API calls
- Display error messages in toasts/alerts
- Handle network errors
- Validate forms before submission
- Show empty states when no data

## 7. Performance Optimizations

- Debounce search/filter inputs
- Lazy load charts (only render when visible)
- Memoize expensive calculations
- Use React.memo for static components
- Optimize database queries with proper indexes
- Cache summary data (consider React Query)

## 8. Testing Checklist

### Backend
- [ ] All endpoints return correct data
- [ ] Authentication works on all routes
- [ ] Validation catches invalid inputs
- [ ] User can only access their own data
- [ ] Summary calculations are accurate

### Frontend
- [ ] All modals open/close correctly
- [ ] Forms validate properly
- [ ] Charts render with data
- [ ] Empty states show when no data
- [ ] Loading states work
- [ ] Edit/delete functions work
- [ ] Date range filter updates data
- [ ] Responsive on all screen sizes
- [ ] Mood emojis display correctly
- [ ] Currency/units format correctly

## 9. Deliverables

1. Complete SQL schema for health_metrics and workouts tables
2. Backend controllers, models, and routes
3. Frontend components and pages
4. API service layer
5. TypeScript types for all entities
6. Fully functional, styled UI matching design specs
7. All CRUD operations working
8. Charts displaying real data
9. Responsive design implemented
10. Error handling in place

## Success Criteria

✅ User can log health metrics (weight, sleep, water, mood)
✅ User can log workouts (type, duration, intensity, calories)
✅ User can view trends over time in charts
✅ User can edit and delete entries
✅ User can filter by date range
✅ UI matches dark theme aesthetic
✅ All interactions are smooth and responsive
✅ Data persists in database
✅ Only authenticated users can access
✅ Users can only see their own data
