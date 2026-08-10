import React, { useState, useEffect } from 'react';
import { Student, AppViewMode, StorageType } from './types';
import { INITIAL_STUDENTS, calculateClassStats } from './data/initialData';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { GuiView } from './components/GuiView';
import { ConsoleView } from './components/ConsoleView';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { QuickSearchModal } from './components/QuickSearchModal';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('java_student_records_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Clear legacy storage that may contain old preset demo records
    localStorage.removeItem('java_student_records');
    return [];
  });

  const [viewMode, setViewMode] = useState<AppViewMode>('GUI');
  const [storageType, setStorageType] = useState<StorageType>('ARRAY_LIST');

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedStudentId, setSearchedStudentId] = useState<string | null>(null);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Persist students to localStorage
  useEffect(() => {
    localStorage.setItem('java_student_records_v2', JSON.stringify(students));
  }, [students]);

  const stats = calculateClassStats(students);

  // Handlers
  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map((s) => (s.id === student.id ? student : s)));
    } else {
      setStudents([...students, student]);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm(`Are you sure you want to remove student ID '${id}'?`)) {
      setStudents(students.filter((s) => s.id !== id));
      if (searchedStudentId === id) {
        setSearchedStudentId(null);
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('Clear all student records from the system?')) {
      setStudents([]);
      setSearchTerm('');
      setSearchedStudentId(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddEditModalOpen(true);
  };

  const handleViewStudent = (student: Student, index: number) => {
    setSelectedStudent(student);
    setSelectedIndex(index);
    setIsDetailModalOpen(true);
  };

  const handleSearchById = (id: string) => {
    setSearchTerm(id);
    setSearchedStudentId(id);
    setViewMode('GUI');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar Header */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        storageType={storageType}
        setStorageType={setStorageType}
        studentCount={students.length}
        averageScore={stats.averageScore}
        onResetData={handleResetData}
        onQuickSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Class Stats Bar */}
        <StatsCards stats={stats} storageType={storageType} />

        {/* View Switcher Content */}
        {viewMode === 'GUI' && (
          <GuiView
            students={students}
            stats={stats}
            storageType={storageType}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddStudent={handleOpenAdd}
            onEditStudent={handleOpenEdit}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={handleViewStudent}
            searchedStudentId={searchedStudentId}
          />
        )}

        {viewMode === 'CONSOLE' && (
          <ConsoleView
            students={students}
            stats={stats}
            storageType={storageType}
            onAddStudent={handleOpenAdd}
            onSearchById={handleSearchById}
            onRemoveStudent={handleDeleteStudent}
          />
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="bg-slate-900 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Student Grade Tracker • Built with React
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Average: <strong className="text-amber-400">{stats.averageScore.toFixed(2)}</strong></span>
            <span>Highest: <strong className="text-emerald-400">{stats.highestScore.toFixed(2)}</strong></span>
            <span>Lowest: <strong className="text-amber-400">{stats.lowestScore.toFixed(2)}</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        editingStudent={editingStudent}
        existingIds={students.map((s) => s.id)}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        student={selectedStudent}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
        }}
        storageType={storageType}
        arrayIndex={selectedIndex}
      />

      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        students={students}
        storageType={storageType}
        onSelectStudent={(st) => {
          setIsSearchModalOpen(false);
          handleViewStudent(st, students.findIndex((s) => s.id === st.id));
        }}
      />
    </div>
  );
}
