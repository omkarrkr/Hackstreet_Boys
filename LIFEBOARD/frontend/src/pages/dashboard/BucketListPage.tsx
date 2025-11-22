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
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
    try {
      console.log('Submitting form data:', { ...formData, image_url: formData.image_url ? 'base64...' : 'none' });
      if (editingItem) {
        await bucketlistService.update(editingItem.id, formData);
      } else {
        await bucketlistService.create(formData);
      }
      setShowModal(false);
      resetForm();
      await loadBucketList();
    } catch (error: any) {
      console.error('Failed to save item:', error);
      alert(`Failed to save: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
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
    celebration.innerHTML = `
      <div class="animate-bounce">
        <svg class="w-32 h-32 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z"/>
          <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" clip-rule="evenodd"/>
        </svg>
      </div>
    `;
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
    const iconMap: Record<string, JSX.Element> = {
      travel: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      adventure: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      learning: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      personal: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      career: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      health: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    };
    return iconMap[category] || (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
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
          <div className="flex gap-3">
            <button
              onClick={() => alert('AI Analysis - Coming Soon!\n\nThis feature will analyze your bucket list items, suggest achievable goals, and provide personalized action plans.')}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Analysis
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <span className="text-xl">+</span>
              Add Dream
            </button>
          </div>
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
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Start Your Dream List</h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              What's on your bucket list? Add your dreams and start making them reality.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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
                  className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden cursor-pointer"
                  onClick={() => item.image_url && setShowImageModal(item.image_url)}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-white absolute inset-0';
                          fallback.innerHTML = `<div class="w-16 h-16">${parent.getAttribute('data-icon') || ''}</div>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="w-16 h-16">
                        {getCategoryIcon(item.category || 'travel')}
                      </div>
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
                    <div className="text-purple-400 ml-2">
                      {getCategoryIcon(item.category || 'travel')}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                  )}

                  {item.target_date && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Upload Image (Optional)</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Image size should be less than 5MB');
                            e.target.value = '';
                            return;
                          }
                          
                          // Compress and resize image
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              let width = img.width;
                              let height = img.height;
                              
                              // Resize if too large
                              const maxSize = 800;
                              if (width > height && width > maxSize) {
                                height = (height * maxSize) / width;
                                width = maxSize;
                              } else if (height > maxSize) {
                                width = (width * maxSize) / height;
                                height = maxSize;
                              }
                              
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, width, height);
                              
                              // Convert to base64 with compression
                              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                              setFormData({ ...formData, image_url: compressedBase64 });
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 file:cursor-pointer cursor-pointer"
                    />
                    {formData.image_url && (
                      <div className="relative">
                        <p className="text-xs text-slate-400 mb-2">Preview:</p>
                        <div className="relative h-40 bg-slate-800 rounded-lg overflow-hidden">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                    disabled={submitting}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {submitting ? 'Saving...' : (editingItem ? 'Update Dream' : 'Add Dream')}
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
