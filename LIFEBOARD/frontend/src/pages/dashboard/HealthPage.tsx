import { useState, useEffect } from 'react';
import { healthService } from '../../services/health';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HealthMetric, Workout } from '../../types/Health';

export const HealthPage = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const [metricForm, setMetricForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    sleep_hours: '',
    water_intake: '',
    mood: 'good'
  });

  const [workoutForm, setWorkoutForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration_minutes: '',
    calories_burned: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsData, workoutsData] = await Promise.all([
        healthService.getMetrics(),
        healthService.getWorkouts()
      ]);
      setMetrics(metricsData);
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        date: metricForm.date,
        weight: metricForm.weight ? parseFloat(metricForm.weight) : undefined,
        sleep_hours: metricForm.sleep_hours ? parseFloat(metricForm.sleep_hours) : undefined,
        water_intake: metricForm.water_intake ? parseFloat(metricForm.water_intake) : undefined,
        mood: metricForm.mood || undefined
      };

      await healthService.createMetric(data);
      await loadData();
      setIsMetricModalOpen(false);
      setMetricForm({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        sleep_hours: '',
        water_intake: '',
        mood: 'good'
      });
    } catch (error) {
      console.error('Failed to save metric:', error);
    }
  };

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        date: workoutForm.date,
        type: workoutForm.type,
        duration_minutes: parseInt(workoutForm.duration_minutes),
        intensity: 'medium' as 'low' | 'medium' | 'high',
        calories_burned: workoutForm.calories_burned ? parseInt(workoutForm.calories_burned) : undefined,
        notes: workoutForm.notes || undefined
      };

      await healthService.createWorkout(data);
      await loadData();
      setIsWorkoutModalOpen(false);
      setWorkoutForm({
        date: new Date().toISOString().split('T')[0],
        type: '',
        duration_minutes: '',
        calories_burned: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to save workout:', error);
    }
  };

  const getMoodColor = (mood: string | null) => {
    switch (mood) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-cyan-400';
      case 'okay': return 'text-yellow-400';
      case 'bad': return 'text-orange-400';
      case 'terrible': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading health data...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const weightData = metrics
    .filter(m => m.weight)
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: m.weight
    }))
    .reverse();

  const sleepData = metrics
    .filter(m => m.sleep_hours)
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hours: m.sleep_hours
    }))
    .reverse();

  const latestMetric = metrics[0];
  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Health & Fitness</h1>
              <p className="text-slate-400">Track your health metrics and workout progress</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsMetricModalOpen(true)}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                + Log Metric
              </button>
              <button
                onClick={() => setIsWorkoutModalOpen(true)}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
              >
                + Log Workout
              </button>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'week'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'month'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <p className="text-slate-400 text-sm mb-2">Current Weight</p>
            <p className="text-3xl font-bold text-white">
              {latestMetric?.weight ? `${latestMetric.weight} kg` : 'N/A'}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <p className="text-slate-400 text-sm mb-2">Last Sleep</p>
            <p className="text-3xl font-bold text-white">
              {latestMetric?.sleep_hours ? `${latestMetric.sleep_hours}h` : 'N/A'}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <p className="text-slate-400 text-sm mb-2">Total Workouts</p>
            <p className="text-3xl font-bold text-white">{totalWorkouts}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
            <p className="text-slate-400 text-sm mb-2">Calories Burned</p>
            <p className="text-3xl font-bold text-white">{totalCalories}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {weightData.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Weight Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {sleepData.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Sleep Pattern</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <ReferenceLine y={8} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Recommended', fill: '#10b981', fontSize: 12 }} />
                  <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setIsMetricModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all border border-slate-600/50 hover:border-cyan-500/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              <span className="text-sm">Log Weight</span>
            </button>
            <button
              onClick={() => setIsMetricModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all border border-slate-600/50 hover:border-cyan-500/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              <span className="text-sm">Log Sleep</span>
            </button>
            <button
              onClick={() => setIsMetricModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all border border-slate-600/50 hover:border-cyan-500/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              <span className="text-sm">Log Water</span>
            </button>
            <button
              onClick={() => setIsWorkoutModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-all border border-slate-600/50 hover:border-cyan-500/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-sm">Quick Workout</span>
            </button>
          </div>
        </div>

        {/* Recent Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-2xl font-semibold text-white">Recent Metrics</h2>
            </div>
            <div className="p-6">
              {metrics.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No metrics logged yet</p>
              ) : (
                <div className="space-y-4">
                  {metrics.slice(0, 5).map((metric) => (
                    <div key={metric.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-300 text-sm">
                          {new Date(metric.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setMetricForm({
                                date: metric.date.split('T')[0],
                                weight: metric.weight?.toString() || '',
                                sleep_hours: metric.sleep_hours?.toString() || '',
                                water_intake: metric.water_intake?.toString() || '',
                                mood: metric.mood || 'good',
                                notes: metric.notes || ''
                              });
                              setIsMetricModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this metric?')) {
                                try {
                                  await healthService.deleteMetric(metric.id);
                                  await loadData();
                                } catch (error) {
                                  console.error('Failed to delete:', error);
                                }
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {metric.weight && (
                          <div>
                            <span className="text-gray-400">Weight:</span>
                            <span className="text-white ml-2">{metric.weight} kg</span>
                          </div>
                        )}
                        {metric.sleep_hours && (
                          <div>
                            <span className="text-gray-400">Sleep:</span>
                            <span className="text-white ml-2">{metric.sleep_hours}h</span>
                          </div>
                        )}
                        {metric.water_intake && (
                          <div>
                            <span className="text-gray-400">Water:</span>
                            <span className="text-white ml-2">{metric.water_intake}L</span>
                          </div>
                        )}
                        {metric.mood && (
                          <div>
                            <span className="text-gray-400">Mood:</span>
                            <span className={`ml-2 capitalize ${getMoodColor(metric.mood)}`}>{metric.mood}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-2xl font-semibold text-white">Recent Workouts</h2>
            </div>
            <div className="p-6">
              {workouts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No workouts logged yet</p>
              ) : (
                <div className="space-y-4">
                  {workouts.slice(0, 5).map((workout) => (
                    <div key={workout.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-600/50 hover:border-cyan-500/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{workout.type}</h3>
                          <span className="text-gray-400 text-sm">
                            {new Date(workout.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setWorkoutForm({
                                date: workout.date.split('T')[0],
                                type: workout.type,
                                duration_minutes: workout.duration_minutes.toString(),
                                intensity: workout.intensity,
                                calories_burned: workout.calories_burned?.toString() || '',
                                notes: workout.notes || ''
                              });
                              setIsWorkoutModalOpen(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this workout?')) {
                                try {
                                  await healthService.deleteWorkout(workout.id);
                                  await loadData();
                                } catch (error) {
                                  console.error('Failed to delete:', error);
                                }
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white ml-2">{workout.duration_minutes} min</span>
                        </div>
                        {workout.calories_burned && (
                          <div>
                            <span className="text-gray-400">Calories:</span>
                            <span className="text-white ml-2">{workout.calories_burned}</span>
                          </div>
                        )}
                      </div>
                      {workout.notes && (
                        <p className="text-gray-400 text-sm mt-2">{workout.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Modal */}
      <Modal
        isOpen={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
        title="Log Health Metric"
      >
        <form onSubmit={handleMetricSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={metricForm.date}
            onChange={(e) => setMetricForm({ ...metricForm, date: e.target.value })}
            required
          />

          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            value={metricForm.weight}
            onChange={(e) => setMetricForm({ ...metricForm, weight: e.target.value })}
          />

          <Input
            label="Sleep Hours"
            type="number"
            step="0.5"
            value={metricForm.sleep_hours}
            onChange={(e) => setMetricForm({ ...metricForm, sleep_hours: e.target.value })}
          />

          <Input
            label="Water Intake (L)"
            type="number"
            step="0.1"
            value={metricForm.water_intake}
            onChange={(e) => setMetricForm({ ...metricForm, water_intake: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
            <select
              value={metricForm.mood}
              onChange={(e) => setMetricForm({ ...metricForm, mood: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="okay">Okay</option>
              <option value="bad">Bad</option>
              <option value="terrible">Terrible</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Log Metric
            </button>
            <button
              type="button"
              onClick={() => setIsMetricModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Workout Modal */}
      <Modal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        title="Log Workout"
      >
        <form onSubmit={handleWorkoutSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={workoutForm.date}
            onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
            required
          />

          <Input
            label="Workout Type"
            value={workoutForm.type}
            onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
            placeholder="e.g., Running, Gym, Yoga"
            required
          />

          <Input
            label="Duration (minutes)"
            type="number"
            value={workoutForm.duration_minutes}
            onChange={(e) => setWorkoutForm({ ...workoutForm, duration_minutes: e.target.value })}
            required
          />

          <Input
            label="Calories Burned (optional)"
            type="number"
            value={workoutForm.calories_burned}
            onChange={(e) => setWorkoutForm({ ...workoutForm, calories_burned: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
            <textarea
              value={workoutForm.notes}
              onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Log Workout
            </button>
            <button
              type="button"
              onClick={() => setIsWorkoutModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
