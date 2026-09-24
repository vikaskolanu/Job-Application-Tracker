import React, { useState } from 'react';
import { 
  Check, 
  X, 
  RotateCcw, 
  Calendar, 
  Plus, 
  Trash2, 
  Clock
} from 'lucide-react';

export default function DeliveryStepper({ stages, onChange, companyName }) {
  const [editingDateStageId, setEditingDateStageId] = useState(null);
  const [dateInputValue, setDateInputValue] = useState('');
  const [draggedStageIdx, setDraggedStageIdx] = useState(null);

  const handleStatusChange = (stageId, newStatus) => {
    const updatedStages = stages.map((stage) => {
      if (stage.id === stageId) {
        // Toggle or set new status
        const status = stage.status === newStatus ? 'pending' : newStatus;
        return { ...stage, status };
      }
      return stage;
    });
    onChange(updatedStages);
  };

  const handleDateSave = (stageId) => {
    const updatedStages = stages.map((stage) => {
      if (stage.id === stageId) {
        return { ...stage, date: dateInputValue };
      }
      return stage;
    });
    onChange(updatedStages);
    setEditingDateStageId(null);
    setDateInputValue('');
  };

  const handleAddStage = () => {
    const stageNum = stages.length + 1;
    const newStage = {
      id: `stage-${Date.now()}`,
      name: `Round ${stageNum}`,
      date: '',
      status: 'pending',
      notes: ''
    };
    onChange([...stages, newStage]);
  };

  const handleDeleteStage = (stageId) => {
    if (stages.length <= 1) return;
    onChange(stages.filter(s => s.id !== stageId));
  };

  const handleStageNameEdit = (stageId, newName) => {
    onChange(stages.map(s => s.id === stageId ? { ...s, name: newName } : s));
  };

  // Drag and drop for stages
  const onDragStart = (e, index) => {
    setDraggedStageIdx(index);
    e.dataTransfer.setData('text/plain', index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedStageIdx === null || draggedStageIdx === targetIdx) return;
    const newStages = [...stages];
    const [draggedItem] = newStages.splice(draggedStageIdx, 1);
    newStages.splice(targetIdx, 0, draggedItem);
    onChange(newStages);
    setDraggedStageIdx(null);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Yet to commence';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: dateStr.includes(':') ? 'numeric' : undefined,
          minute: dateStr.includes(':') ? '2-digit' : undefined,
          hour12: true
        });
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  return (
    <div className="w-full py-2">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Application Trackdown
          </span>
          <span className="text-[11px] text-slate-400">
            ({stages.filter(s => s.status === 'completed').length}/{stages.length} cleared)
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddStage}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
          title="Add another interview or assessment round"
        >
          <Plus size={13} />
          Add Stage
        </button>
      </div>

      {/* Flipkart / Amazon delivery tracking stepper */}
      <div className="overflow-x-auto pb-3 pt-1">
        <div className="flex items-start min-w-[540px] px-2">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isRejected = stage.status === 'rejected';
            const isPending = !isCompleted && !isRejected;

            // Compute single unified connecting line to next stage
            const nextStage = stages[idx + 1];
            let connectorColor = 'bg-slate-200';
            if (nextStage) {
              if (nextStage.status === 'completed' && isCompleted) {
                connectorColor = 'bg-emerald-500';
              } else if (nextStage.status === 'rejected') {
                connectorColor = 'bg-red-500';
              } else {
                connectorColor = 'bg-slate-200';
              }
            }

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Node Container */}
                <div 
                  className="flex flex-col items-center flex-1 max-w-[140px] group relative"
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, idx)}
                >
                  {/* Node icon circle: NO BLINKERS. Greyed out when waiting. */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer select-none ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 hover:bg-emerald-600'
                          : isRejected
                            ? 'bg-red-500 text-white ring-4 ring-red-100 hover:bg-red-600'
                            : 'bg-slate-100 border-2 border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                      }`}
                      title={
                        isCompleted
                          ? `Cleared: ${stage.name}`
                          : isRejected
                            ? `Rejected at: ${stage.name}`
                            : `Waiting / Yet to commence: ${stage.name}`
                      }
                    >
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : isRejected ? (
                        <X size={16} strokeWidth={3} />
                      ) : (
                        <span className="text-xs font-bold text-slate-500">{idx + 1}</span>
                      )}
                    </div>

                    {/* Stage Name */}
                    <div className="mt-2 text-center w-full px-1">
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => handleStageNameEdit(stage.id, e.target.value)}
                        className={`text-xs text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-1 py-0.5 rounded transition-all truncate w-full ${
                          isCompleted 
                            ? 'text-emerald-700 font-bold' 
                            : isRejected 
                              ? 'text-red-700 font-bold' 
                              : 'text-slate-500 font-medium'
                        }`}
                        title="Click to rename round"
                      />

                      {/* Date / Status Badge */}
                      <div className="mt-1 flex items-center justify-center">
                        {editingDateStageId === stage.id ? (
                          <div className="flex items-center gap-1 bg-white p-1 rounded-md shadow-lg border border-slate-200 z-20">
                            <input
                              type="text"
                              placeholder="e.g. 26 Sep, 7pm"
                              value={dateInputValue}
                              onChange={(e) => setDateInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleDateSave(stage.id)}
                              className="text-[11px] px-1.5 py-0.5 border border-slate-300 rounded w-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleDateSave(stage.id)}
                              className="bg-blue-600 text-white p-0.5 rounded hover:bg-blue-700"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDateStageId(null)}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDateStageId(stage.id);
                              setDateInputValue(stage.date || '');
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors border ${
                              stage.date 
                                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold' 
                                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 font-normal'
                            }`}
                            title="Click to set or change date/time"
                          >
                            <Calendar size={10} className={stage.date ? 'text-amber-600' : 'text-slate-400'} />
                            <span className="truncate max-w-[95px]">
                              {formatDateDisplay(stage.date)}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Hover action controls: Green Tick, Red Cross, Reset to Grey */}
                      <div className="mt-2 flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Green Tick Shortlist button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stage.id, 'completed')}
                          className={`p-1 rounded-full transition-transform active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-2xs'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                          }`}
                          title="Mark Cleared / Shortlisted further (Green Tick ✓)"
                        >
                          <Check size={12} strokeWidth={2.5} />
                        </button>

                        {/* Red Cross Reject button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stage.id, 'rejected')}
                          className={`p-1 rounded-full transition-transform active:scale-95 ${
                            isRejected
                              ? 'bg-red-600 text-white ring-2 ring-red-300 shadow-2xs'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                          }`}
                          title="Mark Rejected at this round (Red Cross ✕)"
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>

                        {/* Reset to Pending/Grey button */}
                        {!isPending && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(stage.id, 'pending')}
                            className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                            title="Reset to Waiting / Yet to commence"
                          >
                            <RotateCcw size={11} />
                          </button>
                        )}

                        {/* Delete stage button */}
                        {stages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStage(stage.id)}
                            className="p-1 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete this round"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Single Continuous Connecting Line between this node and the next */}
                {nextStage && (
                  <div className="flex-1 mt-4 -mx-1 h-[3px] self-start transition-colors duration-300">
                    <div className={`w-full h-full rounded-full ${connectorColor}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
