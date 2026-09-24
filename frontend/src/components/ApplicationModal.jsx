import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Building2, 
  Briefcase, 
  MapPin, 
  Paperclip, 
  FileCheck, 
  FileText,
  Upload,
  Check
} from 'lucide-react';
import { COMMON_TOPICS, DEFAULT_STAGES_TEMPLATE } from '../constants/topics';

export default function ApplicationModal({ isOpen, onClose, onSave, initialData }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState('On-Campus');
  const [compensation, setCompensation] = useState('');
  const [duration, setDuration] = useState('6 months');
  const [location, setLocation] = useState('Bengaluru');
  const [appliedDate, setAppliedDate] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [stages, setStages] = useState(DEFAULT_STAGES_TEMPLATE);
  const [topics, setTopics] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const fileInputRef = useRef(null);
  const [uploadType, setUploadType] = useState('resume');

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setRole(initialData.role || '');
      setType(initialData.type || 'On-Campus');
      setCompensation(initialData.compensation || '');
      setDuration(initialData.duration || '');
      setLocation(initialData.location || '');
      setAppliedDate(initialData.appliedDate || '');
      setLink(initialData.link || '');
      setNotes(initialData.notes || '');
      setStages(initialData.stages?.length ? initialData.stages : DEFAULT_STAGES_TEMPLATE);
      setTopics(initialData.topics || []);
      setAttachments(initialData.attachments || []);
    } else {
      // Defaults for new application
      setCompany('');
      setRole('Software Engineer Intern');
      setType('On-Campus');
      setCompensation('');
      setDuration('6 months');
      setLocation('Bengaluru');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setLink('');
      setNotes('');
      setStages([
        { id: 'st-1', name: 'Online Assessment (OA)', date: '', status: 'pending', notes: '' },
        { id: 'st-2', name: 'Technical Interview 1', date: '', status: 'pending', notes: '' },
        { id: 'st-3', name: 'Technical Interview 2', date: '', status: 'pending', notes: '' },
        { id: 'st-4', name: 'HR Interview', date: '', status: 'pending', notes: '' },
        { id: 'st-5', name: 'Offer Received', date: '', status: 'pending', notes: '' }
      ]);
      setTopics([
        { id: 'top-1', name: 'DSA', selected: true },
        { id: 'top-2', name: 'Operating System (OS)', selected: false },
        { id: 'top-3', name: 'System Design', selected: false },
        { id: 'top-4', name: 'DBMS + SQL', selected: false }
      ]);
      setAttachments([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim()) return;

    onSave({
      ...(initialData || {}),
      company: company.trim(),
      role: role.trim(),
      type,
      compensation: compensation.trim(),
      duration: duration.trim(),
      location: location.trim(),
      appliedDate,
      link: link.trim(),
      notes: notes.trim(),
      stages,
      topics,
      attachments
    });

    onClose();
  };

  const handleAddStage = () => {
    setStages([
      ...stages,
      {
        id: `st-${Date.now()}`,
        name: `Round ${stages.length + 1}`,
        date: '',
        status: 'pending',
        notes: ''
      }
    ]);
  };

  const handleRemoveStage = (idx) => {
    if (stages.length <= 1) return;
    setStages(stages.filter((_, i) => i !== idx));
  };

  const handleUpdateStage = (idx, field, value) => {
    const updated = [...stages];
    updated[idx] = { ...updated[idx], [field]: value };
    setStages(updated);
  };

  const handleTogglePresetTopic = (name) => {
    if (topics.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      setTopics(topics.filter(t => t.name.toLowerCase() !== name.toLowerCase()));
    } else {
      setTopics([...topics, { id: `top-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, name, selected: false }]);
    }
  };

  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    const val = customTopicInput.trim();
    if (!val) return;
    if (!topics.some(t => t.name.toLowerCase() === val.toLowerCase())) {
      setTopics([...topics, { id: `top-${Date.now()}`, name: val, selected: false }]);
    }
    setCustomTopicInput('');
  };

  const handleRemoveTopic = (topicId) => {
    setTopics(topics.filter(t => t.id !== topicId));
  };

  // Attachments Handling
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const newAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: uploadType,
        size: formattedSize,
        url: dataUrl,
        uploaded_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };

      setAttachments([...attachments, newAttachment]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (attId) => {
    setAttachments(attachments.filter(a => a.id !== attId));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Opportunity' : 'Add New Opportunity'}
              </h2>
              <p className="text-xs text-slate-500">
                Manage company details, stages, topics & document attachments
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Company & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tesco Bengaluru, Nokia, Amgen"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role / Position
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer Intern, Full Stack"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Type, Compensation, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="On-Campus">On-Campus</option>
                <option value="Off-Campus">Off-Campus</option>
                <option value="Referral">Referral</option>
                <option value="Pool Campus">Pool Campus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compensation / Stipend
              </label>
              <input
                type="text"
                placeholder="e.g. ₹50,000 / mo or 17.5 LPA"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 6 months, Full Time"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location, Applied Date, Portal Link */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru, Remote, Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applied Date
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portal / Careers URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery Trackdown Stages */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Delivery Trackdown Stages
              </span>
              <button
                type="button"
                onClick={handleAddStage}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
              >
                <Plus size={13} /> Add Stage
              </button>
            </div>

            <div className="space-y-2">
              {stages.map((st, idx) => (
                <div key={st.id || idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={st.name}
                    placeholder="Round name (e.g. OA 2, Technical 1)"
                    onChange={(e) => handleUpdateStage(idx, 'name', e.target.value)}
                    className="text-xs font-medium px-2 py-1 border border-slate-200 rounded flex-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={st.date || ''}
                    placeholder="Date/Time (e.g. 26 Sep, 7pm)"
                    onChange={(e) => handleUpdateStage(idx, 'date', e.target.value)}
                    className="text-xs px-2 py-1 border border-slate-200 rounded w-36 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <select
                    value={st.status}
                    onChange={(e) => handleUpdateStage(idx, 'status', e.target.value)}
                    className="text-xs px-2 py-1 border border-slate-200 rounded bg-white focus:outline-none"
                  >
                    <option value="pending">Pending / Yet to commence</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Cleared / Shortlisted (✓)</option>
                    <option value="rejected">Rejected (✕)</option>
                  </select>
                  {stages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStage(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Required Topic Knowledge Section (Edit & Configure Topics) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Required Topic Knowledge (Configured for this Opportunity)
            </span>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {COMMON_TOPICS.map((topic) => {
                const isAdded = topics.some(t => t.name.toLowerCase() === topic.name.toLowerCase());
                return (
                  <button
                    key={topic.name}
                    type="button"
                    onClick={() => handleTogglePresetTopic(topic.name)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      isAdded
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isAdded ? '✓ ' : '+ '}
                    {topic.name}
                  </button>
                );
              })}
            </div>

            {/* Custom topic input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or type custom topic (e.g. Kafka, Flutter, Graph Algorithms) and press Enter..."
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTopic(e)}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg flex-1 bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTopic}
                className="text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg"
              >
                Add Topic
              </button>
            </div>

            {/* Active Selected Topics Summary */}
            {topics.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Currently added to this card ({topics.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map(t => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs text-slate-800"
                    >
                      <span>{t.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(t.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attached Files Section (Applied Resume & Job Description) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Paperclip size={14} className="text-slate-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Attach Documents (Resume & Job Description)
                </span>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setUploadType('resume');
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
              >
                <FileCheck size={14} />
                <span>+ Upload Applied Resume</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadType('jd');
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
              >
                <FileText size={14} />
                <span>+ Upload Job Description (JD)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Existing attachments list */}
            {attachments.length > 0 ? (
              <div className="space-y-1.5">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {att.type === 'resume' ? (
                        <FileCheck size={14} className="text-emerald-600" />
                      ) : (
                        <FileText size={14} className="text-blue-600" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">{att.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {att.type === 'resume' ? 'Applied Resume' : 'Job Description'} {att.size ? `• ${att.size}` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove attachment"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No documents attached yet. Attach your custom resume PDF or company JD for quick reference.
              </p>
            )}
          </div>

          {/* Prep Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preparation Notes, Tips & Reminders
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Focus on Dynamic Programming, HackerEarth platform, previous interview questions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-semibold px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
