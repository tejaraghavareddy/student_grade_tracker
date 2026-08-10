import React, { useState, useEffect } from 'react';
import { Student, SubjectGrade } from '../types';
import { calculateGradeDetails } from '../data/initialData';
import { X, Plus, Trash2, Save, Calculator, AlertCircle, BookOpen } from 'lucide-react';

export const PRESET_SUBJECTS = [
  'Java Programming',
  'Data Structures & Algorithms',
  'Database Systems',
  'Web Architecture & Development',
  'Operating Systems',
  'Discrete Mathematics',
  'Software Engineering',
  'Computer Networks',
  'Artificial Intelligence',
  'Machine Learning',
  'Cybersecurity Fundamentals',
  'Object-Oriented Design',
  'Cloud Computing',
  'Linear Algebra',
  'Calculus & Statistics',
];

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  editingStudent?: Student | null;
  existingIds: string[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingStudent,
  existingIds,
}) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [email, setEmail] = useState('');
  const [remarks, setRemarks] = useState('');
  const [grades, setGrades] = useState<SubjectGrade[]>([
    { subject: 'Java Programming', score: 85 },
    { subject: 'Data Structures', score: 80 },
  ]);
  const [error, setError] = useState<string | null>(null);

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
    if (editingStudent) {
      setId(editingStudent.id);
      setName(editingStudent.name);
      setDepartment(editingStudent.department || 'Computer Science');
      setEmail(editingStudent.email || '');
      setRemarks(editingStudent.remarks || '');
      setGrades(editingStudent.grades.length > 0 ? editingStudent.grades : [{ subject: 'Java Programming', score: 0 }]);
    } else {
      // Generate next suggested ID
      const nextId = String(Math.max(100, ...existingIds.map((idStr) => parseInt(idStr) || 100)) + 1);
      setId(nextId);
      setName('');
      setDepartment('Computer Science');
      setEmail('');
      setRemarks('');
      setGrades([
        { subject: 'Java Programming', score: 0 },
        { subject: 'Data Structures', score: 0 },
      ]);
    }
    setError(null);
  }, [editingStudent, isOpen, existingIds]);

  if (!isOpen) return null;

  // Real-time calculation preview
  const validScores = grades.filter((g) => !isNaN(g.score) && g.score >= 0 && g.score <= 100);
  const totalScoreSum = validScores.reduce((sum, g) => sum + g.score, 0);
  const calculatedAvg = validScores.length > 0 ? Math.round((totalScoreSum / validScores.length) * 100) / 100 : 0;
  const gradeDetails = calculateGradeDetails(calculatedAvg);

  const handleAddSubject = () => {
    setGrades([...grades, { subject: 'Java Programming', score: 0 }]);
  };

  const handleAddPresetSubject = (subjName: string) => {
    // Avoid adding duplicate if already in grades
    if (grades.some((g) => g.subject === subjName)) return;
    setGrades([...grades, { subject: subjName, score: 0 }]);
  };

  const handleRemoveSubject = (index: number) => {
    if (grades.length <= 1) return;
    setGrades(grades.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: 'subject' | 'score', value: string) => {
    const updated = [...grades];
    if (field === 'score') {
      const numVal = Math.min(100, Math.max(0, parseFloat(value) || 0));
      updated[index].score = numVal;
    } else {
      updated[index].subject = value;
    }
    setGrades(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = id.trim();
    const cleanName = name.trim();

    if (!cleanId) {
      setError('Student ID is required.');
      return;
    }

    if (!cleanName) {
      setError('Student Name is required.');
      return;
    }

    // Check duplicate ID if not editing
    if (!editingStudent && existingIds.includes(cleanId)) {
      setError(`Student ID '${cleanId}' already exists. Please use a unique ID.`);
      return;
    }

    if (grades.length === 0) {
      setError('At least one subject score is required.');
      return;
    }

    const newStudent: Student = {
      id: cleanId,
      name: cleanName,
      department: department.trim() || 'General Studies',
      email: email.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      grades: grades,
      overallScore: calculatedAvg,
      letterGrade: gradeDetails.letterGrade,
      gpa: gradeDetails.gpa,
      status: gradeDetails.status,
      remarks: remarks.trim() || undefined,
    };

    onSave(newStudent);
    onClose();
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {editingStudent ? 'Edit Student Record' : 'Add New Student Record'}
              </h2>
              <p className="text-xs text-slate-400">
                Input student information and subject marks
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={!!editingStudent}
                placeholder="e.g. 108"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Subject Grades Section */}
          <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Select Subjects & Scores (0 - 100)
              </span>
              <button
                type="button"
                onClick={handleAddSubject}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>

            {/* Quick Add Subject Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1 border-y border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Quick Select:</span>
              {[
                'Java Programming',
                'Data Structures & Algorithms',
                'Database Systems',
                'Web Architecture & Development',
                'Operating Systems',
                'Artificial Intelligence',
                'Computer Networks',
              ].map((subj) => {
                const isAlreadyAdded = grades.some((g) => g.subject === subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => handleAddPresetSubject(subj)}
                    disabled={isAlreadyAdded}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                      isAlreadyAdded
                        ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700/80 hover:border-amber-500/40'
                    }`}
                  >
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                    <span>{subj.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Subject Rows */}
            <div className="space-y-2.5 pt-1">
              {grades.map((grade, idx) => {
                const isPreset = PRESET_SUBJECTS.includes(grade.subject);
                const selectValue = isPreset ? grade.subject : '__CUSTOM__';

                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    {/* Select Subject Dropdown */}
                    <div className="flex-1 flex items-center gap-2">
                      <select
                        value={selectValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__CUSTOM__') {
                            handleSubjectChange(idx, 'subject', 'Custom Subject');
                          } else {
                            handleSubjectChange(idx, 'subject', val);
                          }
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                      >
                        <optgroup label="Standard Academic Subjects">
                          {PRESET_SUBJECTS.map((subj) => (
                            <option key={subj} value={subj} className="bg-slate-900 text-slate-100">
                              {subj}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Other / Custom">
                          <option value="__CUSTOM__" className="bg-slate-900 text-amber-300 font-bold">
                            ✏️ Enter Custom Subject Name...
                          </option>
                        </optgroup>
                      </select>

                      {/* If custom, allow typing custom name */}
                      {selectValue === '__CUSTOM__' && (
                        <input
                          type="text"
                          value={grade.subject === 'Custom Subject' ? '' : grade.subject}
                          onChange={(e) => handleSubjectChange(idx, 'subject', e.target.value || 'Custom Subject')}
                          placeholder="Type custom subject name..."
                          className="flex-1 bg-slate-950 border border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
                        />
                      )}
                    </div>

                    {/* Score Input & Action */}
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-24 relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={grade.score}
                          onChange={(e) => handleSubjectChange(idx, 'score', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 pr-6 text-right"
                        />
                        <span className="absolute right-2 top-1.5 text-xs text-slate-500 font-mono">%</span>
                      </div>

                      {grades.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                          title="Remove subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Calculated Results Summary */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-300/80 font-semibold block">Calculated Overall Average</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-amber-400">{calculatedAvg.toFixed(2)}</span>
                <span className="text-xs text-amber-300 font-semibold">
                  Grade {gradeDetails.letterGrade} ({gradeDetails.status})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">GPA: {gradeDetails.gpa.toFixed(1)} / 4.0</span>
              <span className="text-xs text-slate-400 block">{grades.length} subject(s)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Remarks / Feedback Notes
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Excellent active participation in lab tasks."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{editingStudent ? 'Update Record' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
