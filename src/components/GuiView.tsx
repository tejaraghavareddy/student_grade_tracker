import React, { useState } from 'react';
import { Student, ClassStatistics, StorageType } from '../types';
import {
  Search,
  Plus,
  UserCheck,
  Eye,
  Edit2,
  Trash2,
  BarChart2,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

interface GuiViewProps {
  students: Student[];
  stats: ClassStatistics;
  storageType: StorageType;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: Student, index: number) => void;
  searchedStudentId: string | null;
}

export const GuiView: React.FC<GuiViewProps> = ({
  students,
  stats,
  storageType,
  searchTerm,
  setSearchTerm,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  searchedStudentId,
}) => {
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'id' | 'name' | 'overallScore'>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter & Search Logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || student.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Sort Logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortField === 'overallScore') {
      return sortAsc ? a.overallScore - b.overallScore : b.overallScore - a.overallScore;
    }
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    // id sort
    const numA = parseInt(a.id) || 0;
    const numB = parseInt(b.id) || 0;
    if (numA !== 0 && numB !== 0) {
      return sortAsc ? numA - numB : numB - numA;
    }
    return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
  });

  const toggleSort = (field: 'id' | 'name' | 'overallScore') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const departments = Array.from(new Set(students.map((s) => s.department || 'Computer Science')));

  return (
    <div className="space-y-6">
      {/* Top Toolbar Section */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar - Highlighted ID Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="search-student-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student by ID (e.g. 103) or Name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-[11px] font-mono text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 shrink-0">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Depts</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Passed font-bold">Passed Only</option>
              <option value="Failed font-bold">Failed Only</option>
            </select>

            {/* Add Student Button */}
            <button
              id="add-student-btn"
              onClick={onAddStudent}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

      {/* Bento Box 3: Main Student Records Table Container */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Student Records Summary Report
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              ({sortedStudents.length} of {students.length} students)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80 font-mono text-[11px]">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="px-6 py-3.5 cursor-pointer hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="px-6 py-3.5 cursor-pointer hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Subject Marks</th>
                <th
                  onClick={() => toggleSort('overallScore')}
                  className="px-6 py-3.5 cursor-pointer hover:text-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Average</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-3">
                      <Search className="w-8 h-8 mx-auto text-slate-600" />
                      <p className="font-semibold text-slate-300 text-sm">
                        {students.length === 0 ? 'No student records in system' : 'No matching student records found'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {students.length === 0
                          ? 'Click "Add Student" above to enter student grade data manually or use the interactive Java console.'
                          : 'Try adjusting your search term or department filters.'}
                      </p>
                      {students.length === 0 && (
                        <button
                          onClick={onAddStudent}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          Add Student
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                sortedStudents.map((student, idx) => {
                  const isHighlighted =
                    searchedStudentId && student.id.toLowerCase() === searchedStudentId.toLowerCase();
                  const isPassed = student.status === 'Passed';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isHighlighted ? 'bg-amber-500/10 border-l-4 border-amber-500' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="px-6 py-4 font-mono font-bold text-amber-400 text-xs">
                        #{student.id}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-100">{student.name}</div>
                        {student.email && (
                          <div className="text-[11px] text-slate-500 font-mono">{student.email}</div>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 text-slate-400 font-medium text-xs">
                        {student.department || 'Computer Science'}
                      </td>

                      {/* Subject Marks Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.grades.map((g, gIdx) => (
                            <span
                              key={gIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                              title={`${g.subject}: ${g.score}%`}
                            >
                              {g.subject.split(' ')[0]}: <strong className="text-amber-300">{g.score}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Avg Score */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-100 text-sm">
                        {student.overallScore.toFixed(2)}
                      </td>

                      {/* Letter Grade */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block w-7 h-7 rounded-lg text-center leading-7 font-bold font-mono text-xs ${
                            student.letterGrade === 'A'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : student.letterGrade === 'B'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : student.letterGrade === 'C'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : student.letterGrade === 'D'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {student.letterGrade}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPassed
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => onViewStudent(student, idx)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                          title="View Full Grade Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                          title="Edit Student Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bento Box 4: Grade Distribution Histogram Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
              Class Grade Distribution Breakdown (A - F)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Evaluation: {stats.totalStudents} students
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { grade: 'A', count: stats.gradeDistribution.A, range: '90-100%', color: 'bg-emerald-500' },
            { grade: 'B', count: stats.gradeDistribution.B, range: '80-89%', color: 'bg-blue-500' },
            { grade: 'C', count: stats.gradeDistribution.C, range: '70-79%', color: 'bg-amber-500' },
            { grade: 'D', count: stats.gradeDistribution.D, range: '60-69%', color: 'bg-orange-500' },
            { grade: 'F', count: stats.gradeDistribution.F, range: '< 60%', color: 'bg-rose-500' },
          ].map((item) => {
            const pct = stats.totalStudents > 0 ? Math.round((item.count / stats.totalStudents) * 100) : 0;
            return (
              <div key={item.grade} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-slate-300 mb-1">
                    Grade {item.grade}
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-400 mb-2">
                    {item.count}
                  </div>
                </div>
                <div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.range} ({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
