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
    { value: 'all', label: 'All', icon: '🌟', color: 'from-purple-500 to-pink-500' },
    { value: 'travel', label: 'Travel', icon: '✈️', color: 'from-blue-500 to-cyan-500' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️', color: 'from-orange-500 to-red-500' },
    { value: 'learning', label: 'Learning', icon: '📚', color: 'from-green-500 to-teal-500' },
    { value: 'personal', label: 'Personal', icon: '💫', color: 'from-indigo-500 to-purple-500' },
    { value: 'career', label: 'Career', icon: '💼', color: 'from-yellow-500 to-orange-500' },
    { value: 'health', label: 'Health', icon: '💪', color: 'from-pink-500 to-rose-500' },
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-3">
              My Bucket List
            </h1>
            <p className="text-slate-400 text-lg">Dream big and make it happen</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transform"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
            Add Dream
          </button>
        </div>

        {/* Stats */}
        {summary && summary.stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Total Dreams</div>
              <div className="text-3xl font-bold text-white">{summary.stats.total}</div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-400">{summary.stats.completed}</div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">In Progress</div>
              <div className="text-3xl font-bold text-blue-400">{summary.stats.in_progress}</div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Planning</div>
              <div className="text-3xl font-bold text-yellow-400">{summary.stats.planning}</div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Completion</div>
              <div className="text-3xl font-bold text-purple-400">{summary.stats.completion_percentage}%</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search your dreams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 whitespace-nowrap ${
                  categoryFilter === cat.value
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-slate-800/70 backdrop-blur-xl text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex gap-3">
            {['all', 'not_started', 'planning', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/40'
                    : 'bg-slate-800/70 backdrop-blur-xl text-slate-400 hover:text-white border border-slate-700/50'
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
