import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const HealthPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Health & Fitness</h1>
        <Button>Log Metric</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Health Metrics">
          <p className="text-gray-600 text-center py-8">No metrics logged yet</p>
        </Card>

        <Card title="Workouts">
          <p className="text-gray-600 text-center py-8">No workouts logged yet</p>
        </Card>
      </div>
    </div>
  );
};
