import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { financesService } from '../../services/finances';
import { Transaction, FinanceSummary } from '../../types/Finance';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const COLORS = ['#22d3ee', '#f97316', '#a855f7', '#eab308', '#ef4444', '#10b981', '#3b82f6'];

export const FinancesPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    recurring: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, summaryData] = await Promise.all([
        financesService.getTransactions(),
        financesService.getSummary(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load finances:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTransaction = async () => {
    try {
      if (editingTransaction) {
        await financesService.updateTransaction(editingTransaction.id, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
      } else {
        await financesService.createTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }
      await loadData();
      closeModal();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Check console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await financesService.deleteTransaction(id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date,
        notes: transaction.notes || '',
        recurring: transaction.recurring,
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        recurring: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Income: 'bg-emerald-500/20 text-emerald-400',
      Food: 'bg-cyan-500/20 text-cyan-400',
      Bills: 'bg-amber-500/20 text-amber-400',
      Fun: 'bg-purple-500/20 text-purple-400',
      Transport: 'bg-blue-500/20 text-blue-400',
      Shopping: 'bg-pink-500/20 text-pink-400',
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading finances...</div>
      </div>
    );
  }

  const currentBalance = (summary?.totalIncome || 0) - (summary?.totalExpenses || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Personal Finance</h1>
            <p className="text-slate-400">Manage your transactions, budgets, and analyze your spending</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Current Balance</p>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{formatCurrency(currentBalance)}</p>
          <p className={`text-sm flex items-center gap-1 ${currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentBalance >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
            </svg>
            {currentBalance >= 0 ? '+2.5%' : '-2.5%'} from last month
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Monthly Income</p>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{formatCurrency(summary?.totalIncome || 0)}</p>
          <p className="text-emerald-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            +1.2% from last month
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-sm">Monthly Expenses</p>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{formatCurrency(summary?.totalExpenses || 0)}</p>
          <p className="text-red-400 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            -5.0% from last month
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending by Category */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-1">Spending by Category</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(summary?.totalExpenses || 0)}</p>
            <p className="text-red-400 text-sm">This Month -5.0%</p>
          </div>
          {summary && summary.categoryBreakdown.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {summary.categoryBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #22d3ee',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                    itemStyle={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                    labelStyle={{
                      color: '#22d3ee',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(value),
                      props.payload.category
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No expense data yet</p>
              <p className="text-sm text-slate-600 mt-1">Add transactions to see insights</p>
            </div>
          )}
        </div>

        {/* Income vs Expense */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-1">Income vs Expense</h3>
            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {currentBalance >= 0 ? '+' : ''}{formatCurrency(currentBalance)}
            </p>
            <p className={`text-sm ${currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              Last 6 Months {currentBalance >= 0 ? '+8.3%' : '-8.3%'}
            </p>
          </div>
          {summary ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Jan', income: 5200, expense: 3100 },
                    { name: 'Feb', income: 5400, expense: 3300 },
                    { name: 'Mar', income: 5100, expense: 2900 },
                    { name: 'Apr', income: 5800, expense: 3500 },
                    { name: 'May', income: 5600, expense: 3200 },
                    { name: 'Jun', income: summary.totalIncome, expense: summary.totalExpenses },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #22d3ee',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                    itemStyle={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '4px 0',
                    }}
                    labelStyle={{
                      color: '#22d3ee',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'income' ? 'Income' : 'Expense'
                    ]}
                  />
                  <Bar 
                    dataKey="income" 
                    fill="#22d3ee" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={1000}
                  />
                  <Bar 
                    dataKey="expense" 
                    fill="#64748b" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p>No data yet</p>
              <p className="text-sm text-slate-600 mt-1">Start tracking to see trends</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Transactions</h3>

        {transactions.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No transactions yet. Add your first transaction!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">DATE</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">DESCRIPTION</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">CATEGORY</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">TYPE</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-medium text-sm">AMOUNT</th>
                  <th className="text-right py-4 px-4 text-slate-400 font-medium text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4 text-slate-300">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 text-white">{transaction.notes || 'No description'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(transaction)}
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          footer={
            <>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTransaction}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                {editingTransaction ? 'Update' : 'Add'}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    className="mr-2"
                  />
                  Income
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    className="mr-2"
                  />
                  Expense
                </label>
              </div>
            </div>

            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            <Input
              label="Category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Food, Salary, Bills"
              required
            />

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
                placeholder="Optional description..."
              />
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Recurring transaction</span>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
};
