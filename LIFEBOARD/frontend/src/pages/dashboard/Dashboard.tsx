import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {user?.full_name || user?.email}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Goals">
          <p className="text-gray-600">Track and achieve your goals</p>
        </Card>

        <Card title="Finances">
          <p className="text-gray-600">Manage your budget and expenses</p>
        </Card>

        <Card title="Habits">
          <p className="text-gray-600">Build better habits</p>
        </Card>

        <Card title="To-Dos">
          <p className="text-gray-600">Stay organized with tasks</p>
        </Card>

        <Card title="Health">
          <p className="text-gray-600">Track your fitness journey</p>
        </Card>

        <Card title="Bucket List">
          <p className="text-gray-600">Dream big and plan adventures</p>
        </Card>
      </div>
    </div>
  );
};
