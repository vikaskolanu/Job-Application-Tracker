import React from 'react';
import { BookOpen, Check, Edit3 } from 'lucide-react';

export default function TopicKnowledgeSection({ topics = [], onChange, onOpenEditModal }) {
  const handleToggleSelect = (topicId) => {
    onChange(
      topics.map(t => t.id === topicId ? { ...t, selected: !t.selected } : t)
    );
  };

  const handleSelectAll = (selectState) => {
    onChange(topics.map(t => ({ ...t, selected: selectState })));
  };

  const selectedCount = topics.filter(t => t.selected).length;

  return (
    <div className="w-full pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen size={13} className="text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Required Topic Knowledge
          </span>
          {topics.length > 0 && (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {selectedCount}/{topics.length} prepared
            </span>
          )}
        </div>

        {topics.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSelectAll(selectedCount !== topics.length)}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline"
            >
              {selectedCount === topics.length ? 'Deselect All' : 'Select All'}
            </button>
            {onOpenEditModal && (
              <button
                type="button"
                onClick={onOpenEditModal}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                title="Edit or add more topics in Opportunity Edit modal"
              >
                <Edit3 size={11} />
                <span>Edit</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Topic Chips List: Clean, No Strikethrough, Clickable Select/Deselect */}
      <div className="flex flex-wrap items-center gap-2">
        {topics.map((topic) => {
          const isSelected = topic.selected;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleToggleSelect(topic.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all select-none border shadow-2xs ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold ring-1 ring-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
              title={isSelected ? "Prepared! Click to mark as not yet prepared" : "Click to mark as prepared (green check)"}
            >
              {/* Checkbox badge */}
              <span className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                isSelected 
                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                  : 'bg-slate-50 border-slate-300'
              }`}>
                {isSelected && <Check size={12} strokeWidth={3} />}
              </span>

              {/* Clean text without strikethrough */}
              <span>
                {topic.name}
              </span>
            </button>
          );
        })}

        {topics.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
            <span>No specific topics listed.</span>
            {onOpenEditModal && (
              <button
                type="button"
                onClick={onOpenEditModal}
                className="text-blue-600 hover:underline font-medium"
              >
                + Add topics in Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
