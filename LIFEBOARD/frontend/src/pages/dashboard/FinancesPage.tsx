import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const FinancesPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Finances</h1>
        <Button>Add Transaction</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Income">
          <p className="text-3xl font-bold text-green-600">$0</p>
        </Card>
        <Card title="Total Expenses">
          <p className="text-3xl font-bold text-red-600">$0</p>
        </Card>
        <Card title="Net">
          <p className="text-3xl font-bold text-blue-600">$0</p>
        </Card>
      </div>

      <Card title="Recent Transactions">
        <p className="text-gray-600 text-center py-8">No transactions yet</p>
      </Card>
    </div>
  );
};
