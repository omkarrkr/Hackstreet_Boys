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
    if (lower.includes('read')) return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
    if (lower.includes('workout') || lower.includes('exercise')) return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
      </svg>
    );
    if (lower.includes('meditate') || lower.includes('meditation')) return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    if (lower.includes('water') || lower.includes('drink')) return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    );
    if (lower.includes('sleep')) return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
    if (lower.includes('code') || lower.includes('program')) return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
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
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <span className="text-xl">+</span>
            New Habit
          </button>
        </div>

        {/* Date Navigation and Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-20 mb-6">
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
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transform relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-3 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl z-[100] min-w-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
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
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg transition-colors font-medium"
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
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700 hover:border-teal-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700 hover:border-teal-600'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700 hover:border-teal-600'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="relative z-0">
      {filteredHabits.length === 0 ? (
        <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-20 text-center bg-slate-800/30 backdrop-blur-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Create Your First Habit</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Start building positive routines today. Click the button to add a new habit and begin your journey.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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
              <div className={`w-14 h-14 bg-gradient-to-br ${getHabitColor(index)} rounded-xl flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform text-white`}>
                {getHabitIcon(habit.name)}
              </div>

              {/* Title and Frequency */}
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">{habit.name}</h3>
              <p className="text-slate-400 text-sm mb-4 capitalize font-medium">{habit.frequency}</p>

              {/* Streak */}
              {habit.current_streak > 0 ? (
                <div className="flex items-center gap-2 mb-4 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20">
                  <svg className="w-5 h-5 text-orange-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c1.5 3 4 4 7 4-3.5 3.5-3.5 8.5 0 12-4 0-7-2.5-7-6 0 0 0 0 0 0-1 2-3 3-5 3 1-3 0-5-2-7 2-1 3-2.5 3-4.5C8 1.5 10 0 12 2z" />
                  </svg>
                  <span className="text-orange-400 font-bold">{habit.current_streak} day streak</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4 bg-slate-700/30 px-3 py-2 rounded-lg border border-slate-600/30">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
                  {habit.completed_today ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(habit.id)}
                  className="text-slate-500 hover:text-red-400 transition-all hover:scale-125 transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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
