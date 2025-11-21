import { useState, useEffect } from 'react';
import { goalsService } from '../../services/goals';
import { Goal } from '../../types/Goal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalsService.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading goals...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Goals</h1>
        <Button>Add Goal</Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <p className="text-gray-600 text-center py-8">
            No goals yet. Start by creating your first goal!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <h3 className="font-semibold text-lg mb-2">{goal.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                  goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">{goal.progress_percentage}%</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
