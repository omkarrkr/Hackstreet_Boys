import { Goal } from '../../types/Goal';

interface GoalCardProps {
  goal: Goal;
  onView: (goal: Goal) => void;
}

export const GoalCard = ({ goal, onView }: GoalCardProps) => {
  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400',
  };

  const statusColors = {
    not_started: 'bg-gray-500/20 text-gray-400',
    in_progress: 'bg-cyan-500/20 text-cyan-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
  };

  const progressColor = goal.progress_percentage >= 80 ? 'bg-emerald-500' : 
                        goal.progress_percentage >= 50 ? 'bg-cyan-500' : 
                        'bg-cyan-600';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
          {goal.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${priorityColors[goal.priority]}`}>
          {goal.priority}
        </span>
      </div>

      {goal.description && (
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-sm font-semibold text-cyan-400">{goal.progress_percentage}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
            style={{ width: `${goal.progress_percentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        {goal.target_date && (
          <div className="flex items-center text-slate-400 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due: {new Date(goal.target_date).toLocaleDateString()}
          </div>
        )}
        
        <button
          onClick={() => onView(goal)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[goal.status]}`}>
          {goal.status === 'not_started' ? 'Not Started' : 
           goal.status === 'in_progress' ? 'In Progress' : 
           'Completed'}
        </span>
      </div>
    </div>
  );
};
