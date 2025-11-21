import { useState, useEffect } from 'react';
import { Goal, GoalStep } from '../../types/Goal';
import { goalsService } from '../../services/goals';

interface GoalDetailModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const GoalDetailModal = ({ goal, isOpen, onClose, onSave }: GoalDetailModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'not_started' as 'not_started' | 'in_progress' | 'completed',
  });
  
  const [steps, setSteps] = useState<GoalStep[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        category: goal.category || '',
        target_date: goal.target_date || '',
        priority: goal.priority,
        status: goal.status,
      });
      loadSteps();
    } else {
      resetForm();
    }
  }, [goal]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      target_date: '',
      priority: 'medium',
      status: 'not_started',
    });
    setSteps([]);
    setNewStepTitle('');
  };

  const loadSteps = async () => {
    if (!goal) return;
    try {
      const data = await goalsService.getSteps(goal.id);
      setSteps(data);
    } catch (error) {
      console.error('Failed to load steps:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (goal) {
        await goalsService.update(goal.id, formData);
      } else {
        await goalsService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!goal || !confirm('Are you sure you want to delete this goal?')) return;
    
    setLoading(true);
    try {
      await goalsService.delete(goal.id);
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert('Failed to delete goal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = async () => {
    if (!goal || !newStepTitle.trim()) return;
    
    try {
      await goalsService.createStep(goal.id, {
        title: newStepTitle,
        order_index: steps.length + 1,
      });
      setNewStepTitle('');
      await loadSteps();
    } catch (error) {
      console.error('Failed to add step:', error);
    }
  };

  const handleToggleStep = async (step: GoalStep) => {
    if (!goal) return;
    
    try {
      await goalsService.updateStep(goal.id, step.id, {
        completed: !step.completed,
      });
      await loadSteps();
      onSave(); // Refresh goal list to show updated progress
    } catch (error) {
      console.error('Failed to toggle step:', error);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!goal || !confirm('Delete this step?')) return;
    
    try {
      await goalsService.deleteStep(goal.id, stepId);
      await loadSteps();
      onSave();
    } catch (error) {
      console.error('Failed to delete step:', error);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!formData.title) {
      alert('Please enter a goal title first');
      return;
    }
    
    setGeneratingRoadmap(true);
    try {
      const roadmapSteps = await goalsService.generateRoadmap({
        goalTitle: formData.title,
        description: formData.description,
      });
      
      if (goal) {
        // Add steps to existing goal
        for (const step of roadmapSteps) {
          await goalsService.createStep(goal.id, step);
        }
        await loadSteps();
      } else {
        // Show steps preview for new goal
        alert('Save the goal first, then generate a roadmap');
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      alert('Failed to generate roadmap');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {goal ? 'Edit Goal' : 'New Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="e.g., Run a 5k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              placeholder="Describe your goal..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g., Fitness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {goal && (
            <div className="border-t border-slate-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Goal Steps</h3>
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  disabled={generatingRoadmap}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {generatingRoadmap ? 'Generating...' : '✨ AI Roadmap'}
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg group hover:border-slate-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => handleToggleStep(step)}
                      className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                    />
                    <span className={`flex-1 ${step.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {step.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteStep(step.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStep())}
                  placeholder="Add a new step..."
                  className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            {goal && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
