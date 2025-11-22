import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../../components/layout/NotificationBell';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  
  // Sample data for financial chart
  const financialData = [
    { value: 100000 },
    { value: 105000 },
    { value: 110000 },
    { value: 108000 },
    { value: 115000 },
    { value: 120000 },
    { value: 124830 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header with Greeting and Notification */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Good morning, {firstName}
        </h1>
        <NotificationBell />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Progress */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Goal Progress</h2>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View All</button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Launch New Project</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-slate-400 text-xs mt-1">3/5 Key Results</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Run a 10k</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-slate-400 text-xs mt-1">4.5/10 km</p>
            </div>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Financial Snapshot</h2>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View Details</button>
          </div>
          
          <div className="mb-4">
            <p className="text-slate-400 text-sm mb-1">Net Worth</p>
            <p className="text-3xl font-bold text-white">₹1,24,830.50</p>
          </div>

          <div className="h-32 bg-slate-900/50 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Tracker */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Habit Tracker</h2>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View All</button>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-3">Last 7 Days</p>
            <div className="flex gap-2">
              {[false, true, true, false, true, true, true].map((completed, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded ${
                    completed ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-medium mb-3">Today's Habits</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600" />
                <span>Morning workout</span>
              </label>
              <label className="flex items-center gap-3 text-slate-300">
                <input type="checkbox" checked className="w-4 h-4 rounded border-slate-600 bg-cyan-500" />
                <span>Read for 15 minutes</span>
              </label>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Today's Focus</h2>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View All Tasks</button>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-600 mt-0.5" />
              <div>
                <p className="text-white">Finalize Q3 report presentation</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-600 mt-0.5" />
              <div>
                <p className="text-white">Book flight tickets for conference</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-600 mt-0.5" />
              <div>
                <p className="text-white">Schedule dentist appointment</p>
              </div>
            </label>
          </div>
        </div>

        {/* Daily Health Metrics */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Daily Health Metrics</h2>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">View Dashboard</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-2xl font-bold text-white">8,450</p>
              <p className="text-slate-400 text-sm">Steps</p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <p className="text-2xl font-bold text-white">320</p>
              <p className="text-slate-400 text-sm">Calories</p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <p className="text-2xl font-bold text-white">45 <span className="text-sm">min</span></p>
              <p className="text-slate-400 text-sm">Workout</p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-2xl font-bold text-white">6/8</p>
              <p className="text-slate-400 text-sm">Glasses</p>
            </div>
          </div>
        </div>

        {/* Life Bucket List */}
        <div className="bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 mb-4 text-cyan-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Life Bucket List</h2>
          <p className="text-cyan-400 text-sm mb-4">7/50 Completed</p>
          <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
            View Bucket List →
          </button>
        </div>
      </div>
    </div>
  );
};
