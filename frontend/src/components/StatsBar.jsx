import React from 'react';
import { Building2, Clock, CheckCircle2, XCircle, Calendar, Sparkles } from 'lucide-react';

export default function StatsBar({ applications, currentStatus, onStatusChange }) {
  const total = applications.length;
  const active = applications.filter(a => a.status === 'active').length;
  const shortlisted = applications.filter(a => a.status === 'shortlisted' || a.status === 'offer').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  // Find upcoming scheduled tests / interviews
  const upcomingEvents = [];
  applications.forEach(app => {
    (app.stages || []).forEach(stage => {
      if (stage.date && stage.status !== 'rejected') {
        upcomingEvents.push({
          company: app.company,
          stageName: stage.name,
          date: stage.date,
          status: stage.status
        });
      }
    });
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
      {/* 1. In Progress (Active by default on Home Page) */}
      <button
        type="button"
        onClick={() => onStatusChange('active')}
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative shadow-2xs ${
          currentStatus === 'active'
            ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            currentStatus === 'active' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'
          }`}>
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {active}
            </p>
          </div>
        </div>
        {currentStatus === 'active' && (
          <span className="absolute bottom-1.5 right-2.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
            Home View
          </span>
        )}
      </button>

      {/* 2. Shortlisted / Offers */}
      <button
        type="button"
        onClick={() => onStatusChange('shortlisted')}
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative shadow-2xs ${
          currentStatus === 'shortlisted'
            ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            currentStatus === 'shortlisted' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Shortlisted / Offers
            </span>
            <p className="text-xl font-extrabold text-emerald-600 leading-tight">
              {shortlisted}
            </p>
          </div>
        </div>
        {currentStatus === 'shortlisted' && (
          <span className="absolute bottom-1.5 right-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
            Selected
          </span>
        )}
      </button>

      {/* 3. Rejected */}
      <button
        type="button"
        onClick={() => onStatusChange('rejected')}
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative shadow-2xs ${
          currentStatus === 'rejected'
            ? 'bg-red-50/70 border-red-400 ring-2 ring-red-400 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            currentStatus === 'rejected' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'
          }`}>
            <XCircle size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Rejected
            </span>
            <p className="text-xl font-extrabold text-red-600 leading-tight">
              {rejected}
            </p>
          </div>
        </div>
        {currentStatus === 'rejected' && (
          <span className="absolute bottom-1.5 right-2.5 text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
            Selected
          </span>
        )}
      </button>

      {/* 4. Total Companies (All) */}
      <button
        type="button"
        onClick={() => onStatusChange('All')}
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative shadow-2xs ${
          currentStatus === 'All'
            ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400 shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            currentStatus === 'All' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
          }`}>
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              All Companies
            </span>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">
              {total}
            </p>
          </div>
        </div>
        {currentStatus === 'All' && (
          <span className="absolute bottom-1.5 right-2.5 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
            Selected
          </span>
        )}
      </button>

      {/* 5. Next Scheduled Event */}
      <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-gradient-to-br from-indigo-50 to-blue-50 p-3.5 rounded-xl border border-indigo-100 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Calendar size={18} />
        </div>
        <div className="truncate">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
            <Sparkles size={11} /> Next Scheduled
          </span>
          <p className="text-xs font-bold text-slate-900 truncate">
            {upcomingEvents.length > 0 ? (
              `${upcomingEvents[0].company}: ${upcomingEvents[0].date}`
            ) : (
              'None scheduled'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
