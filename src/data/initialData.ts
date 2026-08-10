import { Student, ClassStatistics } from '../types';

export function calculateGradeDetails(score: number): { letterGrade: string; gpa: number; status: 'Passed' | 'Failed' } {
  const rounded = Math.round(score * 10) / 10;
  if (rounded >= 90) return { letterGrade: 'A', gpa: 4.0, status: 'Passed' };
  if (rounded >= 80) return { letterGrade: 'B', gpa: 3.0, status: 'Passed' };
  if (rounded >= 70) return { letterGrade: 'C', gpa: 2.0, status: 'Passed' };
  if (rounded >= 60) return { letterGrade: 'D', gpa: 1.0, status: 'Passed' };
  return { letterGrade: 'F', gpa: 0.0, status: 'Failed' };
}

export const INITIAL_STUDENTS: Student[] = [];

export function calculateClassStats(students: Student[]): ClassStatistics {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      highestScore: 0,
      highestStudent: null,
      lowestScore: 0,
      lowestStudent: null,
      passCount: 0,
      failCount: 0,
      passRate: 0,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
    };
  }

  let totalScore = 0;
  let highestScore = -1;
  let highestStudent: Student | null = null;
  let lowestScore = 101;
  let lowestStudent: Student | null = null;
  let passCount = 0;
  let failCount = 0;

  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  students.forEach((student) => {
    const score = student.overallScore;
    totalScore += score;

    if (score > highestScore) {
      highestScore = score;
      highestStudent = student;
    }

    if (score < lowestScore) {
      lowestScore = score;
      lowestStudent = student;
    }

    if (student.status === 'Passed') {
      passCount++;
    } else {
      failCount++;
    }

    if (score >= 90) distribution.A++;
    else if (score >= 80) distribution.B++;
    else if (score >= 70) distribution.C++;
    else if (score >= 60) distribution.D++;
    else distribution.F++;
  });

  const averageScore = Math.round((totalScore / students.length) * 100) / 100;
  const passRate = Math.round((passCount / students.length) * 1000) / 10;

  return {
    totalStudents: students.length,
    averageScore,
    highestScore: Math.round(highestScore * 100) / 100,
    highestStudent,
    lowestScore: Math.round(lowestScore * 100) / 100,
    lowestStudent,
    passCount,
    failCount,
    passRate,
    gradeDistribution: distribution,
  };
}
