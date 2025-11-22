import { useState, useEffect } from 'react';
import { bucketlistService } from '../../services/bucketlist';
import { BucketItem } from '../../types/BucketList';

interface BucketListSummary {
  items: BucketItem[];
  stats: {
    total: number;
    completed: number;
    in_progress: number;
    planning: number;
    not_started: number;
    completion_percentage: number;
    by_category: Record<string, number>;
  };
}

export const BucketListPage = () => {
  const [summary, setSummary] = useState<BucketListSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BucketItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    target_date: string;
    status: 'not_started' | 'planning' | 'in_progress' | 'completed';
    image_url: string;
  }>({
    title: '',
    description: '',
    category: 'travel',
    target_date: '',
    status: 'not_started',
    image_url: '',
  });

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'travel', label: 'Travel' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'learning', label: 'Learning' },
    { value: 'personal', label: 'Personal' },
    { value: 'career', label: 'Career' },
    { value: 'health', label: 'Health' },
  ];

  useEffect(() => {
    loadBucketList();
  }, [categoryFilter, statusFilter]);

  const loadBucketList = async () => {
    try {
      const data = await bucketlistService.getSummary(
        categoryFilter === 'all' ? undefined : categoryFilter,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setSummary(data);
    } catch (error) {
      console.error('Failed to load bucket list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await bucketlistService.update(editingItem.id, formData);
      } else {
        await bucketlistService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadBucketList();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await bucketlistService.updateStatus(id, status);
      loadBucketList();
      
      // Show celebration for completed items
      if (status === 'completed') {
        showCelebration();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dream?')) {
      try {
        await bucketlistService.delete(id);
        loadBucketList();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleEdit = (item: BucketItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category || 'travel',
      target_date: item.target_date || '',
      status: item.status,
      image_url: item.image_url || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'travel',
      target_date: '',
      status: 'not_started',
      image_url: '',
    });
    setEditingItem(null);
  };

  const showCelebration = () => {
    // Simple celebration effect
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    celebration.innerHTML = '<div class="text-8xl animate-bounce">🎉</div>';
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 2000);
  };

  const getFilteredItems = () => {
    if (!summary) return [];
    return summary.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'in_progress': return 'from-blue-500 to-cyan-500';
      case 'planning': return 'from-yellow-500 to-orange-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '🌟';
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading bucket list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My Bucket List
            </h1>
            <p className="text-slate-400">Dream big and make it happen</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/30"
          >
            <span className="text-xl">+</span>
            Add Item
          </button>
        </div>

        {/* Stats */}
        {summary && summary.stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
              <div className="text-slate-400 text-sm mb-1">Total Items</div>
              <div className="text-3xl font-bold text-white">{summary.stats.total}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
              <div className="text-slate-400 text-sm mb-1">Completed</div>
              <div className="text-3xl font-bold text-white">{summary.stats.completed}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
              <div className="text-slate-400 text-sm mb-1">In Progress</div>
              <div className="text-3xl font-bold text-white">{summary.stats.in_progress}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
              <div className="text-slate-400 text-sm mb-1">Planning</div>
              <div className="text-3xl font-bold text-white">{summary.stats.planning}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
              <div className="text-slate-400 text-sm mb-1">Completion</div>
              <div className="text-3xl font-bold text-white">{summary.stats.completion_percentage}%</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search your bucket list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  categoryFilter === cat.value
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-cyan-500/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {['all', 'not_started', 'planning', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-cyan-500/50'
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bucket List Grid */}
      <div className="relative z-10">
        {filteredItems.length === 0 ? (
          <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-20 text-center bg-slate-800/30 backdrop-blur-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-5xl">✨</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Start Your Dream List</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              What's on your bucket list? Add your dreams and start making them reality.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transform"
            >
              Add Your First Dream
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transform cursor-pointer"
              >
                {/* Image */}
                <div 
                  className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden"
                  onClick={() => item.image_url && setShowImageModal(item.image_url)}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Dream';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(item.category || 'travel')}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusColor(item.status)} text-white shadow-lg`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors flex-1">
                      {item.title}
                    </h3>
                    <span className="text-2xl ml-2">{getCategoryIcon(item.category || 'travel')}</span>
                  </div>

                  {item.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                  )}

                  {item.target_date && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <span>📅</span>
                      <span>{new Date(item.target_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="flex-1 bg-slate-700/70 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => { setShowModal(false); resetForm(); }}
            />
            <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">{editingItem ? 'Edit Dream' : 'Add New Dream'}</h2>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="text-3xl">×</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Visit Japan"
                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your dream..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      {categories.filter(c => c.value !== 'all').map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Target Date</label>
                    <input
                      type="date"
                      value={formData.target_date}
                      onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-purple-500/20"
                  >
                    {editingItem ? 'Update Dream' : 'Add Dream'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(null)}>
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
          <img
            src={showImageModal}
            alt="Full size"
            className="relative max-w-full max-h-full rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
