# Frontend Implementation Examples

This document provides example implementations to help you build the frontend pages.

## Example 1: Login Page

```tsx
// LIFEBOARD/frontend/src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      login(response.accessToken, response.refreshToken, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LifeBoard</h1>
          <p className="text-gray-600 mt-2">Your Personal Operating System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

## Example 2: Dashboard Layout with Sidebar

```tsx
// LIFEBOARD/frontend/src/components/layout/DashboardShell.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const DashboardShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Goals', path: '/dashboard/goals', icon: '🎯' },
    { name: 'Finances', path: '/dashboard/finances', icon: '💰' },
    { name: 'Habits', path: '/dashboard/habits', icon: '✅' },
    { name: 'To-Dos', path: '/dashboard/todos', icon: '📝' },
    { name: 'Health', path: '/dashboard/health', icon: '💪' },
    { name: 'Bucket List', path: '/dashboard/bucketlist', icon: '🌟' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-2xl font-bold text-indigo-600">LifeBoard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
```

---

## Example 3: Goals Page with List and Create Form

```tsx
// LIFEBOARD/frontend/src/pages/dashboard/GoalsPage.tsx
import { useState, useEffect } from 'react';
import { goalsService } from '../../services/goals';
import { Goal } from '../../types/Goal';

export const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalsService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalsService.createGoal(formData);
      setShowForm(false);
      setFormData({ title: '', description: '', category: '', targetDate: '', priority: 'medium' });
      fetchGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsService.deleteGoal(id);
        fetchGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create Goal
            </button>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No goals yet. Create your first goal to get started!
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {goal.priority}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{goal.category}</span>
                <span>{goal.target_date}</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="flex-1 py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                >
                  Delete
                </button>
                <button className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

---

## Example 4: Reusable Card Component

```tsx
// LIFEBOARD/frontend/src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

// Usage:
// <Card>
//   <h2>Title</h2>
//   <p>Content</p>
// </Card>
```

---

## Example 5: Loading Spinner Component

```tsx
// LIFEBOARD/frontend/src/components/ui/LoadingSpinner.tsx
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};
```

---

## Example 6: Using Recharts for Visualization

```tsx
// Example: Simple bar chart for finances
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { category: 'Food', amount: 500 },
  { category: 'Transport', amount: 200 },
  { category: 'Entertainment', amount: 150 },
];

<BarChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="category" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="amount" fill="#4F46E5" />
</BarChart>
```

---

## Common Patterns

### 1. Fetching Data on Mount
```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getData();
      setData(data);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### 2. Form Handling
```tsx
const [formData, setFormData] = useState({ field1: '', field2: '' });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await apiService.create(formData);
};
```

### 3. Conditional Rendering
```tsx
{loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage message={error} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataList data={data} />
)}
```

---

## Tailwind CSS Quick Reference

### Layout
- `flex` - Flexbox
- `grid` - Grid
- `gap-4` - Gap between items
- `p-4` - Padding
- `m-4` - Margin
- `w-full` - Full width
- `h-screen` - Full viewport height

### Colors
- `bg-indigo-600` - Background color
- `text-white` - Text color
- `border-gray-300` - Border color

### Typography
- `text-xl` - Font size
- `font-bold` - Font weight
- `text-center` - Text alignment

### Spacing
- `space-y-4` - Vertical spacing between children
- `gap-4` - Gap in flex/grid

### Responsive
- `md:grid-cols-2` - 2 columns on medium screens
- `lg:grid-cols-3` - 3 columns on large screens

---

## Tips

1. **Start with the structure** - Get the layout working first
2. **Add functionality** - Then add the interactive features
3. **Style last** - Polish the design after it works
4. **Test frequently** - Check in the browser as you build
5. **Use components** - Break down into smaller, reusable pieces
6. **Handle errors** - Always show user-friendly error messages
7. **Add loading states** - Show spinners during API calls

---

## Next Steps

1. Copy these examples and adapt them to your needs
2. Start with LoginPage and RegisterPage
3. Build the DashboardShell layout
4. Implement one feature page at a time
5. Create reusable components as you go

Good luck! 🚀
