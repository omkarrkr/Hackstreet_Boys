# LifeBoard API Reference

Base URL: `http://localhost:5000`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

---

## Goals

### Get All Goals
```http
GET /goals
Authorization: Bearer <access_token>
```

### Create Goal
```http
POST /goals
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "description": "Master TypeScript for full-stack development",
  "category": "Education",
  "targetDate": "2024-12-31",
  "priority": "high",
  "status": "in_progress"
}
```

### Update Goal
```http
PUT /goals/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title",
  "progressPercentage": 50
}
```

### Delete Goal
```http
DELETE /goals/:id
Authorization: Bearer <access_token>
```

### Create Goal Step
```http
POST /goals/:id/steps
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete TypeScript basics course",
  "description": "Finish the fundamentals section",
  "deadline": "2024-06-30",
  "orderIndex": 1
}
```

### Get Goal Steps
```http
GET /goals/:id/steps
Authorization: Bearer <access_token>
```

### Generate AI Roadmap
```http
POST /goals/ai-roadmap
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "goalTitle": "Learn TypeScript",
  "description": "Master TypeScript for full-stack development",
  "timeframe": "6 months"
}
```

---

## Finances

### Get All Transactions
```http
GET /finances/transactions
Authorization: Bearer <access_token>
```

### Create Transaction
```http
POST /finances/transactions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "expense",
  "amount": 50.00,
  "category": "Food",
  "date": "2024-01-15",
  "notes": "Grocery shopping",
  "recurring": false
}
```

### Update Transaction
```http
PUT /finances/transactions/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 55.00,
  "notes": "Updated amount"
}
```

### Delete Transaction
```http
DELETE /finances/transactions/:id
Authorization: Bearer <access_token>
```

### Get Financial Summary
```http
GET /finances/summary?period=month
Authorization: Bearer <access_token>
```

### Get Budgets
```http
GET /finances/budget
Authorization: Bearer <access_token>
```

### Create Budget
```http
POST /finances/budget
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "category": "Food",
  "amount": 500.00,
  "period": "monthly"
}
```

---

## Habits

### Get All Habits
```http
GET /habits
Authorization: Bearer <access_token>
```

### Create Habit
```http
POST /habits
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Morning Exercise",
  "description": "30 minutes of cardio",
  "type": "good",
  "frequency": "daily",
  "targetCount": 1
}
```

### Update Habit
```http
PUT /habits/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated habit name",
  "currentStreak": 5
}
```

### Delete Habit
```http
DELETE /habits/:id
Authorization: Bearer <access_token>
```

### Log Habit Completion
```http
POST /habits/:id/log
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "completed": true,
  "notes": "Felt great today!"
}
```

### Get Habit Logs
```http
GET /habits/:id/logs
Authorization: Bearer <access_token>
```

---

## Tasks (To-Dos)

### Get All Tasks
```http
GET /tasks
Authorization: Bearer <access_token>
```

### Create Task
```http
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs",
  "dueDate": "2024-01-20",
  "priority": "high",
  "status": "todo",
  "goalId": "optional-goal-uuid"
}
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "completed",
  "priority": "medium"
}
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <access_token>
```

---

## Health

### Get Health Metrics
```http
GET /health/metrics
Authorization: Bearer <access_token>
```

### Create Health Metric
```http
POST /health/metrics
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "weight": 75.5,
  "sleepHours": 7.5,
  "waterIntake": 2.5,
  "mood": "great",
  "notes": "Feeling energized"
}
```

### Get Workouts
```http
GET /health/workouts
Authorization: Bearer <access_token>
```

### Create Workout
```http
POST /health/workouts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "type": "Running",
  "durationMinutes": 30,
  "intensity": "moderate",
  "caloriesBurned": 300,
  "notes": "Morning run in the park"
}
```

---

## Bucket List

### Get All Bucket Items
```http
GET /bucketlist
Authorization: Bearer <access_token>
```

### Create Bucket Item
```http
POST /bucketlist
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Visit Japan",
  "description": "Experience cherry blossom season in Tokyo",
  "category": "Travel",
  "targetDate": "2025-04-01",
  "status": "planning",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Update Bucket Item
```http
PUT /bucketlist/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "completed",
  "notes": "Amazing experience!"
}
```

### Delete Bucket Item
```http
DELETE /bucketlist/:id
Authorization: Bearer <access_token>
```

---

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `500` - Internal Server Error

## Common Field Values

### Priority
- `low`
- `medium`
- `high`

### Status (Goals/Tasks/Bucket Items)
- `not_started`
- `in_progress` / `todo`
- `completed` / `done`
- `planning` (bucket items)

### Transaction Type
- `income`
- `expense`

### Habit Type
- `good`
- `bad`

### Habit Frequency
- `daily`
- `weekly`
- `custom`

### Budget Period
- `monthly`
- `weekly`
- `yearly`

### Workout Intensity
- `low`
- `moderate`
- `high`
