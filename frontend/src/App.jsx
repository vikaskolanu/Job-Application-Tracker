import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import ApplicationCard from './components/ApplicationCard';
import ApplicationModal from './components/ApplicationModal';
import { api } from './api';
import { Plus, FilterX, CheckCircle2, XCircle, ArrowRight, X, Briefcase } from 'lucide-react';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('active'); // Default to In Progress on Home Page!
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Drag and drop cards reordering state
  const [draggedCardIdx, setDraggedCardIdx] = useState(null);

  // Load applications
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create or Update
  const handleSaveApplication = async (appData) => {
    if (appData.id && applications.some(a => a.id === appData.id)) {
      const updated = await api.updateApplication(appData.id, appData);
      setApplications(prev => prev.map(a => a.id === appData.id ? { ...a, ...updated } : a));
    } else {
      const created = await api.createApplication(appData);
      setApplications(prev => [created, ...prev]);
    }
  };

  const handleUpdate = async (id, updates) => {
    const existing = applications.find(a => a.id === id);
    const prevStatus = existing?.status;
    const newStatus = updates.status;

    // Optimistic update
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

    // Show toast feedback if section changed
    if (newStatus && prevStatus && newStatus !== prevStatus) {
      const companyName = existing?.company || 'Application';
      if (newStatus === 'shortlisted' || newStatus === 'offer') {
        setToast({
          message: `🎉 ${companyName} moved to Shortlisted / Offers!`,
          targetStatus: 'shortlisted',
          color: 'bg-emerald-600 text-white'
        });
      } else if (newStatus === 'rejected') {
        setToast({
          message: `${companyName} moved to Rejected section.`,
          targetStatus: 'rejected',
          color: 'bg-slate-800 text-white'
        });
      }
    }

    try {
      await api.updateApplication(id, updates);
    } catch (err) {
      console.error('Update failed:', err);
      loadApplications();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this application?')) {
      setApplications(prev => prev.filter(a => a.id !== id));
      await api.deleteApplication(id);
    }
  };

  const handleDuplicate = async (app) => {
    const clone = {
      ...app,
      id: `app-${Date.now()}`,
      company: `${app.company} (Copy)`,
      order: applications.length
    };
    const created = await api.createApplication(clone);
    setApplications(prev => [created, ...prev]);
  };

  const handleEdit = (app) => {
    setModalInitialData(app);
    setIsModalOpen(true);
  };

  const handleResetSeed = async () => {
    if (window.confirm('Reset tracker to empty state to start fresh?')) {
      const reset = await api.resetSeedData();
      setApplications(reset || []);
      setStatusFilter('active');
    }
  };

  const handleLoadSample = async () => {
    const sample = await api.loadSampleTemplate();
    setApplications(sample || []);
    setStatusFilter('active');
  };

  // Card Drag and Drop in Grid view
  const handleCardDragStart = (e, idx) => {
    setDraggedCardIdx(idx);
    e.dataTransfer.setData('text/plain', idx);
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
  };

  const handleCardDrop = async (e, targetIdx) => {
    e.preventDefault();
    if (draggedCardIdx === null || draggedCardIdx === targetIdx) return;

    const newApps = [...applications];
    const [draggedApp] = newApps.splice(draggedCardIdx, 1);
    newApps.splice(targetIdx, 0, draggedApp);

    setApplications(newApps);
    setDraggedCardIdx(null);

    // Persist reorder
    const ids = newApps.map(a => a.id);
    await api.reorderApplications(ids);
  };

  // Filtering
  const filteredApplications = applications.filter((app) => {
    // Search query match
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchCompany = app.company?.toLowerCase().includes(q);
      const matchRole = app.role?.toLowerCase().includes(q);
      const matchTopics = (app.topics || []).some(t => t.name?.toLowerCase().includes(q));
      const matchStages = (app.stages || []).some(s => s.name?.toLowerCase().includes(q));
      if (!matchCompany && !matchRole && !matchTopics && !matchStages) {
        return false;
      }
    }

    // Campus type
    if (typeFilter !== 'All' && app.type !== typeFilter) {
      return false;
    }

    // Status Section filter (In Progress by default on Home Page)
    if (statusFilter !== 'All') {
      if (statusFilter === 'active' && app.status !== 'active') return false;
      if (statusFilter === 'shortlisted' && app.status !== 'shortlisted' && app.status !== 'offer') return false;
      if (statusFilter === 'rejected' && app.status !== 'rejected') return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header and Filter Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onOpenAddModal={() => {
          setModalInitialData(null);
          setIsModalOpen(true);
        }}
        onResetSeed={handleResetSeed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Interactive Stats & Section Switcher */}
        <StatsBar
          applications={applications}
          currentStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">
              {statusFilter === 'active'
                ? 'In Progress Applications'
                : statusFilter === 'shortlisted'
                  ? 'Shortlisted / Offers'
                  : statusFilter === 'rejected'
                    ? 'Rejected Applications'
                    : 'All Applications'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredApplications.length}
            </span>
          </div>

          {statusFilter !== 'active' && (
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>← Back to In Progress (Home)</span>
            </button>
          )}
        </div>

        {/* Content Cards Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Fresh Onboarding Empty State */
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto my-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Welcome to Job Application Tracker
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Start fresh by tracking your job applications. Track interview rounds from Online Assessment to Offer Received, schedule dates, maintain preparation checklists, and attach resumes & JDs.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setModalInitialData(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Plus size={16} strokeWidth={2.5} /> Track First Application
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full sm:w-auto text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
                title="Load sample applications to preview features"
              >
                Load Sample Templates
              </button>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <FilterX size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {statusFilter === 'active'
                ? 'No active applications in progress'
                : statusFilter === 'shortlisted'
                  ? 'No shortlisted or offer applications yet'
                  : statusFilter === 'rejected'
                    ? 'No rejected applications'
                    : 'No applications found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {statusFilter === 'active'
                ? 'All your applications are either shortlisted or completed. Click "+ Track Application" to add a new company.'
                : 'Click "In Progress" above to return to your active applications.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {statusFilter !== 'active' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                >
                  View In Progress
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setModalInitialData(null);
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Company
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid View with Drag & Drop reordering */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredApplications.map((app, idx) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onEdit={handleEdit}
                cardIndex={idx}
                onCardDragStart={handleCardDragStart}
                onCardDragOver={handleCardDragOver}
                onCardDrop={handleCardDrop}
              />
            ))}
          </div>
        )}
      </main>

      {/* Toast Notification when card moves section */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`${toast.color} px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold`}>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => {
                setStatusFilter(toast.targetStatus);
                setToast(null);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight size={12} />
            </button>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-white/70 hover:text-white ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-center text-xs text-slate-500">
        <p>
          Job Application Tracker • Track interview stages, schedule dates & prepare topics
        </p>
      </footer>

      {/* Add / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalInitialData(null);
        }}
        onSave={handleSaveApplication}
        initialData={modalInitialData}
      />
    </div>
  );
}
