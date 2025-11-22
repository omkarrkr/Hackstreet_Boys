import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../../components/layout/NotificationBell';
import { goalsService } from '../../services/goals';
import { tasksService } from '../../services/tasks';
import { financesService } from '../../services/finances';
import { habitsService } from '../../services/habits';
import { bucketlistService } from '../../services/bucketlist';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    goals: { total: 0, completed: 0, inProgress: 0, avgProgress: 0 },
    tasks: { total: 0, completed: 0, today: 0 },
    finances: { income: 0, expenses: 0, balance: 0 },
    habits: { total: 0, completedToday: 0, streak: 0 },
    bucketlist: { total: 0, completed: 0 },
  });
  
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [goals, tasks, summary, habits, bucketlist] = await Promise.all([
        goalsService.getAll().catch(() => []),
        tasksService.getAll().catch(() => []),
        financesService.getSummary().catch(() => ({ totalIncome: 0, totalExpenses: 0, net: 0 })),
        habitsService.getAll().catch(() => []),
        bucketlistService.getSummary().catch(() => ({ items: [], stats: { total: 0, completed: 0 } })),
      ]);

      setStats({
        goals: {
          total: goals.length,
          completed: goals.filter((g: any) => g.status === 'completed').length,
          inProgress: goals.filter((g: any) => g.status === 'in_progress').length,
          avgProgress: goals.length > 0 
            ? Math.round(goals.reduce((sum: number, g: any) => sum + g.progress_percentage, 0) / goals.length)
            : 0,
        },
        tasks: {
          total: tasks.length,
          completed: tasks.filter((t: any) => t.status === 'completed').length,
          today: tasks.filter((t: any) => t.status !== 'completed').length,
        },
        finances: {
          income: summary.totalIncome || 0,
          expenses: summary.totalExpenses || 0,
          balance: summary.net || 0,
        },
        habits: {
          total: habits.length,
          completedToday: habits.filter((h: any) => h.completed_today).length,
          streak: habits.length > 0 
            ? Math.max(...habits.map((h: any) => h.current_streak || 0))
            : 0,
        },
        bucketlist: {
          total: bucketlist.stats?.total || 0,
          completed: bucketlist.stats?.completed || 0,
        },
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header with Greeting and Notification */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-slate-400 mt-1">Here's your progress overview</p>
        </div>
        <NotificationBell />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Progress */}
        <Link to="/dashboard/goals" className="block bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Goals</h2>
            <span className="text-cyan-400 text-sm">View All →</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Goals</span>
              <span className="text-2xl font-bold text-white">{stats.goals.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">In Progress</span>
              <span className="text-xl font-semibold text-cyan-400">{stats.goals.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Completed</span>
              <span className="text-xl font-semibold text-emerald-400">{stats.goals.completed}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Average Progress</span>
                <span className="text-white">{stats.goals.avgProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${stats.goals.avgProgress}%` }}></div>
              </div>
            </div>
          </div>
        </Link>

        {/* Financial Snapshot */}
        <Link to="/dashboard/finances" className="block bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Finances</h2>
            <span className="text-cyan-400 text-sm">View Details →</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Current Balance</p>
              <p className={`text-3xl font-bold ${stats.finances.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ₹{stats.finances.balance.toFixed(2)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Income</p>
                <p className="text-lg font-semibold text-emerald-400">+₹{stats.finances.income.toFixed(2)}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Expenses</p>
                <p className="text-lg font-semibold text-red-400">-₹{stats.finances.expenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Habit Tracker */}
        <Link to="/dashboard/habits" className="block bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-teal-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Habits</h2>
            <span className="text-cyan-400 text-sm">View All →</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Habits</span>
              <span className="text-2xl font-bold text-white">{stats.habits.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Completed Today</span>
              <span className="text-xl font-semibold text-teal-400">{stats.habits.completedToday}/{stats.habits.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Best Streak</span>
              <span className="text-xl font-semibold text-orange-400">{stats.habits.streak} days 🔥</span>
            </div>
            {stats.habits.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Today's Progress</span>
                  <span className="text-white">{Math.round((stats.habits.completedToday / stats.habits.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${(stats.habits.completedToday / stats.habits.total) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Today's Tasks */}
        <Link to="/dashboard/todos" className="block bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Tasks</h2>
            <span className="text-cyan-400 text-sm">View All →</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Tasks</span>
              <span className="text-2xl font-bold text-white">{stats.tasks.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pending</span>
              <span className="text-xl font-semibold text-blue-400">{stats.tasks.today}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Completed</span>
              <span className="text-xl font-semibold text-emerald-400">{stats.tasks.completed}</span>
            </div>
            {stats.tasks.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Completion Rate</span>
                  <span className="text-white">{Math.round((stats.tasks.completed / stats.tasks.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(stats.tasks.completed / stats.tasks.total) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Health Metrics */}
        <Link to="/dashboard/health" className="block bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-pink-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Health</h2>
            <span className="text-cyan-400 text-sm">View Dashboard →</span>
          </div>
          
          <div className="text-center py-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-slate-400 mb-2">Track your fitness journey</p>
            <p className="text-sm text-cyan-400">Log metrics & workouts</p>
          </div>
        </Link>

        {/* Bucket List */}
        <Link to="/dashboard/bucketlist" className="block bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-yellow-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Bucket List</h2>
            <span className="text-cyan-400 text-sm">View All →</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Dreams</span>
              <span className="text-2xl font-bold text-white">{stats.bucketlist.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Completed</span>
              <span className="text-xl font-semibold text-yellow-400">{stats.bucketlist.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Remaining</span>
              <span className="text-xl font-semibold text-slate-400">{stats.bucketlist.total - stats.bucketlist.completed}</span>
            </div>
            {stats.bucketlist.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Achievement</span>
                  <span className="text-white">{Math.round((stats.bucketlist.completed / stats.bucketlist.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${(stats.bucketlist.completed / stats.bucketlist.total) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};
