import { useState, useEffect } from 'react';
import { healthService } from '../../services/health';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HealthMetric, Workout } from '../../types/Health';

export const HealthPage = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case 'excellent': return '😄';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'bad': return '😟';
      case 'terrible': return '😢';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Health & Fitness</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsMetricModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
            >
              + Log Metric
            </button>
            <button
              onClick={() => setIsWorkoutModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg"
            >
              + Log Workout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 shadow-xl">
            <p className="text-purple-100 text-sm mb-2">Current Weight</p>
            <p className="text-3xl font-bold text-white">
              {latestMetric?.weight ? `${latestMetric.weight} kg` : 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 shadow-xl">
            <p className="text-blue-100 text-sm mb-2">Last Sleep</p>
            <p className="text-3xl font-bold text-white">
              {latestMetric?.sleep_hours ? `${latestMetric.sleep_hours}h` : 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 shadow-xl">
            <p className="text-emerald-100 text-sm mb-2">Total Workouts</p>
            <p className="text-3xl font-bold text-white">{totalWorkouts}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 shadow-xl">
            <p className="text-orange-100 text-sm mb-2">Calories Burned</p>
            <p className="text-3xl font-bold text-white">{totalCalories}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {weightData.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Weight Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {sleepData.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Sleep Pattern</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white">Recent Metrics</h2>
            </div>
            <div className="p-6">
              {metrics.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No metrics logged yet</p>
              ) : (
                <div className="space-y-4">
                  {metrics.slice(0, 5).map((metric) => (
                    <div key={metric.id} className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 text-sm mb-2">
                        {new Date(metric.date).toLocaleDateString()}
                      </p>
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
                            <span className="text-white ml-2">{getMoodEmoji(metric.mood)} {metric.mood}</span>
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
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white">Recent Workouts</h2>
            </div>
            <div className="p-6">
              {workouts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No workouts logged yet</p>
              ) : (
                <div className="space-y-4">
                  {workouts.slice(0, 5).map((workout) => (
                    <div key={workout.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">{workout.type}</h3>
                        <span className="text-gray-400 text-sm">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
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
              <option value="excellent">😄 Excellent</option>
              <option value="good">🙂 Good</option>
              <option value="okay">😐 Okay</option>
              <option value="bad">😟 Bad</option>
              <option value="terrible">😢 Terrible</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
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
