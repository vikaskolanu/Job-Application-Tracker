import React from 'react';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  GraduationCap,
  X
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  onOpenAddModal,
  onResetSeed
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding & Main Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Job Application Tracker
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Tracker
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track interview stages, schedule assessments & manage documents
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Reset / Clear Tracker */}
            <button
              type="button"
              onClick={onResetSeed}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-colors"
              title="Reset tracker to start fresh"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            {/* Add Application Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 px-4 py-2 rounded-lg transition-all active:scale-98"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Track Application</span>
            </button>
          </div>
        </div>

        {/* Search & Campus Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-3 gap-3 border-t border-slate-100 pt-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, role, stage or topic (e.g. Tesco, DSA, OS, LLD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Campus Type Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 px-1.5">Type:</span>
            {['All', 'On-Campus', 'Off-Campus'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  typeFilter === t
                    ? 'bg-white text-blue-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
