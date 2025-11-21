import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const HabitsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habits</h1>
        <Button>Add Habit</Button>
      </div>

      <Card>
        <p className="text-gray-600 text-center py-8">
          No habits tracked yet. Create your first habit!
        </p>
      </Card>
    </div>
  );
};
