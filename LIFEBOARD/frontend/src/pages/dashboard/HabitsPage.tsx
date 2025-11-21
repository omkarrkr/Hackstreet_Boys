import { useState, useEffect } from 'react';
import { habitsService } from '../../services/habits';
import { Habit } from '../../types/Habit';

interface HabitSummary extends Habit {
  completed_today: boolean;
  current_streak: number;
  longest_streak: number;
}

export const HabitsPage = () => {
  const [habits, setHabits] = useState<HabitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: 'good' | 'bad';
    frequency: 'daily' | 'weekly' | 'custom';
    target_count: number;
  }>({
    name: '',
    description: '',
    type: 'good',
    frequency: 'daily',
    target_count: 1,
  });

  useEffect(() => {
    loadHabits();
  }, [selectedDate]);

  const loadHabits = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await habitsService.getSummary(dateStr);
      setHabits(data);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsService.create(formData);
      setShowModal(false);
      resetForm();
      loadHabits();
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleToggleComplete = async (habitId: string, completed: boolean) => {
    try {
      if (!completed) {
        await habitsService.logHabit(habitId, {
          date: selectedDate.toISOString().split('T')[0],
          completed: true,
        });
      }
      loadHabits();
    } catch (error) {
      console.error('Failed to log habit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await habitsService.delete(id);
        loadHabits();
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'good',
      frequency: 'daily',
      target_count: 1,
    });
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newDate = new Date(dateValue + 'T00:00:00');
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
        setShowDatePicker(false);
      }
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setShowDatePicker(false);
  };

  const getFilteredHabits = () => {
    switch (filter) {
      case 'completed':
        return habits.filter(h => h.completed_today);
      case 'pending':
        return habits.filter(h => !h.completed_today);
      default:
        return habits;
    }
  };

  const filteredHabits = getFilteredHabits();

  const getHabitIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('read')) return '📚';
    if (lower.includes('workout') || lower.includes('exercise')) return '💪';
    if (lower.includes('meditate') || lower.includes('meditation')) return '🧘';
    if (lower.includes('water') || lower.includes('drink')) return '💧';
    if (lower.includes('sleep')) return '😴';
    if (lower.includes('code') || lower.includes('program')) return '💻';
    return '✨';
  };

  const getHabitColor = (index: number) => {
    const colors = [
      'from-cyan-500 to-blue-500',
      'from-blue-500 to-indigo-500',
      'from-purple-500 to-pink-500',
      'from-cyan-400 to-teal-500',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent mb-3">
              My Habits
            </h1>
            <p className="text-slate-400 text-lg">Track your progress and build better habits.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105 transform"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
            New Habit
          </button>
        </div>

        {/* Date Navigation and Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="relative flex items-center gap-3 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-4 shadow-xl">
            <button
              onClick={() => changeDate('prev')}
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transform"
            >
              <span className="text-xl font-bold">←</span>
            </button>
            
            <div className="flex flex-col items-center px-6">
              <div className="text-white font-bold text-2xl tracking-wide">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-teal-400 text-sm mt-1 font-medium">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
              </div>
            </div>
            
            <button
              onClick={() => changeDate('next')}
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transform"
            >
              <span className="text-xl font-bold">→</span>
            </button>
            
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent mx-2"></div>
            
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transform text-2xl relative"
            >
              📅
            </button>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-3 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl z-50 min-w-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-4">
                  <label className="text-slate-200 text-sm font-semibold">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 bg-slate-900/70 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-all"
                  />
                  <button
                    onClick={goToToday}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-xl transition-all font-semibold shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30"
                  >
                    Jump to Today
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="w-full bg-slate-700/70 hover:bg-slate-600 text-slate-300 py-3 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/40'
                  : 'bg-slate-800/70 backdrop-blur-xl text-slate-400 hover:text-white border border-slate-700/50 hover:border-teal-500/50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/40'
                  : 'bg-slate-800/70 backdrop-blur-xl text-slate-400 hover:text-white border border-slate-700/50 hover:border-teal-500/50'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/40'
                  : 'bg-slate-800/70 backdrop-blur-xl text-slate-400 hover:text-white border border-slate-700/50 hover:border-teal-500/50'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="relative z-10">
      {filteredHabits.length === 0 ? (
        <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-20 text-center bg-slate-800/30 backdrop-blur-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-5xl text-teal-400">+</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Create Your First Habit</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Start building positive routines today. Click the button to add a new habit and begin your journey.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105 transform"
          >
            Add a Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit, index) => (
            <div
              key={habit.id}
              className="group bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-teal-500/50 transition-all hover:shadow-2xl hover:shadow-teal-500/20 hover:scale-105 transform cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${getHabitColor(index)} rounded-xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform`}>
                <span className="text-3xl">{getHabitIcon(habit.name)}</span>
              </div>

              {/* Title and Frequency */}
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">{habit.name}</h3>
              <p className="text-slate-400 text-sm mb-4 capitalize font-medium">{habit.frequency}</p>

              {/* Streak */}
              {habit.current_streak > 0 ? (
                <div className="flex items-center gap-2 mb-4 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20">
                  <span className="text-orange-400 text-xl animate-pulse">🔥</span>
                  <span className="text-orange-400 font-bold">{habit.current_streak} day streak</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4 bg-slate-700/30 px-3 py-2 rounded-lg border border-slate-600/30">
                  <span className="text-slate-500 text-xl">⭕</span>
                  <span className="text-slate-500 text-sm font-medium">No streak yet</span>
                </div>
              )}

              {/* Progress Bar (for weekly habits) */}
              {habit.frequency === 'weekly' && (
                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((habit.current_streak / 7) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    {habit.current_streak} / 7 this week
                  </p>
                </div>
              )}

              {/* Completion Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleToggleComplete(habit.id, habit.completed_today)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                    habit.completed_today
                      ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/40 animate-pulse'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  <span className="text-xl font-bold">{habit.completed_today ? '✓' : '○'}</span>
                </button>

                <button
                  onClick={() => handleDelete(habit.id)}
                  className="text-slate-500 hover:text-red-400 transition-all text-2xl hover:scale-125 transform"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Create Habit Modal - Dark Theme */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => { setShowModal(false); resetForm(); }}
            />

            {/* Modal */}
            <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">Create New Habit</h2>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="text-3xl">×</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Morning Exercise"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-teal-500 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Why is this habit important to you?"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'good' | 'bad' })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="good">Good Habit (Build)</option>
                    <option value="bad">Bad Habit (Break)</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'custom' })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Target Count */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.target_count}
                    onChange={(e) => setFormData({ ...formData, target_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-teal-500/20"
                  >
                    Create Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
