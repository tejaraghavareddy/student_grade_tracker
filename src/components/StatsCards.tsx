import React from 'react';
import { ClassStatistics, StorageType } from '../types';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  Database,
  Info
} from 'lucide-react';

interface StatsCardsProps {
  stats: ClassStatistics;
  storageType: StorageType;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, storageType }) => {
  return (
    <div id="stats-cards-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Bento Box 1: Class Average Score */}
      <div id="stat-card-average" className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-amber-500/40 transition-all relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Class Average
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
              {stats.averageScore.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <span>Pass Rate: <strong className="text-emerald-400 font-mono">{stats.passRate}%</strong></span>
          <span className="text-slate-500 font-mono text-[11px]">sum / N</span>
        </div>
      </div>

      {/* Bento Box 2: Highest Score */}
      <div id="stat-card-highest" className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-emerald-500/40 transition-all relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
              <Award className="w-3.5 h-3.5" />
              Highest Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 font-mono font-bold text-xs">
              MAX
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {stats.highestScore.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">pts</span>
          </div>
        </div>

        <div className="mt-4 text-xs border-t border-slate-800/80 pt-3 flex items-center justify-between text-slate-300 truncate">
          {stats.highestStudent ? (
            <span className="truncate">
              Top: <strong className="text-slate-100">{stats.highestStudent.name}</strong> <span className="font-mono text-slate-400">(#{stats.highestStudent.id})</span>
            </span>
          ) : (
            <span className="text-slate-500">No data</span>
          )}
        </div>
      </div>

      {/* Bento Box 3: Lowest Score */}
      <div id="stat-card-lowest" className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-amber-500/40 transition-all relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              Lowest Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 font-mono font-bold text-xs">
              MIN
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
              {stats.lowestScore.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-mono">pts</span>
          </div>
        </div>

        <div className="mt-4 text-xs border-t border-slate-800/80 pt-3 flex items-center justify-between text-slate-300 truncate">
          {stats.lowestStudent ? (
            <span className="truncate">
              Lowest: <strong className="text-slate-100">{stats.lowestStudent.name}</strong> <span className="font-mono text-slate-400">(#{stats.lowestStudent.id})</span>
            </span>
          ) : (
            <span className="text-slate-500">No data</span>
          )}
        </div>
      </div>

      {/* Bento Box 4: Total Enrolled & Data Structure */}
      <div id="stat-card-total" className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Students
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
              {stats.totalStudents}
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {stats.passCount}
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold font-mono">
                <XCircle className="w-3.5 h-3.5" />
                {stats.failCount}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs border-t border-slate-800/80 pt-3 flex items-center justify-between text-slate-400">
          <span className="text-slate-400 text-[11px] font-mono">
            Pass Rate: <strong className="text-emerald-400">{stats.passRate}%</strong>
          </span>
          <span className="text-slate-500 text-[11px] font-mono">System Active</span>
        </div>
      </div>
    </div>
  );
};
