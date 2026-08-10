export interface SubjectGrade {
  subject: string;
  score: number; // 0 - 100
}

export interface Student {
  id: string; // e.g. "STU101" or "101"
  name: string;
  email?: string;
  department?: string;
  grades: SubjectGrade[]; // list of subject grades
  overallScore: number; // calculated average of grades or primary score
  letterGrade: string; // A, B, C, D, F
  gpa: number; // 0.0 - 4.0 scale
  status: 'Passed' | 'Failed';
  remarks?: string;
}

export interface ClassStatistics {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  highestStudent: Student | null;
  lowestScore: number;
  lowestStudent: Student | null;
  passCount: number;
  failCount: number;
  passRate: number; // percentage
  gradeDistribution: {
    A: number; // 90-100
    B: number; // 80-89
    C: number; // 70-79
    D: number; // 60-69
    F: number; // < 60
  };
}

export type StorageType = 'ARRAY_LIST' | 'FIXED_ARRAY';

export type AppViewMode = 'GUI' | 'CONSOLE';

export interface SearchStep {
  index: number;
  studentId: string;
  found: boolean;
  explanation: string;
}
