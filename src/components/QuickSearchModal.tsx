import React, { useState, useEffect } from 'react';
import { Student, StorageType, SearchStep } from '../types';
import {
  Search,
  X,
  CheckCircle2,
  XCircle,
  Eye,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  storageType: StorageType;
  onSelectStudent: (student: Student) => void;
  initialSearchId?: string;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  students,
  storageType,
  onSelectStudent,
  initialSearchId = '',
}) => {
  const [searchId, setSearchId] = useState(initialSearchId);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (initialSearchId) {
      setSearchId(initialSearchId);
      performSearch(initialSearchId);
    } else {
      setSearchId('');
      setSearchSteps([]);
      setFoundStudent(null);
      setHasSearched(false);
    }
  }, [initialSearchId, isOpen]);

  if (!isOpen) return null;

  const performSearch = (queryId: string) => {
    const trimmed = queryId.trim();
    if (!trimmed) return;

    setHasSearched(true);
    const steps: SearchStep[] = [];
    let match: Student | null = null;

    for (let i = 0; i < students.length; i++) {
      const current = students[i];
      const isMatch = current.id.toLowerCase() === trimmed.toLowerCase();

      steps.push({
        index: i,
        studentId: current.id,
        found: isMatch,
        explanation: `Index [${i}]: Checking Student ID '${current.id}' vs Target '${trimmed}' -> ${
          isMatch ? 'MATCH FOUND!' : 'No match'
        }`,
      });

      if (isMatch) {
        match = current;
        break; // Linear search terminates early upon match
      }
    }

    setSearchSteps(steps);
    setFoundStudent(match);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Java Search by Student ID</h2>
              <p className="text-xs text-slate-400">
                Quickly lookup student grade records by ID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Student ID (e.g. 101, 103)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shrink-0"
            >
              Search ID
            </button>
          </form>

          {/* Quick ID Chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-slate-500 font-mono text-[11px] shrink-0">Sample IDs:</span>
            {students.slice(0, 5).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSearchId(s.id);
                  performSearch(s.id);
                }}
                className="px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 font-mono text-amber-300 text-[11px] transition-colors shrink-0"
              >
                #{s.id}
              </button>
            ))}
          </div>

          {/* Search Results & Algorithm Step Trace */}
          {hasSearched && (
            <div className="space-y-4">
              {/* Algorithm Step Trace */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <span className="text-slate-400 font-semibold block mb-1">
                  Java Linear Search Algorithm Execution Trace:
                </span>
                {searchSteps.map((step) => (
                  <div
                    key={step.index}
                    className={`flex items-center gap-2 p-1.5 rounded ${
                      step.found
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span>{step.explanation}</span>
                  </div>
                ))}
              </div>

              {/* Match Result Card */}
              {foundStudent ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold text-slate-100">{foundStudent.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        ID: {foundStudent.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Average Score: <strong className="text-amber-400">{foundStudent.overallScore.toFixed(2)}</strong> | Grade: {foundStudent.letterGrade} ({foundStudent.status})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectStudent(foundStudent);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-xs">
                  <XCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>
                    <strong className="block text-slate-200">No matching student found</strong>
                    No record with ID '{searchId}' exists in current Java dataset.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
