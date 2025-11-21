import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const TodosPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <Button>Add Task</Button>
      </div>

      <Card>
        <p className="text-gray-600 text-center py-8">
          No tasks yet. Add your first task to get started!
        </p>
      </Card>
    </div>
  );
};
