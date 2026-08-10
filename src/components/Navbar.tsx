import React from 'react';
import { AppViewMode, StorageType } from '../types';
import {
  GraduationCap,
  Terminal,
  Code,
  LayoutDashboard,
  Layers,
  Search,
  RotateCcw,
  BookOpen,
  Coffee
} from 'lucide-react';

interface NavbarProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
  studentCount: number;
  averageScore: number;
  onResetData: () => void;
  onQuickSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  storageType,
  setStorageType,
  studentCount,
  averageScore,
  onResetData,
  onQuickSearch,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-900/30">
              <Coffee className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  Student Grade Tracker
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Input, analyze, and manage student grade records
              </p>
            </div>
          </div>

          {/* Center Navigation - Mode Selectors */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              id="nav-btn-gui"
              onClick={() => setViewMode('GUI')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'GUI'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>GUI Mode</span>
            </button>

            <button
              id="nav-btn-console"
              onClick={() => setViewMode('CONSOLE')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'CONSOLE'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Terminal CLI</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search trigger */}
            <button
              id="quick-search-trigger"
              onClick={onQuickSearch}
              className="p-2 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
              title="Search student by ID"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-slate-400">Search ID</span>
            </button>

            {/* Reset data */}
            <button
              id="reset-data-btn"
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
