import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const BucketListPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bucket List</h1>
        <Button>Add Item</Button>
      </div>

      <Card>
        <p className="text-gray-600 text-center py-8">
          Your bucket list is empty. Start adding your dreams!
        </p>
      </Card>
    </div>
  );
};
