import React from 'react';
import { Student, StorageType } from '../types';
import {
  X,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  User,
  GraduationCap
} from 'lucide-react';

interface StudentDetailModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  storageType: StorageType;
  arrayIndex?: number;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  student,
  onClose,
  storageType,
  arrayIndex = 0,
}) => {
  React.useEffect(() => {
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

  if (!isOpen || !student) return null;

  const isPassed = student.status === 'Passed';

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
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl font-mono shadow-inner">
              {student.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">{student.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                {student.department || 'Computer Science'} • {student.email}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Big Grade Summary Card */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Overall Score</span>
              <span className="text-2xl font-extrabold font-mono text-amber-400">
                {student.overallScore.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Letter Grade</span>
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                {student.letterGrade}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">GPA</span>
              <span className="text-2xl font-extrabold font-mono text-slate-100">
                {student.gpa.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Subject Breakdown List */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Individual Subject Marks
            </h3>

            <div className="space-y-2">
              {student.grades.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">{g.subject}</span>
                    <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          g.score >= 80
                            ? 'bg-emerald-500'
                            : g.score >= 60
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, g.score))}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-slate-100">{g.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Record Lookup Meta */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
            <div className="text-amber-400 font-semibold flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Student Record Metadata:
            </div>
            <div>
              Record Index: <span className="text-amber-300 font-bold">#{arrayIndex + 1}</span>
            </div>
            <div>
              Status: <span className={isPassed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{student.status}</span>
            </div>
          </div>

          {/* Remarks */}
          {student.remarks && (
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs text-slate-300">
              <strong className="text-slate-200 block mb-0.5">Faculty Remarks:</strong>
              {student.remarks}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
