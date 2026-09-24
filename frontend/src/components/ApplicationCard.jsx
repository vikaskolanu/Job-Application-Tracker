import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Banknote, 
  Clock, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Copy, 
  GripVertical,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import DeliveryStepper from './DeliveryStepper';
import TopicKnowledgeSection from './TopicKnowledgeSection';
import FileAttachmentSection from './FileAttachmentSection';

export default function ApplicationCard({
  application,
  onUpdate,
  onDelete,
  onDuplicate,
  onEdit,
  isDraggable = true,
  onCardDragStart,
  onCardDragOver,
  onCardDrop,
  cardIndex
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [animClass, setAnimClass] = useState('');

  const {
    id,
    company,
    role,
    type,
    compensation,
    duration,
    location,
    appliedDate,
    link,
    notes,
    status = 'active',
    stages = [],
    topics = [],
    attachments = []
  } = application;

  const handleStagesChange = (newStages) => {
    let updatedStatus = status;
    const hasRejected = newStages.some(s => s.status === 'rejected');
    const lastStage = newStages[newStages.length - 1];
    const isOfferCleared = lastStage && lastStage.status === 'completed';

    if (hasRejected) {
      updatedStatus = 'rejected';
      setAnimClass('ring-4 ring-red-400 scale-[0.98] transition-all duration-300');
    } else if (isOfferCleared) {
      updatedStatus = 'shortlisted';
      setAnimClass('ring-4 ring-emerald-400 scale-[1.01] transition-all duration-300');
    } else {
      updatedStatus = 'active';
      setAnimClass('');
    }

    setTimeout(() => {
      onUpdate(id, { stages: newStages, status: updatedStatus });
      setAnimClass('');
    }, 450);
  };

  const handleTopicsChange = (newTopics) => {
    onUpdate(id, { topics: newTopics });
  };

  const handleAttachmentsChange = (newAttachments) => {
    onUpdate(id, { attachments: newAttachments });
  };

  const handleStatusBadgeChange = (newStatus) => {
    onUpdate(id, { status: newStatus });
  };

  // Card status color styling
  const statusStyles = {
    active: {
      border: 'border-slate-200 hover:border-blue-400',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'In Progress'
    },
    shortlisted: {
      border: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Shortlisted / Offer'
    },
    rejected: {
      border: 'border-red-200 hover:border-red-400 bg-red-50/20',
      badge: 'bg-red-50 text-red-700 border-red-200',
      label: 'Rejected'
    },
    offer: {
      border: 'border-amber-200 hover:border-amber-400 bg-amber-50/20',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Offer Accepted'
    }
  };

  const currentStyle = statusStyles[status] || statusStyles.active;

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onCardDragStart && onCardDragStart(e, cardIndex)}
      onDragOver={(e) => onCardDragOver && onCardDragOver(e)}
      onDrop={(e) => onCardDrop && onCardDrop(e, cardIndex)}
      className={`relative bg-white rounded-xl shadow-xs hover:shadow-md border ${currentStyle.border} transition-all duration-300 group ${animClass}`}
    >
      {/* Top Header Section */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {/* Drag Handle */}
            <div 
              className="mt-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-0.5 rounded"
              title="Drag to reorder card"
            >
              <GripVertical size={16} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {company}
                </h3>

                {/* Campus Type Tag */}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  type === 'On-Campus'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {type || 'On-Campus'}
                </span>

                {/* Overall Status Badge */}
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${currentStyle.badge}`}>
                  {currentStyle.label}
                </span>
              </div>

              {/* Role */}
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {role || 'Software Engineer'}
              </p>
            </div>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(application)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                title="Edit Opportunity & Topics"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MoreVertical size={15} />
              </button>
            </div>

            {showMenu && (
              <div 
                className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    onEdit(application);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Edit3 size={13} /> Edit Opportunity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDuplicate(application);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Copy size={13} /> Duplicate Card
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    handleStatusBadgeChange('active');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                >
                  <Clock size={13} /> Set In Progress
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStatusBadgeChange('shortlisted');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={13} /> Mark Shortlisted
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStatusBadgeChange('rejected');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <XCircle size={13} /> Mark Rejected
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    onDelete(id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={13} /> Delete Card
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Company Details Meta Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs text-slate-600">
          {compensation && (
            <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
              <Banknote size={13} />
              <span>{compensation}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              <Clock size={12} />
              <span>{duration}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              <MapPin size={12} />
              <span>{location}</span>
            </div>
          )}
          {appliedDate && (
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Calendar size={11} />
              <span>Applied: {appliedDate}</span>
            </div>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-[11px]"
            >
              <ExternalLink size={11} />
              <span>Portal</span>
            </a>
          )}
        </div>
      </div>

      {/* Progress Trackdown Stepper */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-b border-slate-100">
        <DeliveryStepper
          stages={stages}
          onChange={handleStagesChange}
          companyName={company}
        />
      </div>

      {/* Bottom Sections: Topics & Attachments */}
      <div className="p-4 pt-3 space-y-3">
        {/* Required Topic Knowledge Section */}
        <TopicKnowledgeSection
          topics={topics}
          onChange={handleTopicsChange}
          onOpenEditModal={() => onEdit(application)}
        />

        {/* Attached Documents Section (Resume, Job Description, etc.) */}
        <FileAttachmentSection
          attachments={attachments}
          onUpdateAttachments={handleAttachmentsChange}
          onOpenEditModal={() => onEdit(application)}
        />

        {/* Notes preview toggle if present */}
        {notes && (
          <div className="pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium"
            >
              <FileText size={12} />
              <span>{showNotes ? 'Hide notes' : 'View notes & tips'}</span>
              {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showNotes && (
              <p className="mt-1.5 p-2 rounded-md bg-amber-50/60 border border-amber-100 text-slate-700 text-xs whitespace-pre-wrap">
                {notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
